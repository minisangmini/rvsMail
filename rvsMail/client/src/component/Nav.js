import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import userIcon from '../img/user-icon.png';
import mailIcon from '../img/mail-icon.png';
import logoutIcon from '../img/logout-icon.png';
import '../componentcss/Nav.css';

function Nav() {
  const [cookies, ,removeCookie] = useCookies();
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [mail, setMail] = useState();
  const [token, setToken] = useState();
  const [mailPsword, setMailPsword] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if(!cookies.isLogin) { navigate('/login'); return; };
    if(!cookies.token) { error(); return; };
    const req = {
      type: "token",
      value: cookies.token
    }
    try {
      fetch('/getuserinfo', { 
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(req)
      }).then((res) => res.json())
      .then((res) => {
        if(res.error) { error(); return; }
        setId(res.id);
        setName(res.name);
        setMail(res.mail);
        setToken(res.token);
        if(!res.mailPsword) {
          navigate('/mailpsword', { state: {id: res.id, token: res.token} });
          alert('메일 비밀번호를 설정해주세요!');
        }
        setMailPsword(res.mailPsword);
      })
    } catch(err) { error(); }
  }, [])

  const error = () => {
    removeCookie('isLogin');
    removeCookie('token');
    alert("비정상적인 접근입니다. 다시 로그인해주세요!");
    navigate('/login');
  }

  const logout = () => {
    removeCookie('isLogin');
    removeCookie('token');
    navigate('/login');
    alert('로그아웃 되었습니다!');
  }

  return (
    <>
      <div className='nav-container'>
        <nav>
          <NavLink to='/edituser' state={{id: id, name: name, mail: mail}} className='nav-item'><img src={userIcon} alt='user' /></NavLink>
          <NavLink to='/sendmail' state={{id: id, name: name, mail: mail, mailPsword: mailPsword}} className='nav-item'><img src={mailIcon} alt='mail' /></NavLink>
        </nav>
        <img src={logoutIcon} alt='logout' className='logout-button' 
        onClick={(e) => {logout()}}/>
      </div>
      <Outlet />
    </>
  )
}

export default Nav