"use strict";

const db = require("../config/db");
const nodemailer = require('nodemailer');
require("dotenv").config();


class UserStorage {
  static async checkInfo(key, value) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM user WHERE ${key} = ?;`;
      db.query(query, [value], (err, data) => {
        if(err) reject(err);
        resolve(data[0]);
      }) 
    });
  }

  static async saveUserInfo(client) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO user(id, psword, name, birthday, gender, mail) VALUES(?, ?, ?, ?, ?, ?);";
      db.query(query, 
        [client.id, client.psword, client.name, client.birthday, client.gender, client.mail], 
        (err) => {
          if(err) reject(err);
          resolve({ success: true, msg: "회원가입 성공!" });
        });
    })
  }

  static async sendMail(client) {
    const mailCode = Math.floor(Math.random().toString().substr(2, 6));
    const email = {
      "service": "gmail",
      "host": "smtp.gmail.com",
      "port": 2525,
      "secure": false, // true for 465, false for other ports
      "auth": {
        "user": "si2841523@gmail.com", // generated ethereal user
        "pass": process.env.GMAIL_PSWORD, // generated ethereal password
      }
    };
    const opt = {
      from: "si2841523@gmail.com",
      to: client.mail,
      subject: "rvs에서 인증번호가 도착했습니다!",
      text: `인증번호는 ${mailCode}입니다!`
    }
    try {
      return new Promise((resolve, reject) => {
        nodemailer.createTransport(email).sendMail(opt, (err, info) => {
          if(err) reject(err);
          else resolve({ success: true, mailCode: mailCode,  msg: "메일이 정상적으로 발송 되었습니다!" });
        });
      });
    } catch(err) { return { msg: "잘못된 형식입니다!" }; };
  }

  static createToken() {
    let token = "";
    token += Math.random().toString(36).slice(2, 12);
    token += Math.random().toString(36).slice(2, 12);
    return token;
  }

  static getToken(id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT token FROM user WHERE id = ?;";
      db.query(query, [id], (err, data) => {
        if(err) reject(err);
        resolve(data[0]);
      })
    })
  }

  static async register(client) {
    const token = this.createToken();
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO user(id, psword, name, mail, token) VALUES(?, ?, ?, ?, ?);";
      db.query(query,
        [client.id, client.psword, client.name, client.mail, token],
        (err) => {
          if(err) reject({ success: false, msg: "db오류. 관리자에게 문의헤주세요!", err: err });
          resolve({ success: true, msg: "회원가입이 완료 되었습니다!" });
        })
    })
  }
  static async login(client) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM user WHERE id = ?;";
      db.query(query, [client.id], (err, data) => {
        if(err) reject({ success: false, msg: "db오류. 관리자에게 문의헤주세요!", err: err });
        resolve(data[0]);
      })
    })
  }
  static async getUserInfo(info) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM user WHERE ${info.type} = ?;`;
      db.query(query, [info.value], (err, data) => {
        if(err) reject(err);
        resolve(data[0]);
      })
    })
  }
 
  static async addMailUser(info) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO mailuser(hostId, name, relation, mail, date) VALUES(?, ?, ?, ?, TIMESTAMP(NOW()));`;
      db.query(query, 
        [info.hostId, info.name, info.relation, info.mail], 
        (err) => {
        if(err) reject({success: false, msg: "db오류 관리자에게 문의해주세요.", err: err});
        resolve({success: true});
      })
    })
  }
  static async getMailUser(hostId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM mailuser WHERE hostId = ?;`;
      db.query(query, [hostId], (err, data) => {
        if(err) reject({success: false, msg: "db오류 관리자에게 문의해주세요.", err: err});
        resolve({success: true, data: data});
      })
    })
  }
  static async deleteMailUser(info) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM mailuser WHERE hostId = ? AND mail = ?;`;
      db.query(query, [info.hostId, info.mail], (err) => {
        if(err) reject({success: false, msg: "db오류 관리자에게 문의해주세요.", err: err});
        resolve({success: true});
      })
    })
  }
  static async updateMailUser(data) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE mailuser SET name = ?, relation = ?, mail = ? WHERE hostId = ? AND mail = ?;`;
      db.query(query, 
        [data.name, data.relation, data.mail, data.hostId, data.initMail], 
        (err) => {
        if(err) reject({success: false, msg: "db오류 관리자에게 문의해주세요.", err: err});
        resolve({success: true});
      })
    })
  }
  static async sendUserMail(info) {
    await this.saveMailRecord(info);
    const email = {
      "service": "gmail",
      "host": "smtp.gmail.com",
      "port": 2525,
      "secure": false, // true for 465, false for other ports
      "auth": {
        "user": info.hostMail, // generated ethereal user
        "pass": info.mailPsword, // generated ethereal password
      }
    };
    const opt = {
      from: info.hostMail,
      to: "",
      subject: info.title,
      text: info.content
    }
    try {
      return new Promise((resolve, reject) => {
        info.mail.forEach((val) => {
          opt.to = val;
          nodemailer.createTransport(email).sendMail(opt, (err, info) => {
            if(err) reject(err);
          });
        })
        resolve({ success: true, msg: "메일이 정상적으로 발송 되었습니다!" });
      });
    } catch(err) { return { msg: "메일 발송에 오류가 발생하였습니다. 올바른 메일인 지 확인해주세요!" }; };
  }

  static async sendUserRvsMail(info) {
    await this.saveMailRecord(info);
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO rvsmail(hostMail, mailPsword, title, content, mail, date) VALUES(?, ?, ?, ?, ?, ?);";
      db.query(query,   
        [info.hostMail, info.mailPsword, info.title, info.content, JSON.stringify(info.mail), info.date], (err) => {
          if(err) reject({success: false, msg: "오류가 발생했습니다. 관리자에게 문의해주세요"});
          resolve({success: true, msg: "성공하였습니다!"});
        })
    })

  }

  static async getRsvUserInfo(info) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM rvsmail WHERE date = ?;";
      db.query(query, [info.date], (err, data) => {
        if(err) reject(err);
        resolve(data);
      })
    })
  }

  static async removeRsvUser(info) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM rvsmail WHERE hostMail = ? And title = ? AND content = ? AND date = ?;";
      db.query(query, 
        [info.hostMail, info.title, info.content, info.date], (err) => {
        if(err) reject(err);
        resolve();
      })
    })
  }

  static async saveMailPsword(info) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE user SET mailPsword = ? WHERE token = ?";
      db.query(query, [info.mailPsword, info.token], (err) => {
        if(err) reject({success: false, msg: "오류 발생 관리자에게 문의해주세요!"});
        resolve({success: true, msg: "성공하였습니다!"});
      })
    })
  }

  static async saveMailRecord(info) {
    return new Promise((resolve, reject) => {
      if(info.date === null) {
        const query = "INSERT INTO mailrecord(id, date) VALUES(?, NOW());";
        db.query(query, [info.id], (err) => {
          if(err) reject(err);
          resolve();
        })
      } else {
        const query = "INSERT INTO mailrecord(id, date) VALUES(?, ?);";
        db.query(query, [info.id, info.date], (err) => {
          if(err) reject(err);
          resolve();
        })
      }
    })
  }

  static async getMailRecord(info) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM mailrecord WHERE id = ?";
      db.query(query, [info.id], (err, data) => {
        if(err) reject({success: false});
        resolve({success: true, data: data})
      })
    })
  }
}


module.exports = UserStorage;