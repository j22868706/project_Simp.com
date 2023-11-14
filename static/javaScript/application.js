function submitPostJob(event) {
    event.preventDefault();  // Prevent the default form submission

    const token = localStorage.getItem("token");

    // Proceed with the fetch request
    fetch("/api/jobPost", {
        method: "POST",
        body: new FormData(document.getElementById("postJob")),
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        const resultMessageBox = document.querySelector(".message_box");
        resultMessageBox.textContent = data.message;

        if (data.error) {
            resultMessageBox.style.color = "red";
            resultMessageBox.style.display = "block";
        } else {
            resultMessageBox.style.color = "green";
            resultMessageBox.style.display = "block";
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}


