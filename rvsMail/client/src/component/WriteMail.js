import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../componentcss/WriteMail.css';

function WriteMail() {
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const location = useLocation(); 
  const navigate = useNavigate();


  const sendusermail = () => {
    const rvsDate = document.getElementById('rvsDate').value;
    const rvsTime = document.getElementById('rvsTime').value;
    if(rvsDate || rvsTime) {
      if(!(rvsDate && rvsTime)) { alert("날짜와 시간을 모두 선택해주세요!"); return };
    }
    const req = {
      hostMail: location.state.hostMail,
      mailPsword: location.state.mailPsword,
      id: location.state.id,
      title: title,
      content: content,
      mail: location.state.mail,
      date: rvsDate&&rvsTime ? `${rvsDate} ${rvsTime}` : null
    };
    fetch('/sendusermail', {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(req)
    }).then(res => res.json())
    .then((res) => {
      console.log(res);
      alert(res.msg);
      navigate('/');
    })
  }



  return (
    <>
    &nbsp;
      <div className='write-mail-container'>
        <input type='text' placeholder='제목' className='write-mail-title' onChange={(e) => {
          setTitle(e.target.value)}} /> <br />
        <textarea className='write-mail-contents' onChange={(e) => {
          setContent(e.target.value)}} ></textarea> <br />
        <button className='write-mail-send-button' onClick={
          sendusermail}>보내기</button> <br />
          <input type='date' className='date-box' min={new Date().toISOString().split('T')[0]} 
          max={`${new Date().getFullYear() + 1}-01-01`} id='rvsDate'/>
          <input type='time' className='time-box' id='rvsTime'/>
          <p className='time-info'>시간과 날짜를 선택하지 않으면 바로 발송 됩니다!</p>
      </div>
    </>
  )
}

export default WriteMail