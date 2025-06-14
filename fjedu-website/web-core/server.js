import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import session from 'express-session';
import memberRouter from './api/member.js';
import loginRouter from './api/login.js';
import sessionRouter from './api/check-session.js';

const app = express();
const PORT = process.env.PORT || 3000;

// === CORS 設定 ===
const allowedOrigins = [
  'https://fjedu.online',
  'https://fjedu-web.pages.dev',
  'https://fjedu-web-460q.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// ✅ 順序非常重要：先套 CORS
// CORS 一定要允許 origin 和 credentials
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ✅ 再套 session（CORS 要先）
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,         // 若使用 HTTPS，請設為 true
    sameSite: 'none'
  }
}));

// ✅ 再解析 body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// === API 路由 ===
app.use('/api', memberRouter);
app.use('/api', loginRouter);
app.use('/api', sessionRouter);

// ✅ 若已在 `./api/check-session.js` 寫好 /api/check-session，就不需要再寫一次
// 否則請刪除這段，避免重複
// app.get('/api/check-session', (req, res) => { ... });

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

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`伺服器已啟動，埠號: ${PORT}`);
});
