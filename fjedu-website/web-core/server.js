import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import memberRouter from './api/member.js';

console.log('Mounting server routes...');

const app = express();
const PORT = process.env.PORT || 3000;

// 解析 body (要放在路由之前)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS 設定，允許來自特定前端的請求
const allowedOrigins = ['https://fjedu-web.pages.dev', 'https://fjedu.online'];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like curl or Postman)
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
}));

// 必須處理 preflight OPTIONS 請求
app.options('*', cors());

app.use('/api', memberRouter);

// 郵件寄送功能設定
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'drte0004@gmail.com',
    pass: 'opmu chma psuz wber' // 你的 Gmail App 密碼
  }
});

// 郵件寄送 API
app.post('/send-email', async (req, res) => {
  const { name, email, course, guardian } = req.body;

  const mailOptions = {
    from: '"學生報名表單" <drte0004@gmail.com>', // 改成你的信箱或顯示名稱
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
