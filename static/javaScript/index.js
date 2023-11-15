// let card = document.querySelector(".card");
// let detail = document.querySelector(".detail");
// let closeDetailButton = document.querySelector(".close-detail");

// card.addEventListener("click", function() {
//     detail.classList.add("active");
// });

// closeDetailButton.addEventListener("click", function() {
//     detail.classList.remove("active");
// });

// let menuBar = document.querySelector(".menu-bar");
// let sidebar = document.querySelector(".sidebar");
// let logo = document.querySelector(".logo");

// menuBar.addEventListener("click", function() {
//     sidebar.classList.add("active");
// });

// logo.addEventListener("click", function() {
//     sidebar.classList.remove("active");
// });


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

function loadingJob() {
  // Proceed with the fetch request
  fetch("/api/jobPost", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Handle the data received from the server
      console.log(data);

      // Assuming you have a container element with the ID "job_list"
      const jobListContainer = document.getElementById('job_list');

      // Check if data is an array and not empty
      if (Array.isArray(data) && data.length > 0) {
        // Iterate over the array of job posts
        data.forEach((jobPost) => {
          // Create elements for each job post
          const jobPostElement = document.createElement('div');
          jobPostElement.classList.add('card');

          // Update the content of each element
          jobPostElement.innerHTML = `
            <div class="card-left blue-bg">
              <img src="static/images/wehelp_log.png">
            </div>
            <div class="card-center">
              <h3>${jobPost.job_title}</h3>
              <p class="card-detail">${jobPost.job_description}</p>
              <p class="card-loc"><ion-icon name="location-outline"></ion-icon> 地點:  ${jobPost.job_zipcode}<span> ${jobPost.job_city}</span></p>
              <p class="card-loc"><ion-icon name=today-outline></ion-icon> 刊登時間: ${jobPost.post_time}</p>
            </div>
            <div class="card-right">
              <div class="card-tag">
              <h5>工作時間</h5>
              <p id="job_date"><ion-icon name=today-outline></ion-icon>${jobPost.job_date}</p>
              <p><ion-icon name="briefcase-outline"></ion-icon>${jobPost.job_start_time} - ${jobPost.job_end_time}</p>
              </div>
              <div class="card-salary">
              <p><b>報酬</b><span class="card-salary-font">  ${jobPost.job_salary}  元</span></p>
              </div>
          </div>
          `;

          // Append the job post element to the main job list container
          jobListContainer.appendChild(jobPostElement);
          jobPostElement.addEventListener('click', () => {
            const detailContainer = document.querySelector('.detail');
            const detailHeader = detailContainer.querySelector('.detail-header h2');
            const qContent = document.getElementById("qContent")
            const qLocation = document.getElementById("qLocation")
            const qPayMethod = document.getElementById("qPayMethod")
            const qPayDate = document.getElementById("qPayDate")
            const qWorkingDate = document.getElementById("qWorkingDate")
            const qWorkingHour = document.getElementById("qWorkingHour")
            const qNumPosition = document.getElementById("qNumPosition")
            const qOthers = document.getElementById("qOthers")
 


            qContent.textContent =  ` ${jobPost.job_description}`;
            qLocation.textContent =  `  ${jobPost.job_zipcode}  ${jobPost.job_city} ${jobPost.job_location}`;
            qPayMethod.textContent = `  ${jobPost.pay_method}`;

            qPayDate.textContent =  `  ${jobPost.pay_date}`;
            qWorkingDate.textContent =  ` ${jobPost.job_date}  `;
            qWorkingHour.textContent =  ` ${jobPost.job_start_time}  ${jobPost.job_end_time} `;
            qNumPosition.textContent = `  ${jobPost.number_of_job_positions} 人 `;

            qOthers.textContent =  `  ${jobPost.job_others}`;


            

            detailHeader.textContent = jobPost.job_title;

 
          });

          jobListContainer.appendChild(jobPostElement);
        });
      } else {
        // Handle the case when there are no job posts
        jobListContainer.innerHTML = '<p>No job posts available.</p>';
      }
    })
    .catch((error) => {
      console.error("Error fetching job posts:", error.message);
    });
}

// Load job posts when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  loadingJob();
});
