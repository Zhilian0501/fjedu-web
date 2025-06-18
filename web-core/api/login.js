import pool from '../routes/db.js'; // 假設你有這個 MySQL 連線池
import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('收到登入請求：', req.body);

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    console.log('查詢結果：', rows);

    if (rows.length === 0) {
      return res.status(401).json({ error: '無此帳號' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    console.log('密碼比對結果：', match);

    if (!match) {
      return res.status(401).json({ error: '密碼錯誤' });
    }

    // ✅ 正確：只寫入一個 JSON-safe object 到 session
    req.session.user = {
      id: user.id,
      username: user.username
    };

    console.log('登入成功，建立 session：', req.session.user);

    res.json({ success: true, user: req.session.user });

  } catch (err) {
    console.error('登入錯誤：', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

export default router;
