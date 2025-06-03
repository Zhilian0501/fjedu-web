document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".main-nav").classList.toggle("active");
  });
});