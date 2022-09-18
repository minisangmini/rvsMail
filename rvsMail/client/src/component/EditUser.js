import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../componentcss/EditUser.css';

function EditUser() {
  const addUserContainer = useRef();
  const userContainer = useRef();
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    try { 
      if(location.state.name === undefined) { navigate('/login'); alert('오류 발생! 다시 로그인 해주세요!'); return; };
      console.log(`${location.state.name}님 반갑습니다!`); 
    } catch(err) { navigate('/'); return; }
    getUserContainer();
    sessionStorage.removeItem('userInitMail');
  }, []);

  const pushUser = (data) => {
    try {
      userContainer.current.innerHTML = `<li>
      <span class='user-name'>이름</span>
      <span class='user-relation'>관계</span>
      <span class='user-mail'>이메일</span>
      <span class='send-record'>보낸 기록</span>
      <div class='control-user-button'>삭제 & 수정</div>
    </li>`;
      let li, div, button, span;
      data.forEach((val, index) => {
        li = document.createElement('li');
        li.innerHTML = `
        <span class='user-name'>${val.name}</span>
        <span class='user-relation'>${val.relation}</span>
        <span class='user-mail'>${val.mail}</span>
        `
        span = document.createElement('span');
        span.classList.add('send-record');
        button = document.createElement('button');
        button.innerText = '기록 보기';
        button.onclick = () => { navigate('/mailrecord', {state: {id: location.state.id}}) }
        span.appendChild(button);
        li.appendChild(span);
        

        div = document.createElement('div');
        div.classList.add('control-user-button');
        button = document.createElement('button');
        button.classList.add('delete');
        button.innerText = '삭제';
        button.onclick = deleteUser;
        div.appendChild(button);

        button = document.createElement('button');
        button.classList.add('edit');
        button.innerText = '수정';
        button.onclick = editUser;
        div.appendChild(button);
        li.appendChild(div);
        userContainer.current.appendChild(li);
      })
    } catch {}
  }

  const getUserContainer = () => {
    const req = { hostId: location.state.id };
    fetch('/getmailuser', {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(req)
    }).then(res => res.json())
    .then((res) => {
      if(res.success) { pushUser(res.data) } 
      else { alert(res.msg); }
    }) 
  }


  const createAddUserContainer = () => {
    if(addUserContainer.current.innerText !== "") {  addUserContainer.current.classList.remove('add-user-container'); addUserContainer.current.innerHTML=''; return };
    addUserContainer.current.classList.add('add-user-container');
    addUserContainer.current.innerHTML = `
      <input type='text' maxLength='5' placeholder='이름'/>
      <input type='text' maxLength='10' placeholder='관계' />
      <input type='text' maxLength='30' placeholder='메일' />
    `;
    let button = document.createElement('button');
    button.innerText = '추가하기';
    button.onclick = addUser;
    addUserContainer.current.appendChild(button);
    button = document.createElement('button');
    button.innerText = '취소하기';
    button.onclick = deleteAddUserContainer;
    addUserContainer.current.appendChild(button);
  }

  const deleteAddUserContainer = () => {
    addUserContainer.current.classList.remove('add-user-container');
    addUserContainer.current.innerHTML = '';
  }

  const addUser = () => {
    const reqKey = ['name', 'relation', 'mail'];
    const req = {
      hostId: location.state.id,
      name: "",
      relation: "",
      mail: ""
    };
    const x = addUserContainer.current.getElementsByTagName('input');
    Object.values(x).forEach((val, index) => {
      req[reqKey[index]] = val.value.replace(/ /g, '');
    });
    if(!req.name || !req.relation || !req.mail) { alert("빈 값이 있습니다!"); return };
    if(!req.mail.includes('@') || !req.mail.includes('.')) { alert("올바르지 않은 메일 형식입니다!"); return };

    fetch('/addmailuser', {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(req)
    }).then(res => res.json())
    .then((res) => {
      if(res.success) {
        deleteAddUserContainer();
        getUserContainer();
      } else {
        alert(res.msg);
        deleteAddUserContainer();
      }
    })
  }

  const deleteUser = (e) => {
    const liContainer = e.target.parentNode.parentNode
    const userMail = liContainer.children[2].innerText;
    fetch('/deletemailuser', {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({mail: userMail, hostId: location.state.id})
    }).then(res => res.json())
    .then((res) => {
      if(res.success) {
        liContainer.remove();
      } else { alert(res.msg); }
    })
  }

  const editUser = (e) => {
    if(window.sessionStorage.getItem('userInitMail')) { alert("한 개씩만 수정해주세요!"); return };
    const liContainer = e.target.parentNode.parentNode
    window.sessionStorage.setItem('userInitMail', liContainer.children[2].innerText);
    liContainer.classList.add('edit-li-container');
    liContainer.innerHTML = `
    <input type='text' class='edit-user-name' value='${liContainer.children[0].innerText}' maxLength='5' placeholder='이름'/>
    <input type='text' class='edit-user-relation' value='${liContainer.children[1].innerText}' maxLength='10' placeholder='관계' />
    <input type='text' class='edit-user-mail' value='${liContainer.children[2].innerText}' maxLength='30' placeholder='메일' />`;
    const div = document.createElement('div');
    div.classList.add('edit-button');
    let button = document.createElement('button');
    button.innerText = '수정';
    button.onclick = updateUser;
    div.appendChild(button);

    button = document.createElement('button');
    button.innerText = '취소';
    button.onclick = deleteEditUser;
    div.appendChild(button);
    liContainer.appendChild(div);

  }

  const updateUser = (e) => {
    const liContainer = e.target.parentNode.parentNode
    const data = {hostId: location.state.id, initMail: window.sessionStorage.getItem('userInitMail'), name: liContainer.children[0].value, relation: liContainer.children[1].value, mail: liContainer.children[2].value};
    liContainer.innerHTML = `
    <span class='user-name'>${data.name}</span>
    <span class='user-relation'>${data.relation}</span>
    <span class='user-mail'>${data.mail}</span>
    `
    let div, button, span;

    span = document.createElement('span');
    span.classList.add('send-record');
    button = document.createElement('button');
    button.innerText = '기록 보기';
    button.onclick = () => { navigate('/mailrecord', {state: {id: location.state.id}}) }
    span.appendChild(button);
    liContainer.appendChild(span);

    div = document.createElement('div');
    div.classList.add('control-user-button');
    button = document.createElement('button');  
    button.classList.add('delete');
    button.innerText = '삭제';
    button.onclick = deleteUser;
    div.appendChild(button);

    button = document.createElement('button');
    button.classList.add('edit');
    button.innerText = '수정';
    button.onclick = editUser;
    div.appendChild(button);
    liContainer.appendChild(div);

    window.sessionStorage.removeItem('userInitMail');

    fetch('/updateuser', {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data)
    }).then(res => res.json())
    .then((res) => {
      if(!res.success) alert(res.msg);
    }) 
  }
  const deleteEditUser = (e) => {
    const liContainer = e.target.parentNode.parentNode
    const data = {name: liContainer.children[0].value, relation: liContainer.children[1].value, mail: liContainer.children[2].value};
    liContainer.innerHTML = `
    <span class='user-name'>${data.name}</span>
    <span class='user-relation'>${data.relation}</span>
    <span class='user-mail'>${data.mail}</span>
    `
    let div, button, span;

    span = document.createElement('span');
    span.classList.add('send-record');
    button = document.createElement('button');
    button.innerText = '기록 보기';
    button.onclick = () => { navigate('/mailrecord', {state: {id: location.state.id}}) }
    span.appendChild(button);
    liContainer.appendChild(span);

    div = document.createElement('div');
    div.classList.add('control-user-button');
    button = document.createElement('button');
    button.classList.add('delete');
    button.innerText = '삭제';
    button.onclick = deleteUser;
    div.appendChild(button);

    button = document.createElement('button');
    button.classList.add('edit');
    button.innerText = '수정';
    button.onclick = editUser;
    div.appendChild(button);
    liContainer.appendChild(div);
    liContainer.classList.remove('edit-li-container');

    window.sessionStorage.removeItem('userInitMail');
  }


  return (
    <>
      <button className='add-user-botton' onClick={createAddUserContainer}>+ 추가하기</button>
      <div id='add-user-container' ref={addUserContainer}></div>
      <div className='edit-user-container'>
        <ul ref={userContainer}>
        </ul>
      </div>
    </>
  )
}

export default EditUser