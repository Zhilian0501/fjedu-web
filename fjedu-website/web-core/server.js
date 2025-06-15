import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import session from 'express-session';
import Redis from 'ioredis';
import * as connectRedis from 'connect-redis';  // 用 * as 引入

import memberRouter from './api/member.js';
import loginRouter from './api/login.js';
import sessionRouter from './api/check-session.js';

const app = express();
const PORT = process.env.PORT || 3000;

// === Redis 設定 ===
const RedisStore = connectRedis.default(session);  // 這裡加 .default
const redisClient = new Redis('redis://default:mzxNyvzKSwdZzulgKQSedOnHRyBTiyFY@switchyard.proxy.rlwy.net:39910');

redisClient.on('connect', () => console.log('✅ Redis 連線成功'));
redisClient.on('error', err => console.error('❌ Redis 錯誤:', err));

// === CORS 設定 ===
const allowedOrigins = ['https://fjedu.online'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.options('*', cors());

// === Session 設定 ===
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,          // 部署 HTTPS 時設為 true，開發時可設 false
    sameSite: 'none',      // 跨域必須
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  }
}));

// 解析 body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// === 路由 ===
app.use('/api', memberRouter);
app.use('/api', loginRouter);
app.use('/api', sessionRouter);

// === 寄信 API ===
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

app.listen(PORT, () => {
  console.log(`伺服器已啟動，埠號: ${PORT}`);
});
