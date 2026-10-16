// ---------------- Profile Image Auto-Fallback ----------------
window.handleProfileImageFallback = function (img) {
    if (!img) return;
    if (!img.dataset.attempt) {
        img.dataset.attempt = "1";
        img.src = "Images/profile.jpg";
    } else if (img.dataset.attempt === "1") {
        img.dataset.attempt = "2";
        img.src = "Images/profile.jpeg";
    } else if (img.dataset.attempt === "2") {
        img.dataset.attempt = "3";
        img.src = "Images/profile.webp";
    } else {
        img.onerror = null;
        img.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' width='100%25' height='100%25'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%233a6cf4'/><stop offset='100%25' stop-color='%23601cfc'/></linearGradient></defs><rect width='100%25' height='100%25' fill='%231e293b'/><circle cx='100' cy='75' r='40' fill='url(%23g)'/><path d='M40 170 C40 125, 160 125, 160 170 Z' fill='url(%23g)'/></svg>";
    }
};

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
                "Data Science Enthusiast",
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

    // ---------------- Contact Form (Netlify Database) ----------------
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit-btn");

    if (contactForm) {
        contactForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !message) return;

            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;
            if (formStatus) {
                formStatus.style.display = "block";
                formStatus.style.color = "var(--text-secondary)";
                formStatus.textContent = "Please wait...";
            }

            try {
                const response = await fetch("/api/messages", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email, message }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    if (formStatus) {
                        formStatus.style.color = "#28a745";
                        formStatus.textContent = "✅ " + (data.message || "Message sent successfully!");
                    }
                    contactForm.reset();
                } else {
                    if (formStatus) {
                        formStatus.style.color = "#dc3545";
                        formStatus.textContent = "❌ " + (data.error || data.message || "Failed to send message.");
                    }
                }
            } catch (error) {
                console.error("Error submitting contact form:", error);
                if (formStatus) {
                    formStatus.style.color = "#dc3545";
                    formStatus.textContent = "❌ Connection error. Please try again later.";
                }
            } finally {
                submitBtn.textContent = "Send Message";
                submitBtn.disabled = false;

                if (formStatus) {
                    setTimeout(() => {
                        formStatus.style.display = "none";
                    }, 6000);
                }
            }
        });
    }

    // ---------------- Dynamic Skills & Projects Sync ----------------
    function escapeHTML(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    async function loadDynamicSkills() {
        const skillsContainer = document.querySelector("#Skills .content") || document.getElementById("skills-container");
        if (!skillsContainer) return;

        try {
            const res = await fetch("/api/skills");
            const json = await res.json();
            if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
                skillsContainer.innerHTML = "";
                json.data.forEach(skill => {
                    const card = document.createElement("div");
                    card.className = "card";
                    const tagList = Array.isArray(skill.tags) ? skill.tags : (skill.tags ? skill.tags.split(",") : []);
                    card.innerHTML = `
                        <div class="icon">
                            <i class="${escapeHTML(skill.icon || 'fas fa-code')}"></i>
                        </div>
                        <div class="info">
                            <h3>${escapeHTML(skill.title)}</h3>
                            <p>${escapeHTML(skill.description)}</p>
                            <div class="tags">
                                ${tagList.map(t => `<span>${escapeHTML(t.trim())}</span>`).join("")}
                            </div>
                        </div>
                    `;
                    skillsContainer.appendChild(card);
                });
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            } else if (json.data && json.data.length === 0) {
                skillsContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 30px;"><p>No skills added yet.</p></div>`;
            }
        } catch (err) {
            console.warn("Could not load dynamic skills:", err);
        }
    }

    async function loadDynamicProjects() {
        const homeProjectsContainer = document.querySelector("#Projects .content") || document.getElementById("projects-container");
        const fullProjectsContainer = document.querySelector(".projects-grid") || document.getElementById("projects-grid");

        // 1. Featured projects for main page (index.html)
        if (homeProjectsContainer) {
            try {
                const res = await fetch("/api/projects?featured=true");
                const json = await res.json();
                if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
                    homeProjectsContainer.innerHTML = "";
                    json.data.forEach(p => {
                        const card = document.createElement("div");
                        card.className = "card";
                        const tagList = Array.isArray(p.tags) ? p.tags : (p.tags ? p.tags.split(",") : []);
                        const imgPath = p.image_url ? (p.image_url.startsWith("/") || p.image_url.startsWith("http") ? p.image_url : "/" + p.image_url) : "/Images/background.png";
                        card.innerHTML = `
                            <div class="image">
                                <img src="${escapeHTML(imgPath)}" alt="${escapeHTML(p.title)}" onerror="this.src='/Images/background.png'">
                            </div>
                            <div class="info">
                                <h3><i class="fas fa-folder-open"></i> ${escapeHTML(p.title)}</h3>
                                <p>${escapeHTML(p.description)}</p>
                                <div class="tags">
                                    ${tagList.map(t => `<span>${escapeHTML(t.trim())}</span>`).join("")}
                                </div>
                            </div>
                            <div class="card-links">
                                ${p.live_url && p.live_url !== '#' ? `<a class="btn btn-primary" href="${escapeHTML(p.live_url)}" target="_blank">Visit Site</a>` : ''}
                                ${p.details_url ? `<a class="btn btn-secondary" href="${escapeHTML(p.details_url)}">Details</a>` : ''}
                            </div>
                        `;
                        homeProjectsContainer.appendChild(card);
                    });
                    if (typeof AOS !== 'undefined') {
                        AOS.refresh();
                    }
                } else if (json.data && json.data.length === 0) {
                    homeProjectsContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 30px;"><p>No featured projects found.</p></div>`;
                }
            } catch (err) {
                console.warn("Could not load dynamic homepage projects:", err);
            }
        }

        // 2. All projects for projects page (html/projects.html)
        if (fullProjectsContainer) {
            try {
                const res = await fetch("/api/projects");
                const json = await res.json();
                if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
                    fullProjectsContainer.innerHTML = "";
                    json.data.forEach(p => {
                        const card = document.createElement("div");
                        card.className = "project-card";
                        const tagList = Array.isArray(p.tags) ? p.tags : (p.tags ? p.tags.split(",") : []);
                        const imgPath = p.image_url ? (p.image_url.startsWith("/") || p.image_url.startsWith("http") ? p.image_url : "/" + p.image_url) : "/Images/background.png";
                        card.innerHTML = `
                            <img src="${escapeHTML(imgPath)}" alt="${escapeHTML(p.title)}" class="project-image" onerror="this.src='/Images/background.png'">
                            <div class="project-content">
                                <h3 class="project-title">${escapeHTML(p.title)}</h3>
                                <p class="project-description">${escapeHTML(p.description)}</p>
                                ${tagList.length > 0 ? `
                                    <ul class="project-features">
                                        ${tagList.map(t => `<li>${escapeHTML(t.trim())}</li>`).join("")}
                                    </ul>
                                ` : ''}
                                <div class="project-links">
                                    ${p.live_url && p.live_url !== '#' ? `<a href="${escapeHTML(p.live_url)}" target="_blank" class="project-btn primary-btn">Live Demo</a>` : ''}
                                    ${p.details_url ? `<a href="${escapeHTML(p.details_url)}" class="project-btn secondary-btn">Details</a>` : ''}
                                </div>
                            </div>
                        `;
                        fullProjectsContainer.appendChild(card);
                    });
                } else if (json.data && json.data.length === 0) {
                    fullProjectsContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 40px;"><p>No projects found in database.</p></div>`;
                }
            } catch (err) {
                console.warn("Could not load dynamic projects on projects page:", err);
            }
        }
    }

    loadDynamicSkills();
    loadDynamicProjects();
});