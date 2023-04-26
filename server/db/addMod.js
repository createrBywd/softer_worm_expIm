//引入mongoose.js 文件
var mongoose = require('./mongodb')
//引入schema.js 文件
var schema = require('./schema')
//定义模型 表名为our
var User = mongoose.model('user', schema.userInfo)
var Content = mongoose.model('conetnt', schema.contentInfo)
var Code = mongoose.model('code', schema.code)

//导出
module.exports = { User, Content, Code }
