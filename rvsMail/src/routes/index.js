const express = require("express");
const router = express.Router();

const ctrl = require("./ctrl");


// router.get("*", (req, res) => {
//   res.sendFile('index.html', { root: "./build" });
// })

router.post("/checkinfo", ctrl.process.checkInfo);
router.post("/sendmail", ctrl.process.sendMail);
router.post("/register", ctrl.process.register);
router.post("/login", ctrl.process.login);
router.post("/getuserinfo", ctrl.process.getUserInfo);
router.post("/addmailuser", ctrl.process.addMailUser);
router.post("/getmailuser", ctrl.process.getMailUser);
router.post("/deletemailuser", ctrl.process.deleteMailUser);
router.post("/updateuser", ctrl.process.updateMailUser);
router.post("/sendusermail", ctrl.process.sendUserMail);
router.post("/savemailpsword", ctrl.process.saveMailPsword);
router.post("/mailrecord", ctrl.process.getMailRecord);




module.exports = router;