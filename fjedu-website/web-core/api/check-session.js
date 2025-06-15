import express from 'express';
const router = express.Router();

// 檢查登入狀態
console.log('收到 /check-session 請求，cookie:', req.headers.cookie);
router.get('/check-session', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ username: req.session.user.username });
  } else {
    res.status(401).json({ error: '尚未登入' });
  }
});

export default router;
