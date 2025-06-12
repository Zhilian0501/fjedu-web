import express from 'express';
import bcrypt from 'bcrypt';
import { db } from '/db.js';

const router = express.Router();

// 註冊
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    res.status(201).json({ message: '註冊成功', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: '註冊失敗', details: error.message });
  }
});

// 登入
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: '使用者不存在' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: '密碼錯誤' });

    res.json({ message: '登入成功', user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: '登入失敗', details: error.message });
  }
});

export default router;
