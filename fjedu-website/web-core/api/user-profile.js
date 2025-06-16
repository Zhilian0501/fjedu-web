// 📄 user-profile.js
import express from 'express';
import pool from '../routes/db.js';

const router = express.Router();

// 取得會員資料
router.get('/api/user-profile', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: '未登入' });
  }

  const username = req.session.user.username;

  try {
    const [rows] = await pool.execute('SELECT username, email, phone, backupEmail, idNumber FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(404).json({ error: '找不到使用者' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('查詢會員資料錯誤:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

export default router;