document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
      };

      const messageBox = document.getElementById('message');

      try {
        const res = await fetch('https://fjedu-web-460q.onrender.com/api/member', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const resText = await res.text();

        if (res.status === 409) {
          alert('此帳號已存在，請登入');
          window.location.href = 'login.html';
          return;
        }

        if (!res.ok) {
          messageBox.textContent = '註冊失敗：' + resText;
          return;
        }

        messageBox.textContent = '註冊成功！即將導向登入頁面...';
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      } catch (err) {
        messageBox.textContent = '請求錯誤：' + err.message;
        console.error('錯誤：', err);
      }
    });