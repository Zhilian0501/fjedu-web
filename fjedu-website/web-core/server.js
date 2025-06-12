import express from 'express';
import nodemailer from 'nodemailer';
import authRoutes from './routes/auth.js'; // 處理註冊登入路由
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://fjedu-web.pages.dev',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// ✅ 郵件寄送功能
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'drte0004@gmail.com',
    pass: 'opmu chma psuz wber'
  }
});

// 你的其他路由
app.post('/api/member', (req, res) => {
  console.log('收到註冊資料', req.body);
  res.json({ success: true });
});

app.post('/send-email', async (req, res) => {
  const { name, email, course, guardian } = req.body;

  const mailOptions = {
    from: '"學生報名表單" <your.email@gmail.com>',
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

// ✅ 註冊與登入路由
app.use('/api', authRoutes);
app.use(express.static('public'));

// ✅ 啟動伺服器
app.listen(PORT, () => {
  console.log(`伺服器已啟動：http://localhost:${PORT}`);
});
