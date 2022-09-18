import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../componentcss/SendMail.css';

function SendMail() {
  const userContainer = useRef();
  const alertBox = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if(location.state.name === undefined) { navigate('/login'); alert('오류 발생! 다시 로그인 해주세요!'); return; };
    try { console.log(`${location.state.name}님 반갑습니다!`); } catch(err) { navigate('/'); return; }
    sessionStorage.setItem('sendList', JSON.stringify([]));
    getUserContainer();
  }, [])

  const pushUser = (data) => {
    try {
      userContainer.current.innerHTML = `
      <li>
          <span class='user-name'>이름</span>
          <span class='user-relation'>관계</span>
          <span class='user-mail'>이메일</span>
          <span class='check-send'>보내는 여부</span>
      </li>
      `;
      let li, checkbox;
      data.forEach((val) => {
        li = document.createElement('li');
        li.innerHTML = `
          <span class='user-name'>${val.name}</span>
          <span class='user-relation'>${val.relation}</span>
          <span class='user-mail'>${val.mail}</span>
        `;
        checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.classList.add('check-send');
        checkbox.onclick = (e) => {controlSendList(e.target.checked, val.mail)};
        li.appendChild(checkbox);
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

  const controlSendList = (is, mail) => {
    if(is) addSendList(mail);
    else removeSendList(mail);
  }

  const addSendList = (mail) => {
    let list = JSON.parse(sessionStorage.getItem('sendList'));
    list.push(mail);
    sessionStorage.setItem('sendList', JSON.stringify(list));
  }

  const removeSendList = (mail) => {
    const list = JSON.parse(sessionStorage.getItem('sendList'));
    list.forEach((val, idx) => { 
      if(val === mail) {
        list.splice(idx, 1);
        sessionStorage.setItem('sendList', JSON.stringify(list));
        return;
      }
    })
  }

  const allCheck = (isCheck) => {
    const lis = userContainer.current.children;
    const list = JSON.parse(sessionStorage.getItem('sendList'));
    for(const key of lis) {
      if(isCheck) {
        if(key.children[2].innerText !== "이메일") {
          if(key.children[3].checked) {
            list.splice(list.indexOf(key.children[2].innerText), 1);
          } else {
            list.push(key.children[2].innerText);
          }
        }
      }
      else {
        list.forEach((val, idx) => { 
          if(val === key.children[2].innerText) {
            list.splice(idx, 1);
          }
        })
      }
      key.children[3].checked = !key.children[3].checked;
    }
    sessionStorage.setItem('sendList', JSON.stringify(list));
  }

  const sendMail = () => {
    if(JSON.parse(sessionStorage.getItem('sendList')).length === 0) { alert("1명 이상 선택해주세요!"); return; };
    navigate('/writemail', 
    { state: {mail: JSON.parse(sessionStorage.getItem('sendList')),
     hostMail: location.state.mail, mailPsword: location.state.mailPsword, id: location.state.id }});
  }


  return (
    <>
    <button className='send-user-botton' onClick={sendMail}>보내기</button>
    <div className='all-check-container'>
      <label htmlFor='allCheck'>모두 체크</label><input type='checkbox' className='all-check' id='allCheck' onClick={(e) => {
        allCheck(e.target.value);
      }} /> 
    </div>
    <div className='send-user-container'>
      <ul ref={userContainer}>
      </ul>
    </div>
    <div className='alert-box' ref={alertBox}>
      
    </div>
    </>
  )
}

export default SendMail