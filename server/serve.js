const express = require('express');
const app = express();
const server = require('http').Server(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: 'http://localhost:19000' },
});
const getFileUrl = require('./utils/putAwsFile');
const cors = require('cors');
// 引入中间件
const bodyParser = require('body-parser');
// 请求体解析中间件
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
const userRouter = require('./router/route');
app.use(cors());
app.use('/api', userRouter);
const hashName = {};
const onlineUser = [];
io.on('connection', async (socket) => {
  // let user = await User.find().exec()
  //  创建房间储存上线的用户
  socket.on('setRoom', (data) => {
    const { _id } = data;
    hashName[_id] = socket.id;
  });
  // 发送私信给指定用户
  socket.on('privatemessage', async (content) => {
    console.log(content);
    io.to(socket.id).to(hashName[content.sendId]).emit('receiveMsg', content);
  });
  // 登录成功创建线上用户列表
  socket.on('enterOnline', async (info) => {
    await onlineUser.push(info);
    const data = [...new Set(onlineUser.map((t) => JSON.stringify(t)))].map(
      (s) => JSON.parse(s),
    );
    io.emit('onlineUser', data);
  });
  // 断开连接
  socket.on('dis', (socketId) => {
    const data = onlineUser.filter((users) => users.socketId !== socketId);
    onlineUser = data;
    io.emit('onlineUser', onlineUser);
    socket.disconnect();
  });
});
server.listen('8081', () => {
  console.log(`serve on http://localhost:8081`);
});
