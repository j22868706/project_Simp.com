// redirect to applicaiton.html
const post = document.querySelector(".menu_post");

post.addEventListener("click", function () {
    // Check if there is a token
    const token = localStorage.getItem("token");

    if (token) {
        // Redirect to the post page if a token exists
        window.location.href = '/application';
    } else {
        // Stay on the homepage if there is no token
        window.location.href = '/register';
        // Alternatively, you can redirect to the homepage or show a login modal
        // window.location.href = '/';
    }
});

// remove the token and redirct to index.html
const removeToken = document.querySelector(".menu_logout")

removeToken.addEventListener("click", function(){
    localStorage.removeItem("token");  
    window.location.href = '/';
})


// click Logo to redirct to the index.html
const returnIndex = document.getElementById('returnIndex');

returnIndex.addEventListener("click", function() {
    window.location.href = '/';
});


