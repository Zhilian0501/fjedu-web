import express from 'express';
import db from '../routes/db.js';
import { authenticateToken } from '../routes/auth.js';

const router = express.Router();

router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [orders] = await db.query(`
      SELECT o.id as order_id, o.amount, o.payment_method, o.payment_status, o.created_at, o.virtual_account, o.expire_date,
             v.title as video_title
      FROM orders o
      JOIN videos v ON o.video_id = v.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);

    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

export default router;
