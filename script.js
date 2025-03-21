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


// Scroll
document.addEventListener("DOMContentLoaded", function () {
    let lastScrollTop = 0;
    const navbar = document.querySelector("header");

    window.addEventListener("scroll", function () {
        let currentScroll = window.scrollY;

        if (currentScroll > lastScrollTop) {
            // Scrolling down → Hide navbar
            navbar.style.top = "-100px"; 
        } else {
            // Scrolling up → Show navbar
            navbar.style.top = "0"; 
        }

        lastScrollTop = currentScroll;
    });
});

