
const User = require("../models/User");

const process = {
  checkInfo: async (req, res) => {
    const user = new User(req.body);
    const response = await user.checkInfo(req.body);
    return res.json(response);
  },
  sendMail: async (req, res) => {
    const user = new User(req.body);
    const response = await user.sendMail(req.body);
    return res.json(response);
  },
  register: async (req, res) => {
    const user = new User(req.body);
    const response = await user.register(req.body);
    return res.json(response);
  },
  login: async (req, res) => {
    const user = new User(req.body);
    const response = await user.login(req.body);
    return res.json(response);
  },
  getUserInfo: async (req, res) => {
    const user = new User(req.body);
    const response = await user.getUserInfo(req.body);
    return res.json(response);
  },
  addMailUser: async (req, res) => {
    const user = new User(req.body);
    const response = await user.addMailUser(req.body);
    return res.json(response);
  },
  getMailUser: async (req, res) => {
    const user = new User(req.body);
    const response = await user.getMailUser(req.body);
    return res.json(response);
  },
  deleteMailUser: async (req, res) => {
    const user = new User(req.body);
    const response = await user.deleteMailUser(req.body);
    return res.json(response);
  },
  updateMailUser: async (req, res) => {
    const user = new User(req.body);
    const response = await user.updateMailUser(req.body);
    return res.json(response);
  },
  sendUserMail: async (req, res) => {
    const user = new User(req.body);
    const response = await user.sendUserMail(req.body);
    return res.json(response);
  },
  saveMailPsword: async (req, res) => {
    const user = new User(req.body);
    const response = await user.saveMailPsword(req.body);
    return res.json(response);
  },
  getMailRecord: async (req, res) => {
    const user = new User(req.body);
    const response = await user.getMailRecord(req.body);
    return res.json(response);
  },
}


module.exports = {
  process
}