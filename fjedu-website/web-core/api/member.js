// server.js（或 register.js）
import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import pool from '../routes/db.js';

const router = express.Router();
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
router.post('/member', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    res.json({ message: '註冊成功！' });
  } catch (err) {
    res.status(500).json({ error: '註冊失敗：' + err.message });
  }
});

app.listen(3000, () => {
  console.log('伺服器已啟動在 http://localhost:3000');
});

export default router;