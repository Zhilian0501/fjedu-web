import express from 'express';
import pool from '../routes/db.js';  // 你的 MySQL 連線檔路徑

const router = express.Router();

// 取得會員資料
router.get('/user-profile', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: '尚未登入' });
  }
  try {
    const [rows] = await pool.query(
      'SELECT username, email, phone, backupEmail, idNumber, avatarUrl FROM users WHERE username = ?',
      [req.session.user.username]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: '找不到會員資料' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 更新會員資料
router.post('/update-profile', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: '尚未登入' });
  }
  const { email, phone, backupEmail, idNumber } = req.body;
  try {
    await pool.query(
      `UPDATE users SET email = ?, phone = ?, backupEmail = ?, idNumber = ? WHERE username = ?`,
      [email, phone, backupEmail, idNumber, req.session.user.username]
    );
    res.json({ message: '更新成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '更新失敗' });
  }
});

export default router;
