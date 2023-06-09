// 引入mongoose.js文件
const mongoose = require('./mongodb.js');
// 定义schema
const Schema = mongoose.Schema;
const userInfo = new Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  token: { type: String, require: false },
});
const contentInfo = new Schema({
  sender: { type: String, require: true },
  toId: { type: String, require: true },
  file: { type: String, require: false },
  audioStatus: { type: Object, require: false },
  msg: { type: String, require: false },
  timestamp: { type: Date, require: false },
  fullName: { type: String, require: false },
  avatarUrl: { type: String, require: false },
  msgId: { type: Number, require: false },
  isNotuploadAws: { type: Boolean, require: false },
  fileType: { type: String, require: false },
});
const code = new Schema({
  e_mail: { type: String, require: true },
  veri_code: { type: String, require: true },
});

// 导出
module.exports = {
  userInfo,
  contentInfo,
  code,
};
