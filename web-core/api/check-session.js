import express from 'express';
const router = express.Router();

// 檢查登入狀態
router.get('/check-session', (req, res) => {
  console.log('✅ 收到 /check-session 請求，cookie:', req.headers.cookie);
  console.log('🟡 Session 內容:', req.session);

  if (req.session && req.session.user) {
    console.log('✅ 已登入使用者:', req.session.user);
    res.json({ username: req.session.user.username });
  } else {
    console.warn('❌ 尚未登入');
    res.status(401).json({ error: '尚未登入' });
  }
});

export default router;
