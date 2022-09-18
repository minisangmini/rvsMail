import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../componentcss/MailRecord.css";

export default function MailRecord() {

  const navigate = useNavigate();
  const location = useLocation();
  const ulContainer = useRef();


  useEffect(() => {
    fetch('/mailrecord', {
      method: "post",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({id: location.state.id})
    }).then((res) => res.json())
    .then((res) => {
      res.data.forEach((val, idx) => {
        pushRecord(res.data[idx]);
      })
    })

  }, []);


  const pushRecord = (data) => {
    let li, span;
    li = document.createElement('li');
    span = document.createElement('span');
    span.innerText = data.id;
    li.appendChild(span);
    span = document.createElement('span');
    span.innerText = data.date.split(' ')[0];
    li.appendChild(span);
    span = document.createElement('span');
    span.innerText = data.date.split(' ')[1].substr(0, 5);
    li.appendChild(span);
    ulContainer.current.appendChild(li);
  }
  

  return (
    <>
    <button className='record-back' onClick={() => {navigate(-1)}}>돌아가기</button>
    <div className='record-container'>
     <ul ref={ulContainer}>
        <li>
            <span>이름</span>
            <span>날짜</span>
            <span>시간</span>
        </li>
        <li>
            <span>테스트테스</span>
            <span>2022-09-19</span>
            <span>13:51</span>
        </li>
     </ul>
    </div>
    </>
  )
}
