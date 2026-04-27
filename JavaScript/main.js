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

    // ---------------- Contact Form API ----------------
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit-btn");

    if (contactForm) {
        contactForm.addEventListener("submit", async function(e) {
            e.preventDefault(); // Stop default form submission
            
            // Get values
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const message = document.getElementById("message").value;

            // UI Loading state
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;
            formStatus.style.display = "block";
            formStatus.style.color = "var(--text-secondary)";
            formStatus.textContent = "Please wait...";

            try {
                // Send POST request to our backend
                const response = await fetch("/api/messages", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name, email, message })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    formStatus.style.color = "#28a745"; // Green success color
                    formStatus.textContent = "✅ " + data.message;
                    contactForm.reset(); // Clear the form
                } else {
                    formStatus.style.color = "#dc3545"; // Red error color
                    formStatus.textContent = "❌ " + (data.message || "Failed to send message.");
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                formStatus.style.color = "#dc3545";
                formStatus.textContent = "❌ Connection error. Is the server running?";
            } finally {
                // Reset button state
                submitBtn.textContent = "Send Message";
                submitBtn.disabled = false;
                
                // Hide status message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = "none";
                }, 5000);
            }
        });
    }
});