import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import memberRouter from './api/member.js';
import session from 'express-session';
import loginRouter from './api/login.js';
import sessionRouter from './api/session.js';

console.log('Mounting server routes...');

const app = express();
const PORT = process.env.PORT || 3000;

// === CORS 設定 ===
const allowedOrigins = ['https://fjedu.online', 'https://fjedu-web.pages.dev'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // 若部署 HTTPS，請改成 true
    sameSite: 'none'
  }
}));

// 解析 body (放在 CORS 之後)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// member 註冊 API
app.use('/api', memberRouter);
app.use('/api', loginRouter);
app.use('/api', sessionRouter);

app.get('/api/check-session', (req, res) => {
  if (req.session.user) {
    res.json({ username: req.session.user.username });
  } else {
    res.status(401).json({ error: '尚未登入' });
  }
});

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

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`伺服器已啟動，埠號: ${PORT}`);
});
