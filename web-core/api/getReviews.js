import db from '../routes/db';

export default async function handler(req, res) {
  try {
    const [rows] = await db.execute(
      `SELECT r.id, r.comment, r.rating, r.created_at, u.username
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error('讀取評論失敗：', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
}
