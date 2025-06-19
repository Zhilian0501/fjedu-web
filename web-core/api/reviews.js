import express from 'express';
import db from '../routes/db.js'; // 假設你有這個 MySQL pool

const router = express.Router();

// 新增評論
router.post('/submitReview', async (req, res) => {
  const { user_id, rating, comment } = req.body;
  if (!user_id || !rating || !comment) {
    return res.status(400).json({ message: '缺少欄位' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO reviews (user_id, rating, comment) VALUES (?, ?, ?)',
      [user_id, rating, comment]
    );
    res.status(200).json({ message: '評論已儲存', id: result.insertId });
  } catch (err) {
    console.error('❌ 新增評論失敗：', err);
    res.status(500).json({ message: '內部錯誤' });
  }
});

// 取得評論
router.get('/getReviews', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT r.rating, r.comment, r.created_at AS timestamp, u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ 取得評論失敗：', err);
    res.status(500).json({ message: '內部錯誤' });
  }
});

export default router;
