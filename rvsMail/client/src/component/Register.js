import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../componentcss/Register.css"

function Register() {
  const [id, setId] = useState();
  const [psword, setPsword] = useState();
  const [name, setName] = useState();
  const [mail, setMail] = useState();
  const [sendingMail, setSendingMail] = useState(false);
  const [mailCode, setMailCode] = useState();
  const [complete, setComplete] = useState({ id: false, psword: false, confirmPsword: false, mail: false });
  const navigate = useNavigate();


  const changeComplete = (key, value) => {
    const a = {...complete}; 
    a[key] = value;
    setComplete(a);
  }

  const checkId = () => {
    const req = { key: "id", value: id };
    fetch("/checkinfo", {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(req)
    }).then((res) => res.json())
    .then ((res) => {
      if(res.success) {
        if(window.confirm("사용 가능한 아이디입니다. 사용하시겠습니까?")) {
          document.getElementById("id").disabled = true;
          document.getElementById("checkId").disabled = true;
          changeComplete("id", true);
        }
      } else alert("이미 존재하는 아이디입니다!");
    })
  }

  const checkPsword = (_psword) => {
    if(_psword) {
      const testPsword = /[!@#$%^&*()_+~`]/gi;
      if(testPsword.test(_psword) && _psword.length > 6) {
        document.getElementById('psword').classList.remove('register-wrong');
        document.getElementById('psword').classList.add('register-right');
        changeComplete("psword", true);
        setPsword(_psword);
      } else {
        document.getElementById("psword").classList.add("register-wrong");
        changeComplete("psword", false);
      }
    } else {
      document.getElementById('psword').classList.remove('register-wrong');
      document.getElementById('psword').classList.remove('register-right');
      changeComplete("psword", false);
    }
  }

  const checkConfirmPsword = (_psword) => {
    if(_psword) {
      if(psword === _psword) {
        document.getElementById('confirmPsword').classList.remove('register-wrong');
        document.getElementById('confirmPsword').classList.add('register-right');
        changeComplete("confirmPsword", true);
      } else {
        document.getElementById("confirmPsword").classList.add("register-wrong");
        changeComplete("confirmPsword", false);
      }
    } else {
      document.getElementById('confirmPsword').classList.remove('register-wrong');
      document.getElementById('confirmPsword').classList.remove('register-right');
      changeComplete("confirmPsword", false);
    }
  }

  const checkName = () => {
    let checkingName = /^[가-힣]{2,4}$/;
    if(checkingName.test(name)) return true;
    return false;
  }

  const checkMail = () => {
    if(sendingMail) { alert("메일을 보내는 중입니다!"); return };
    if(!mail.includes('@') || !mail.includes('.') || mail.includes(' ')) { alert("올바른 메일 형식이 아닙니다"); return; }

    const req = { key: "mail", value: mail };
    fetch("/checkinfo", {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(req)
    }).then((res) => res.json())
    .then ((res) => {
      if(res.success) {
        if(window.confirm("사용 가능한 이메일입니다. 인증번호를 보내시겠습니까?")) {
          document.getElementById("mail").disabled = true;
          document.getElementById("sendMail").disabled = true;
          
          sendMail();
        }

        return;
      }
      alert("이미 존재하는 이메일입니다!");
    })
  }
  
  const sendMail = () => {
    const req = { mail: mail };
    setSendingMail(true);
    fetch("/sendmail", {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(req)
    }).then((res) => res.json())
    .then((res) => {
      console.log(res);
      alert(res.msg);
      setSendingMail(false);
      if(res.success) {
        setMailCode(res.mailCode);
        document.getElementById("mail").disabled = true;
        document.getElementById("sendMail").disabled = true;
      }
    })
  }

  const checkMailCode = () => {
    if(!mailCode) { alert("이메일 인증을 먼저 해주세요!"); return };
    if(document.getElementById('mailCode').value === mailCode.toString()) {
      alert("인증이 완료 되었습니다!")
      changeComplete("mail", true);
      document.getElementById("mailCode").disabled = true;
      document.getElementById("checkMailCode").disabled = true;
    }
    else alert('코드가 일치하지 않습니다. 다시 확인해주세요!');
  }

  const register = () => {
    if(!complete.id) { alert("아이디 중복 확인을 먼저 해주세요!"); return; }
    if(!complete.psword) { alert("비밀번호 조건을 확인해주세요!"); return; }
    if(!complete.confirmPsword) { alert("비밀번호가 다릅니다!"); return; }
    if(!checkName()) { alert("이름을 올바르게 입력해주세요!"); return; }
    if(!complete.mail) { alert("이메일 인증을 해주세요!"); return; }
    const req = {
      id: id,
      psword: psword,
      name: name,
      mail: mail
    };
    fetch('/register', {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(req)
    }).then((res) => res.json())
    .then((res) => {
      alert(res.msg)
      if(res.success) {
        navigate('/login');
      }
    })
  }

  return (
    <>
    <div className="register-container">
      <p className='id-title'>아이디</p>
      <input type="text" className='register-id' id="id" maxLength="20" placeholder="아이디" onChange={(e) => {setId(e.target.value)}} /> <button className='check-id' id="checkId" onClick={checkId}>중복확인</button> <br />
      <p className='psword-title'>비밀번호</p>
      <input type="password" className='register-psword' id="psword" maxLength="20" placeholder="비밀번호" onChange={(e) => {
        checkPsword(e.target.value);
        }} /> 
      <p className='psword-info'>*6자리 이상, 특수문자 1개 이상 포함</p><br />
      <input type="password" className='register-confirm-psword' maxLength="20" id="confirmPsword" placeholder="비밀번호 확인" onChange={(e) => {
        checkConfirmPsword(e.target.value)}} /> <br />
      <p className='name-title'>이름</p>
      <input type="text" className='register-name' id="name" placeholder="이름" onChange={(e) => {setName(e.target.value)}} /> <br />
      <p className='mail-title'>메일(gmail만 사용 가능)</p>
      <input type="text" className='register-mail' id="mail" maxLength="30" placeholder="이메일" onChange={(e) => {setMail(e.target.value)}} /> <button className='send-mail' id="sendMail" onClick={checkMail}>인증번호 보내기</button> <br />
      <input type="text" className='register-mail-code' id="mailCode" placeholder="인증 번호" /> <button className='check-mail-code' id="checkMailCode" onClick={checkMailCode}>인증하기</button> <br />
      <button className='register-submit' id="submit" onClick={register}>회원가입 하기</button> <br />
    </div>
    </>
  )
}

export default Register