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


window.addEventListener('load', checkUserStatus);

function checkUserStatus() {
    const token = localStorage.getItem("token");
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {}; 
  
    fetch('/api/user/auth', {
      method: 'GET',
      headers: headers
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('请求失败');
        }
      })
      .then(data => {
        let menuSignin = document.querySelector(".menu_signin");
        let menuFanpage = document.querySelector(".menu_fanpage");
        let menuMessage = document.querySelector(".menu_message");
        let menuSchedule = document.querySelector(".menu_schedule");
        let menuMypost = document.querySelector(".menu_mypost");
        let menuFavorite = document.querySelector(".menu_favorite");
        let menuLogout = document.querySelector(".menu_logout")
  
        if (data && data.data !== null) {
            menuSignin.style.display = "none";
            menuFanpage.style.display = "block";
            menuMessage.style.display = "block";
            menuSchedule.style.display = "block";
            menuMypost.style.display = "block";
            menuFavorite.style.display = "block";
            menuLogout.style.display = "block";
        } else {
            menuSignin.style.display = "block";
            menuFanpage.style.display = "none";
            menuMessage.style.display = "none";
            menuSchedule.style.display = "none";
            menuMypost.style.display = "none";
            menuFavorite.style.display = "none";
            menuLogout.style.display = "none";
        }
      })
      .catch(error => {
        console.error('獲取用戶時出現錯誤：', error);
      });
  }

// redirect to register.html
const registerPage = document.getElementById('registerPage');

// type /register for redircting to the register.html
registerPage.addEventListener("click", function() {
    window.location.href = '/register';
});







