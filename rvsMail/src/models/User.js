"use strict";

const userStorage = require("./UserStorage");


class User {
  constructor(body) {
    this.body = body;
  }
  async checkInfo() {
    const info = this.body;
    const db = await userStorage.checkInfo(info.key, info.value);
    if(db) return { success: false };
    else return { success: true };
  }
  async sendMail() {
    const info = this.body;
    const response = await userStorage.sendMail(info);
    return response;
  }
  async register() {
    const client = this.body;
    const response = await userStorage.register(client);
    return response;
  }
  async login() {
    const client = this.body;
    const dbClient = await userStorage.login(client);
    if(dbClient && dbClient.id === client.id && dbClient.psword === client.psword) {
      return { success: true, id: dbClient.id, name: dbClient.name, token: dbClient.token };
    }
    return { success: false, msg: "일치하는 정보가 없습니다!" };
  }
  async getUserInfo() {
    const info = this.body;
    const response = await userStorage.getUserInfo(info);
    if(!response) return { error: true };
    return response;
  }
  async addMailUser() {
    const info = this.body;
    const response = await userStorage.addMailUser(info);
    return response;
  }
  async getMailUser() {
    const id = this.body.hostId;
    const response = await userStorage.getMailUser(id);
    return response;
  }
  async deleteMailUser() {
    const info = this.body;
    const response = await userStorage.deleteMailUser(info);
    return response;
  }
  async updateMailUser() {
    const data = this.body;
    const response = await userStorage.updateMailUser(data);
    return response;
  }
  async sendUserMail() {
    const info = this.body;
    if(info.date === null) { // 바로 보내기
      const response = await userStorage.sendUserMail(info);
      return response;
    } else {
      const response = await userStorage.sendUserRvsMail(info);
      return response;
    }
  }
  async saveMailPsword() {
    const info = this.body;
    const response = await userStorage.saveMailPsword(info);
    return response;
  }
  async getMailRecord() {
    const info = this.body;
    const response = await userStorage.getMailRecord(info);
    return response;
  }
}

module.exports = User;