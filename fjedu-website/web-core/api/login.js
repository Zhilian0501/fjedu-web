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

