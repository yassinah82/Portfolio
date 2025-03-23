document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger"); // Use querySelector for class
    const navLinks = document.getElementById("nav-links");
    const links = document.querySelectorAll(".nav-links li a"); // Select all links inside nav-links

    // Toggle menu on hamburger click
    hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("show");
    });

    // Hide menu when a link is clicked
    links.forEach(link => {
        link.addEventListener("click", function () {
            navLinks.classList.remove("show"); // Remove "show" class
        });
    });
});

// Change Color


function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle("dark-mode"); 

    //change button text
    const button = document.querySelector("button");
    button.textContent = isDark ? "Switch to Light" : "Switch to Dark";
}


// contact form function 

function readOnly(){
    const name = document.getElementById("name")
    const email = document.getElementById("email")
    const message = document.getElementById("message")

    name.setAttribute("readonly",true)
    email.setAttribute("readonly",true)
    message.setAttribute("readonly",true)

}
