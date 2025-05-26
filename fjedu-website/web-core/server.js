const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

// 中介層
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 郵件發送設定
const transporter = nodemailer.createTransport({
  service: 'Gmail', // 你也可以用 Outlook、Yahoo 等
  auth: {
    user: 'your.email@gmail.com',      // 用來寄信的 Gmail 帳號
    pass: 'your-app-password'          // 建議使用應用程式密碼，不是 Gmail 登入密碼
  }
});

// 接收表單 POST 請求
app.post('/send-email', async (req, res) => {
  const { name, email, course, guardian } = req.body;

  const mailOptions = {
    from: '"學生報名表單" <your.email@gmail.com>',
    to: 'teacher.email@example.com', // 收件者（老師的 Email）
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
  console.log(`Server is running on http://localhost:${PORT}`);
});