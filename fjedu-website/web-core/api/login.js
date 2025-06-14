import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../routes/db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('收到登入請求：', { email, password });

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    console.log('查詢結果：', rows);

    if (rows.length === 0) {
      return res.status(401).json({ error: '使用者不存在' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    console.log('密碼比對結果：', match);

    if (!match) {
      return res.status(401).json({ error: '密碼錯誤' });
    }

    req.session.user = { id: user.id, username: user.username };
    console.log('登入成功，建立 session：', req.session.user);

    res.status(200).json({ message: '登入成功', user: req.session.user });
  } catch (err) {
    console.error('登入失敗：', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

export default router;
