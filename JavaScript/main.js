document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger"); 
    const navLinks = document.getElementById("nav-links");
    const links = document.querySelectorAll(".nav-links li a"); 
    const toggleBtn = document.getElementById("theme-toggle");
    const body = document.body;

    // ---------------- Mobile Menu ----------------
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });

    links.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("show");
        });
    });

   // ---------------- THEME DETECTION ----------------
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    const savedTheme = localStorage.getItem("theme");

    function applyTheme(isDark) {
        body.classList.toggle("dark-mode", isDark);
        toggleBtn.textContent = isDark ? "🌙" : "☀️";
    }

    if (savedTheme) {
        applyTheme(savedTheme === "dark");
    } else {
        applyTheme(systemPrefersDark.matches);
    }


    systemPrefersDark.addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
            applyTheme(e.matches);
        }
    });

    
    toggleBtn.addEventListener("click", () => {
        const isDark = !body.classList.contains("dark-mode");
        applyTheme(isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
});