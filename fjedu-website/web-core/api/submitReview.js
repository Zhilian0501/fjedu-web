import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { rating, comment } = req.body;
  if (!rating || !comment) return res.status(400).json({ message: '缺少資料' });

  const filePath = path.resolve('reviews.json');
  let reviews = [];

  if (fs.existsSync(filePath)) {
    reviews = JSON.parse(fs.readFileSync(filePath));
  }

  reviews.unshift({
    rating,
    comment,
    timestamp: new Date().toISOString()
  });

  fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));

  res.status(200).json({ message: '成功儲存評論' });
}
