const express = require('express');
const router = express.Router();
const { User, Content, Code } = require('../db/addMod');
const jsonwebtoken = require('jsonwebtoken');
const nodeMail = require('../utils/nodemailer.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads' }); // 指定上传文件保存的目录
const getFileUrl = require('../utils/putAwsFile');
const zlib = require('zlib');
router.post('/sendCode', async (req, res) => {
  const code = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0'); // 生成随机验证码
  // 发送邮件需要的入参
  const info = {
    // 发件人
    name: '月亮',
    // 发件箱，要与收件箱邮箱类型一致
    from: '1484430913@qq.com',
    // 发送的邮件标题
    subject: '验证码',
    // 收件箱，要与发件箱邮箱类型一致
    to: req.body.email,
    // 邮件内容，HTML格式
    html: `
            <p>您好！</p>
            <p>您的验证码是：<strong style="color:orangered;">${code}</strong></p>
            <p>如果不是您本人操作，请无视此邮件</p>
        `,
  };
  nodeMail.sendMail(info, async (err, result) => {
    if (!err) {
      res.send({ code: 200, msg: '发送验证码成功' });
      await Code.deleteMany({ e_mail: req.body.email });
      await Code.insertMany({
        e_mail: req.body.email,
        veri_code: code,
      });
      setTimeout(async () => {
        // 5分钟后失效
        await Code.deleteMany({ e_mail: req.body.email });
      }, 1000 * 60 * 5);
    } else {
      res.send({
        code: 0,
        msg: '发送验证码失败，请稍后重试',
      });
    }
  });
});
router.post('/register', async (req, res) => {
  const { email, password, code } = req.body;
  const msg = !email
    ? '邮箱不能为空'
    : !password
    ? '密码不能为空'
    : '验证码不能为空';
  if (!email || !password || !code) {
    res.send({ code: 500, msg });
  } else {
    const { veri_code } = await Code.findOne({
      e_mail: email,
    }).exec();
    if (code === veri_code) {
      await User.insertMany({
        email,
        password,
        messages: [],
      });
      res.send({ code: 200, msg: '注册成功' });
    } else {
      res.send({ code: 500, msg: '注册失败' });
    }
  }
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const token = jsonwebtoken.sign({ email, password }, 'jwtBywd');
  const mineInfo = await User.findOne({
    email,
    password,
  }).exec();
  const { email: dbEmail, password: dbPassword } = mineInfo;
  const everyTrue = email === dbEmail && password === dbPassword;
  if (everyTrue) {
    mineInfo.token = token;
    const data = await User.findOneAndUpdate({ email: dbEmail }, mineInfo);
    res.send({ code: 200, msg: '登录成功', token });
  } else res.send({ code: 500, msg: '账号或密码错误' });
});
// 获取用户列表
router.get('/getuser', async (req, res) => {
  const { email: e } = req.query;
  const data = await User.find({
    email: { $ne: e },
  }).exec();
  res.send({
    code: 200,
    data,
  });
});
// 获取登录信息
router.get('/getMineInfo', async (req, res) => {
  const token = req.headers.authorization;
  const data = await User.findOne({ token }).exec();
  res.send({
    code: 200,
    data,
  });
});
router.post('/saveContent', async (req, res) => {
  const userData = await Content.insertMany(req.body);
  res.send({ code: 200, msg: '发送成功' });
});

router.get('/getContentById', async (req, res) => {
  const { sender, toId, pageSize = 10, pageNum = 1 } = req.query;
  const query = {
    $or: [
      { sender, toId },
      { sender: toId, toId: sender },
    ],
  };
  const [allDataCount, scrollData] = await Promise.all([
    Content.countDocuments(query),
    Content.find(query)
      .sort({ timestamp: -1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .exec(),
  ]);
  const data = scrollData.reverse();
  res.send({
    code: 200,
    data,
    total: allDataCount,
  });
});
router.post('/upload', upload.single('file'), async (req, res) => {
  const { file, originalname } = req.file;
  const { isNotuploadAws, file: path } = req.body;
  const url = isNotuploadAws ? inflate : await getFileUrl(file, originalname);
  const context = { ...req.body, file: url };
  await Content.insertMany(context);
  res.send({ code: 200, msg: '语音发送成功', data: url });
});
module.exports = router;
