document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
  
    if (user === "admin" && pass === "123456") {
      window.location.href = "dashboard.html";
    } else {
      alert("帳號或密碼錯誤");
    }
  });
  