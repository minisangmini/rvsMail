import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import Register from './component/Register';
import Nav from './component/Nav';
import Main from './component/Main';
import EditUser from './component/EditUser';
import SendMail from './component/SendMail';
import WriteMail from './component/WriteMail';
import MailPsword from './component/MailPsword';
import MailRecord from './component/MailRecord';
import "./componentcss/App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Nav />}>
        <Route index element={<Main />} />
        <Route path="/edituser" element={<EditUser />} />
        <Route path="/sendmail" element={<SendMail />} />
        <Route path="/writemail" element={<WriteMail />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path='/mailpsword' element={<MailPsword />} />
      <Route path='mailrecord' element={<MailRecord />} />
    </Routes>
  );
}

export default App;
