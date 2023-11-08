let card = document.querySelector(".card");
let detail = document.querySelector(".detail");
let closeDetailButton = document.querySelector(".close-detail");

card.addEventListener("click", function() {
    detail.classList.add("active");
});

closeDetailButton.addEventListener("click", function() {
    detail.classList.remove("active");
});

let menuBar = document.querySelector(".menu-bar");
let sidebar = document.querySelector(".sidebar");
let logo = document.querySelector(".logo");

menuBar.addEventListener("click", function() {
    sidebar.classList.add("active");
});

logo.addEventListener("click", function() {
    sidebar.classList.remove("active");
});