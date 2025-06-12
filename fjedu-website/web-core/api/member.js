import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../routes/db.js';

const router = express.Router();

router.options('*', (req, res) => {
  res.sendStatus(204);
});

// 註冊 API
router.post('/member', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    res.json({ message: '註冊成功！' });
  } catch (err) {
    res.status(500).json({ error: '註冊失敗：' + err.message });
  }
});

export default router;
