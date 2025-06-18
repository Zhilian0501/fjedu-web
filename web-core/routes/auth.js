import express from 'express';
import bcrypt from 'bcrypt';
import  db  from './db.js';

const router = express.Router();

// 註冊
router.post('/member', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('收到註冊資料：', req.body);
  try {
    // 密碼加密
    const hashedPassword = await bcrypt.hash(password, 10);

    const [rows] = await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    res.json({ message: '註冊成功！' });
  } catch (error) {
    res.status(500).json({ error: '註冊失敗：' + error.message });
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

    // ✅ 登入成功這裡加上 session
    req.session.user = {
      id: user.id,
      username: user.username
    };

    res.json({ message: '登入成功', user: req.session.user });

  } catch (error) {
    res.status(500).json({ error: '登入失敗', details: error.message });
  }
});

export function authenticateToken(req, res, next) {
  if (req.session && req.session.user) {
    req.user = req.session.user; // 把使用者資訊放到 req.user 方便後續使用
    next(); // 放行
  } else {
    res.status(401).json({ error: '未授權，請先登入' });
  }
}

export default router;
