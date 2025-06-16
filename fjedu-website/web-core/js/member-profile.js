document.addEventListener('DOMContentLoaded', async () => {
  const status = document.getElementById('status');

  try {
    const res = await fetch('https://fjedu-web-460q.onrender.com/api/check-session', {
      credentials: 'include'
    });

    if (!res.ok) {
      status.textContent = '尚未登入，正在跳轉回登入頁面...';
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
      return;
    }

    const data = await res.json();
    status.innerHTML = `你好，<strong>${data.username}</strong>`;
  } catch (err) {
    console.error('連線錯誤：', err);
    status.textContent = '系統錯誤，正在跳轉回登入頁面...';
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  }
});

function loadContent(type) {
  const contentArea = document.getElementById('content-area');

  if (type === 'account') {
    contentArea.innerHTML = `
      <h2>修改帳號資訊</h2>
      <div class="field-group">
        <label for="email">Email</label>
        <input type="email" id="email" placeholder="請輸入新 Email">
      </div>
      <div class="field-group">
        <label for="phone">電話</label>
        <input type="text" id="phone" placeholder="請輸入電話號碼">
      </div>
      <div class="field-group">
        <label for="backupEmail">備援用 Email</label>
        <input type="email" id="backupEmail" placeholder="請輸入備援 Email">
      </div>
      <div class="field-group">
        <label for="idNumber">身分證字號</label>
        <input type="text" id="idNumber" placeholder="請輸入身份證字號">
      </div>
    `;
  } else if (type === 'binding') {
    contentArea.innerHTML = `
      <h2>綁定第三方帳號</h2>
      <ul>
        <li><button>綁定 Google 帳號</button></li>
        <li><button>綁定 Facebook 帳號</button></li>
        <li><button>綁定 LINE 帳號</button></li>
      </ul>
    `;
  }
}
