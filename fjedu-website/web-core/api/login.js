document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    const msg = document.getElementById('message');
    try {
      const data = await res.json();
      if (res.ok) {
        alert('登入成功，正在跳轉...');
        window.location.href = '/member-profile.html';
      } else {
        msg.textContent = data.error;
      }
    } catch (err) {
      msg.textContent = '伺服器回傳資料異常';
    }
  });
});

// login.js（登入處理檔案）
function onLoginSuccess(username) {
  localStorage.setItem("loggedIn", "true");
  localStorage.setItem("username", username);

  // 檢查 URL 是否帶有 redirect 參數
  const params = new URLSearchParams(window.location.search);
  const redirectTo = params.get("redirect");

  if (redirectTo) {
    window.location.href = redirectTo; // 回會員頁面
  } else {
    window.location.href = "/index.html"; // 或回首頁
  }
}

