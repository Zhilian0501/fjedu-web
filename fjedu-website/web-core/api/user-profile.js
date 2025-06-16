import express from 'express';
import pool from '../routes/db.js';  // 你的 MySQL 連線檔路徑

const router = express.Router();

function checkLogin(req, res, next) {
  if (!req.session.username) {
    return res.status(401).json({ error: '尚未登入' });
  }
  next();
}

router.get('/user-profile', checkLogin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT username, email, phone, backupEmail, idNumber FROM users WHERE username = ?',
      [req.session.username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: '使用者不存在' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

router.post('/update-profile', checkLogin, async (req, res) => {
  const { email, phone, backupEmail, idNumber } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE users 
       SET email = ?, phone = ?, backupEmail = ?, idNumber = ?
       WHERE username = ?`,
      [email, phone, backupEmail, idNumber, req.session.username]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '使用者不存在或未更新' });
    }

    res.json({ message: '更新成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

export default router;
