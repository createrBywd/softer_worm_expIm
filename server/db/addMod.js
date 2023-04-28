// 引入mongoose.js 文件
const mongoose = require('./mongodb');
// 引入schema.js 文件
const schema = require('./schema');
// 定义模型 表名为our
const User = mongoose.model('user', schema.userInfo);
const Content = mongoose.model('conetnt', schema.contentInfo);
const Code = mongoose.model('code', schema.code);

// 导出
module.exports = { User, Content, Code };
