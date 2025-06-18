const contentArea = document.getElementById('content-area');
const loadingMsg = document.getElementById('loadingMessage');

async function loadAccount() {
  try {
    const res = await fetch('https://fjedu-web-460q.onrender.com/api/user-profile', {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('讀取會員資料失敗');

    const data = await res.json();

    // 插入使用者資訊
    const usernameDisplay = document.getElementById('usernameDisplay');
    const avatar = document.getElementById('avatar');
    if (usernameDisplay) usernameDisplay.textContent = `你好，${data.username}`;
    if (avatar) avatar.src = data.avatarUrl || `https://i.pravatar.cc/150?u=${data.username}`;

    // 移除 loading 畫面
    if (loadingMsg) loadingMsg.remove();

    // 創建包裹容器
    const wrapper = document.createElement('div');
    wrapper.className = 'fade-slide-down'; // CSS 動畫類別

    wrapper.innerHTML = `
      <h2>修改帳號資訊</h2>
      <form id="updateForm">
        <div class="field-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" value="${data.email || ''}" required />
        </div>
        <div class="field-group">
          <label for="phone">電話</label>
          <input type="text" id="phone" name="phone" value="${data.phone || ''}" />
        </div>
        <div class="field-group">
          <label for="backupEmail">備援用 Email</label>
          <input type="email" id="backupEmail" name="backupEmail" value="${data.backupEmail || ''}" />
        </div>
        <div class="field-group">
          <label for="idNumber">身分證字號</label>
          <input type="text" id="idNumber" name="idNumber" value="${data.idNumber || ''}" />
        </div>
        <button type="submit">儲存</button>
      </form>
    `;

    contentArea.innerHTML = ''; // 清除舊內容
    contentArea.appendChild(wrapper);

    const form = document.getElementById('updateForm');
    const submitBtn = form.querySelector('button');

    form.addEventListener('submit', async e => {
      e.preventDefault();

      submitBtn.disabled = true;
      submitBtn.textContent = '儲存中...';

      const formData = {
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        backupEmail: form.backupEmail.value.trim(),
        idNumber: form.idNumber.value.trim()
      };

      try {
        const res = await fetch('https://fjedu-web-460q.onrender.com/api/update-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData)
        });

        if (res.ok) {
          alert('更新成功');
        } else {
          const err = await res.json();
          alert('更新失敗: ' + (err.error || '未知錯誤'));
        }
      } catch (err) {
        alert('系統錯誤，請稍後再試');
        console.error(err);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '儲存';
      }
    });

  } catch (err) {
    if (loadingMsg) {
      loadingMsg.innerHTML = '<p>讀取會員資料失敗，請稍後重試。</p>';
    } else {
      contentArea.innerHTML = '<p>讀取會員資料失敗，請稍後重試。</p>';
    }
    console.error(err);
  }
}



window.addEventListener('DOMContentLoaded', () => {
  loadAccount();

  document.querySelectorAll('nav li').forEach(li => {
    li.addEventListener('click', () => {
      document.querySelectorAll('nav li').forEach(el => el.classList.remove('active'));
      li.classList.add('active');
    });
  });
});
