import memberRouter from './api/member.js';
import loginRouter from './api/login.js';
import sessionRouter from './api/check-session.js';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import nodemailer from 'nodemailer';  // 你有用到 nodemailer 要確保引入

const app = express();
const RedisStore = connectRedis(session)

const allowedOrigins = ['https://fjedu.online'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ⬇️ 處理預檢請求
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', allowedOrigins);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(204);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function startServer() {
  const redisClient = new Redis('redis://default:mzxNyvzKSwdZzulgKQSedOnHRyBTiyFY@switchyard.proxy.rlwy.net:39910');

  redisClient.on('connect', () => console.log('✅ Redis 連線成功'));
  redisClient.on('error', err => console.error('❌ Redis 錯誤:', err));

  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Redis 連線失敗', err);
    process.exit(1);
  }

  // RedisStore 要在 redisClient 連線後使用
  app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }
  }));

  app.use('/api', memberRouter);
  app.use('/api', loginRouter);
  app.use('/api', sessionRouter);

  // 郵件寄送功能
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'drte0004@gmail.com',
    pass: 'opmu chma psuz wber'
  }
});

app.post('/send-email', async (req, res) => {
  const { name, email, course, guardian } = req.body;

  const mailOptions = {
    from: '"學生報名表單" <drte0004@gmail.com>',
    to: 'easy.fjedu@gmail.com',
    subject: '新的課程報名',
    html: `
      <h3>有學生報名課程</h3>
      <p><strong>姓名：</strong> ${name}</p>
      <p><strong>電子郵件：</strong> ${email}</p>
      <p><strong>報名課程：</strong> ${course}</p>
      <p><strong>監護人姓名：</strong> ${guardian}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('報名資料已成功寄出！');
  } catch (err) {
    console.error('郵件寄送失敗：', err);
    res.status(500).send('寄送失敗');
  }
});

  const PORT = process.env.PORT || 10000;
  app.listen(PORT, () => {
    console.log(`🚀 伺服器啟動在埠號: ${PORT}`);
  });
}

startServer();

// 全域錯誤處理
app.use((err, req, res, next) => {
  console.error('全域錯誤:', err);
  res.status(500).json({ error: '伺服器錯誤' });
});
