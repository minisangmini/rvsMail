const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const schedule = require('node-schedule');
const moment = require('moment');
require('moment-timezone');


moment.tz.setDefault("Asia/Seoul");
const home = require("./src/routes")
const userStorage = require('./src/models/UserStorage');

const job1 = schedule.scheduleJob("*/1 * * * *", async () => {
    const data = await userStorage.getRsvUserInfo({date: moment().format('YYYY-MM-DD HH:mm')});
    data.forEach((val) => {
        val.mail = JSON.parse(val.mail);
        userStorage.sendUserMail(val);
        userStorage.removeRsvUser(val);
    })
})


// app.use(express.static("./build"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/', home);





module.exports = app;