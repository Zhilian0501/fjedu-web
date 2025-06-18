import express from 'express';
import  db  from '../routes/db.js';
import authenticateToken from './middleware/authenticateToken.js';

const router = express.Router();

router.get('/user-videos', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(`
      SELECT v.id, v.title, v.video_url
      FROM orders o
      JOIN videos v ON o.video_id = v.id
      WHERE o.user_id = ? AND o.payment_status = 'paid'
    `, [userId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: '讀取購買影片失敗' });
  }
});

export default router;
