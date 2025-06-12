// server.js（或 register.js）
import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json()); // ⬅️ 這個非常重要，解析 JSON 請求

// 建立資料庫連線
const db = await mysql.createConnection({
  host: 'your-host',
  user: 'your-username',
  password: 'your-password',
  database: 'your-database'
});

// 註冊 API
app.post('/api/member', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);  // 加密密碼

    await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.json({ message: '註冊成功！' });
  } catch (err) {
    console.error('❌ 註冊失敗：', err);
    res.status(500).json({ error: '註冊失敗，可能使用者已存在或資料庫錯誤。' });
  }
});

app.listen(3000, () => {
  console.log('伺服器已啟動在 http://localhost:3000');
});
