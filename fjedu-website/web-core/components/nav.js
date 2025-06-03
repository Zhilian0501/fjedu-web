const hamburger = document.querySelector('.hamburger');
const mainNav = document.querySelector('.main-nav');

hamburger.addEventListener('click', () => {
  mainNav.classList.toggle('active');
  hamburger.classList.toggle('active');
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".main-nav").classList.toggle("active");
  });
});