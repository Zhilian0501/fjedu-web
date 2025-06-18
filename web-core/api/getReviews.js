import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.resolve('reviews.json');
  if (!fs.existsSync(filePath)) return res.json([]);

  const reviews = JSON.parse(fs.readFileSync(filePath));
  res.status(200).json(reviews);
}
