document.addEventListener('DOMContentLoaded', () => {
  // 漢堡選單控制
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');

  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // 會員資訊顯示控制
  const memberArea = document.querySelector('.member-area');
  const avatarImg = document.getElementById('member-avatar-img');
  const memberName = document.getElementById('member-name');
  const notLoggedInDiv = document.getElementById('not-logged-in');
  const loggedInDiv = document.getElementById('logged-in');
  const dropdownUsername = document.getElementById('dropdown-username');
  const dropdownEmail = document.getElementById('dropdown-email');
  const dropdownPhone = document.getElementById('dropdown-phone');
  const logoutBtn = document.getElementById('logout-btn');

  // 從 localStorage 取用戶資料
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.username) {
    // 已登入
    memberName.textContent = user.username;
    memberName.style.display = 'inline-block';

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
    // 未登入
    memberName.style.display = 'none';
    avatarImg.src = '/images/default-avatar.png';

    notLoggedInDiv.style.display = 'block';
    loggedInDiv.style.display = 'none';
  }
});
