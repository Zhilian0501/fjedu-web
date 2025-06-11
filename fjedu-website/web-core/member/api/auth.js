import express from 'express';
import bcrypt from 'bcrypt';
import { pool } from './db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

  if (rows.length === 0) {
    return res.status(401).json({ error: '帳號不存在' });
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    return res.status(401).json({ error: '密碼錯誤' });
  }

  // 這裡可以建立 session 或簽發 JWT，簡化先導到成功頁面
  res.json({ message: '登入成功' });
});

export default router;
