import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'
import '../componentcss/Login.css'


function Login() {
  const [id, setId] = useState();
  const [psword, setPsword] = useState();
  const [keepLogin, setKeepLogin] = useState(false);
  const [, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();


  const errMsg = (msg) => {
    const err = document.getElementById('error-msg');
    err.innerText = msg;
    err.classList.add('error-animation');
    err.addEventListener("animationend", () => {
      err.classList.remove('error-animation');
    })
  }

  const login = () => {
    if(!id) { errMsg("아이디를 입력해주세요!"); return; }
    if(!psword) { errMsg("비밀번호를 입력해주세요!"); return; }
    const req = {
      id: id,
      psword: psword,
      keepLogin: keepLogin
    };
    fetch('/login', {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(req)
    }).then((res) => res.json())
    .then((res) => {
      if(res.success) {
        const opt = keepLogin ? {secret:"qwer1234", maxAge: 1000 * 60 * 60 * 24 * 365} : null;
        setCookie('token', res.token, opt);
        setCookie('isLogin', true, opt);
        navigate('/');
      } else {
        errMsg(res.msg)
        removeCookie('token');
        removeCookie('isLogin');
      }
    })
  }

  return (
    <>
    <div className="login-container">
      <p className='login-info'>모든 서비스는 <u>로그인</u> 후 이용 가능하십니다</p>
      <input type="text" className='login-id' id="id" placeholder="id" onChange={(e) => {setId(e.target.value)}} /> <br />
      <input type="password" className='login-psword' id="psword" placeholder="psword" onChange={(e) => {setPsword(e.target.value)}} /> <br />
      <div className="keepLogin-container">
        <input type="checkbox" className='login-keepLogin' id="keepLogin" onClick={(e) => setKeepLogin(e.target.checked)} /> <label htmlFor="keepLogin">로그인 유지</label>
      </div>
      <p id="error-msg"></p>
      <button className='login-submit' id="submit" onClick={login}>로그인 하기</button> <br />
      <Link to="/register" className="go-register">회원가입 하러 가기</Link>
      <Link to="#" className="find-info">아이디 또는 비밀번호 찾으러 가기</Link>
    </div>
    </>
  )
}

export default Login