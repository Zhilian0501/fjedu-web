const axios = require('axios');
const express = require('express');
const router = express.Router();

router.post('/orders', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { video_id } = req.body;

  try {
    const videos = await db.query('SELECT * FROM videos WHERE id = ?', [video_id]);
    const video = videos[0];
    if (!video) return res.status(404).json({ error: '影片不存在' });

    const [result] = await db.query(
      `INSERT INTO orders (user_id, video_id, amount, payment_method, payment_status)
       VALUES (?, ?, ?, 'bank', 'pending')`,
      [userId, video_id, video.price]
    );
    const orderId = result.insertId;

    const requestData = {
      merchantId: '你的商店代碼',
      orderId: orderId.toString(),
      amount: video.price,
      description: `購買影片 ${video.title}`,
      expireDate: '20250630',
    };

    const signature = createSignature(requestData, '你的密鑰');

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

// Webhook 不使用 authenticateToken
router.post('/payment-callback', async (req, res) => {
  const { orderId, paymentStatus } = req.body;

  if (paymentStatus !== 'PAID') {
    return res.status(400).json({ error: '付款狀態非已付款' });
  }

  try {
    await db.query('UPDATE orders SET payment_status = ?, paid_at = NOW() WHERE id = ?', ['paid', orderId]);

    const orders = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const order = orders[0];
    if (order) {
      await db.query('INSERT INTO user_videos (user_id, video_id, purchased_at) VALUES (?, ?, NOW())',
        [order.user_id, order.video_id]);
    }

    res.json({ message: '付款狀態更新成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

module.exports = router;
