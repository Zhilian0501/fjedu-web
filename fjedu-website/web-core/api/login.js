import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../routes/db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: '使用者不存在' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: '密碼錯誤' });
    }

    req.session.user = { id: user.id, username: user.username };
    res.json({ message: '登入成功', user: req.session.user });
  } catch (err) {
    console.error('登入失敗：', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

export default router;
