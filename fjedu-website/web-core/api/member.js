import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../routes/db.js';

const router = express.Router();

//router.options('*', (req, res) => {
//  res.sendStatus(204);
//}); 

// 註冊 API
router.post('/member', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    res.status(200).json({ message: '註冊成功' });
  } catch (err) {
    console.error('註冊錯誤：', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

export default router;
