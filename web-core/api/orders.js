import express from 'express';
import axios from 'axios';
import db from '../routes/db.js';  // 你的資料庫連線模組
import { authenticateToken } from '../routes/auth.js';  // 你的驗證中介軟體

const router = express.Router();

// 建立訂單（需登入）
router.post('/orders', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { video_id } = req.body;

  try {
    const [videos] = await db.query('SELECT * FROM videos WHERE id = ?', [video_id]);
    const video = videos[0];
    if (!video) return res.status(404).json({ error: '影片不存在' });

    const [result] = await db.query(
      `INSERT INTO orders (user_id, video_id, amount, payment_method, payment_status)
       VALUES (?, ?, ?, 'bank', 'pending')`,
      [userId, video_id, video.price]
    );
    const orderId = result.insertId;

    // 組華南虛擬帳號API所需參數
    const requestData = {
      merchantId: '你的商店代碼',
      orderId: orderId.toString(),
      amount: video.price,
      description: `購買影片 ${video.title}`,
      expireDate: '20250630',
    };

    const signature = createSignature(requestData, '你的密鑰'); // 需自行實作或用 SDK

    const response = await axios.post('https://api.scsb.com.tw/virtual_account', requestData, {
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': signature,
      }
    });

    const virtualAccountInfo = response.data;

    await db.query(
      'UPDATE orders SET virtual_account = ?, expire_date = ? WHERE id = ?',
      [virtualAccountInfo.virtualAccountNumber, virtualAccountInfo.expireDate, orderId]
    );

    res.json({
      message: '訂單建立成功',
      order_id: orderId,
      amount: video.price,
      virtual_account: virtualAccountInfo.virtualAccountNumber,
      expire_date: virtualAccountInfo.expireDate
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 付款回調（Webhook）
router.post('/payment-callback', async (req, res) => {
  try {
    // 1. 從回調資料取得訂單ID、付款狀態等
    const { order_id, payment_status } = req.body;

    // 2. 驗證訂單是否存在
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [order_id]);
    if (orders.length === 0) return res.status(404).json({ error: '訂單不存在' });
    const order = orders[0];

    // 3. 判斷付款狀態是否成功（依第三方定義）
    if (payment_status !== 'SUCCESS') {
      // 如果付款失敗，回應 OK 但不做任何動作
      return res.json({ message: '付款未成功，無須更新' });
    }

    // 4. 更新訂單狀態
    await db.query('UPDATE orders SET payment_status = ? WHERE id = ?', ['paid', order_id]);

    // 5. 在 user_videos 綁定會員與影片
    await db.query(
      'INSERT IGNORE INTO user_videos (user_id, video_id) VALUES (?, ?)',
      [order.user_id, order.video_id]
    );

    // 6. 回傳成功訊息
    res.json({ message: '付款成功，訂單已更新並綁定會員影片' });
  } catch (err) {
    console.error('付款回調錯誤:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

export default router;

// 記得自行實作 createSignature 函式，並確認 authenticateToken 與 db 正常
