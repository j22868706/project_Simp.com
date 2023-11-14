let switchSignin = document.querySelector(".switch_to_singin");
let switchSignup = document.querySelector(".switch_to_signup");
let containerSignup = document.querySelector(".container_signup");
let containerSignin = document.querySelector(".container_signin");

containerSignup.style.display = "none";
containerSignin.style.display = "block";

switchSignin.addEventListener("click", function() {
    containerSignup.style.display = "none";
    containerSignin.style.display = "block";
});

switchSignup.addEventListener("click", function() {
    containerSignup.style.display = "block";
    containerSignin.style.display = "none";
});



const returnIndex = document.getElementById('returnIndex');

returnIndex.addEventListener("click", function() {
    window.location.href = '/';
});

function submitSignupForm(signupEvent) {
    signupEvent.preventDefault();

    const signupNameInput = document.getElementById("signupName");
    const signupEmailInput = document.getElementById("signupEmail");
    const signupPasswordInput = document.getElementById("signupPwd");
    const signupRePasswordInput = document.getElementById("signupRePwd");
    const messageBox = document.querySelector(".signup_message_box");

    if (signupNameInput.value === "" || signupEmailInput.value === "" || signupPasswordInput.value === "" || signupRePasswordInput.value === "") {
        messageBox.style.display = "block";
        messageBox.textContent = "註冊失敗，有些欄位還沒填寫喔！";
    } else if (!signupEmailInput.checkValidity()) {
        messageBox.style.display = "block";
        messageBox.textContent = "請輸入有效的電子郵件信箱！";
    } else if (signupPasswordInput.value.length < 6 || signupPasswordInput.value.length > 12) {
        // Check if the password length is valid
        messageBox.style.display = "block";
        messageBox.textContent = "請輸入6-12個英數字，大小寫不同的密碼！";
    } else if (signupPasswordInput.value !== signupRePasswordInput.value) {
        // Compare the values
        messageBox.style.display = "block";
        messageBox.textContent = "兩次密碼輸入並不相同！";
    } else {
        fetch("/api/user", {
            method: "POST",
            body: new FormData(document.getElementById("signupForm")),
        })
            .then((response) => response.json())
            .then((data) => {
                const resultMessageBox = document.querySelector(".signup_message_box");
                resultMessageBox.textContent = data.message;

                if (data.error) {
                    resultMessageBox.style.color = "red";
                    resultMessageBox.style.display = "block";
                } else {
                    resultMessageBox.style.color = "green";
                    resultMessageBox.style.display = "block";
            
                    // Wait for 3 seconds and then redirect to the homepage
                    setTimeout(function () {
                        window.location.href = '/register';
                    }, 3000); // 3000 milliseconds = 3 seconds
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
}

function submitSigninForm(signinEvent) {
    signinEvent.preventDefault();
  
    const signinEmailInput = document.getElementById("signinEmail");
    const signinPasswordInput = document.getElementById("signinPwd");

    if (signinEmailInput.value === "" || signinPasswordInput.value === "") {
        const signinMessageBox = document.querySelector(".signin_message_box");
        signinMessageBox.style.display = "block";
        signinMessageBox.textContent = "登入失敗，有些欄位還沒填寫喔！";
    } else {
        fetch("/api/user/auth", {
            method: "PUT",
            body: new FormData(document.getElementById("signinForm")),
        })
        .then((response) => response.json())
        .then((data) => {
            const signinMessageBox = document.querySelector(".signin-message-box");
            if (data.error) {
                signinMessageBox.style.color = "red";
                signinMessageBox.style.display = "block";
                signinMessageBox.textContent = data.message;
            } else {
                localStorage.setItem("token", data.token);
                const isLoggedIn = true;
                if (isLoggedIn) {
                    window.location.href ="/";
                }
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }
  }