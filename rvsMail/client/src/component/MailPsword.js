import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import '../componentcss/MailPsword.css';

function MailPsword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cookies, ,removeCookie] = useCookies();

  const error = () => {
    removeCookie('isLogin');
    removeCookie('token');
    alert("비정상적인 접근입니다. 다시 로그인해주세요!");
    navigate('/login');
  }

  useEffect(() => {
    if(!cookies.isLogin) { error(); return; };
    if(!cookies.token) { error(); return; };
  }, [])

  const saveMailPsword = () => {
    try {
      const req = { token: location.state.token, mailPsword: document.getElementById('mailPsword').value };
      if(!req.token) { error(); return; };
      if(!req.mailPsword) { alert("값을 입력해주세요!"); return; };
      fetch('/savemailpsword', {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(req)
      }).then((res) => res.json())
      .then((res) => {
        console.log(res.msg);
        if(res.success) { navigate('/'); return; };
      })
    } catch(err) {
      error();
    }
  }

  return (
    <div className='wrap-all'>
    <input type='password' className='mail-psword' id='mailPsword' />
    <span className='mail-psword-register' onClick={saveMailPsword}>등록하기</span>
    <p>비밀번호는 구글 계정 설정 → 보안 → 앱 비밀번호 추가 후( 앱 비밀번호가 안 보일 시 2단계 인증을 하셔야 보입니다)</p>
    <p>앱 선택 -&gt; 메일, 기기 선택 -&gt; windows 컴퓨터</p>
    <p>앱 비밀번호는 한 번 발급 후 재확인이 불가능합니다. 기록 해두세요</p>
    </div>
  )
}

export default MailPsword