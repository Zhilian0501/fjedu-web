// 📄 update-profile.js
import express from 'express';
import pool from '../routes/db.js';

const router = express.Router();

// 更新會員資料
router.post('/update-profile', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: '未登入' });
  }

  const username = req.session.user.username;
  const { email, phone, backupEmail, idNumber } = req.body;

  try {
    await pool.execute(
      'UPDATE users SET email = ?, phone = ?, backupEmail = ?, idNumber = ? WHERE username = ?',
      [email, phone, backupEmail, idNumber, username]
    );
    res.json({ message: '更新成功' });
  } catch (err) {
    console.error('更新會員資料錯誤:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

export default router;