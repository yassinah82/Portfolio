document.addEventListener("DOMContentLoaded", function () {
    // ---------------- AOS Initialization ----------------
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // ---------------- Typed.js Initialization ----------------
    const typedElement = document.getElementById("typed-text");
    if (typedElement && typeof Typed !== 'undefined') {
        new Typed("#typed-text", {
            strings: [
                "Software Developer",
                "Frontend Developer",
                "Game Developer",
                "Tech Enthusiast"
            ],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 2000,
            loop: true
        });
    }

    // ---------------- Selectors ----------------
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.getElementById("nav-links");
    const links = document.querySelectorAll(".nav-links li a");
    const toggleBtn = document.getElementById("theme-toggle");
    const backToTopBtn = document.getElementById("back-to-top");
    const body = document.body;

    // ---------------- Mobile Menu ----------------
    if (hamburger) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("show");
            hamburger.textContent = navLinks.classList.contains("show") ? "✕" : "☰";
        });
    }

    links.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("show");
            if (hamburger) hamburger.textContent = "☰";
        });
    });

    // ---------------- Back to Top ----------------
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = "block";
            } else {
                backToTopBtn.style.display = "none";
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

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