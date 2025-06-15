document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const msg = document.getElementById('message');

    try {
      console.log('🔵 正在送出登入請求');
      const res = await fetch('https://fjedu-web-460q.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      console.log('🟢 Response Status:', res.status);
      const data = await res.json();
      console.log('🟠 Response JSON:', data);

      if (res.status === 200) {
        msg.textContent = '登入成功，開始測試 Session...';

        const check = await fetch('https://fjedu-web-460q.onrender.com/api/check-session', {
          method: 'GET',
          credentials: 'include'
        });

        const checkData = await check.json();
        console.log('🧪 Session Check Status:', check.status);
        console.log('🧪 Session Check Data:', checkData);

        if (check.status === 200 && checkData.username) {
          console.log('✅ Session 正常，username:', checkData.username, '正在跳轉至會員頁面');
          msg.textContent = 'Session 正常：' + checkData.username;
          window.location.href = '/member-profile.html';
        } else {
          console.warn('❌ Session 錯誤', checkData);
          msg.textContent = 'Session 錯誤：' + JSON.stringify(checkData);
        }
      } else {
        msg.textContent = data.error || '登入失敗';
      }
    } catch (err) {
      msg.textContent = '伺服器錯誤：' + err.message;
      console.error('🔴 錯誤:', err);
    }
  });
});