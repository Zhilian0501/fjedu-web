document.addEventListener('DOMContentLoaded', () => {
  // 漢堡選單邏輯 (你之前的也放這裡)
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');

  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // 會員登入狀態處理
  const avatarImg = document.getElementById('member-avatar-img');
  const memberName = document.getElementById('member-name');
  const notLoggedInDiv = document.getElementById('not-logged-in');
  const loggedInDiv = document.getElementById('logged-in');
  const dropdownUsername = document.getElementById('dropdown-username');
  const dropdownEmail = document.getElementById('dropdown-email');
  const dropdownPhone = document.getElementById('dropdown-phone');
  const logoutBtn = document.getElementById('logout-btn');

  // 從 localStorage 讀取用戶資訊
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.username) {
    // 已登入狀態
    memberName.textContent = user.username;
    avatarImg.src = user.avatarUrl || '/images/default-avatar.png';

    notLoggedInDiv.style.display = 'none';
    loggedInDiv.style.display = 'block';

    dropdownUsername.textContent = user.username;
    dropdownEmail.textContent = user.email || '尚未設定';
    dropdownPhone.textContent = user.phone || '尚未設定';

    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      window.location.reload();
    });
  } else {
    // 未登入狀態
    memberName.textContent = '訪客';
    avatarImg.src = '/images/default-avatar.png';

    notLoggedInDiv.style.display = 'block';
    loggedInDiv.style.display = 'none';
  }
});
