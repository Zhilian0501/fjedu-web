import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import session from 'express-session';
import { createClient } from 'redis';
import connectRedisPkg from 'connect-redis';

import memberRouter from './api/member.js';
import loginRouter from './api/login.js';
import sessionRouter from './api/check-session.js';

const app = express();

// === CORS 設定：這段一定要在最前面 ===
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

// 處理 preflight
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://fjedu.online');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(204);
});

// 解析 body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// === Redis + Session 設定 ===
const RedisStore = connectRedisPkg(session);

async function startServer() {
  const redisClient = createClient({
    url: 'redis://default:mzxNyvzKSwdZzulgKQSedOnHRyBTiyFY@switchyard.proxy.rlwy.net:39910'
  });

  redisClient.on('connect', () => console.log('✅ Redis 連線成功'));
  redisClient.on('error', err => console.error('❌ Redis 錯誤:', err));

  await redisClient.connect();

  app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }
  }));

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

  const PORT = process.env.PORT || 10000;
  app.listen(PORT, () => {
    console.log(`🚀 伺服器啟動在埠號: ${PORT}`);
  });
}

startServer();