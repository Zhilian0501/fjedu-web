import db from '../routes/db'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { rating, comment, user_id } = req.body;

  if (!rating || !comment || !user_id) {
    return res.status(400).json({ message: '缺少資料' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO reviews (user_id, comment, rating) VALUES (?, ?, ?)',
      [user_id, comment, rating]
    );

    res.status(200).json({ message: '成功儲存評論', id: result.insertId });
  } catch (err) {
    console.error('儲存評論失敗：', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
}
