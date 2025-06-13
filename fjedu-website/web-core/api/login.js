document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  const msg = document.getElementById('message');
  if (res.ok) {
    window.location.href = '/dashboard.html';
  } else {
    msg.textContent = data.error;
  }
});

// login.js（登入處理檔案）
function onLoginSuccess(username) {
  // 假設登入驗證成功後取得使用者名稱 username
  localStorage.setItem("loggedIn", "true");
  localStorage.setItem("username", username);

  // 導回首頁
  window.location.href = "index.html"; // 或根據你的首頁 URL 修改
}

