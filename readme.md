# 🚀 Yassin's Developer Portfolio

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Website-about--yassin.vercel.app-3a6cf4?style=for-the-badge&logo=vercel&logoColor=white)](https://about-yassin.vercel.app/)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Status](https://img.shields.io/badge/Status-Active%20%26%20Live-success?style=for-the-badge)](https://about-yassin.vercel.app/)

<p align="center">
  <strong>Building clean, performant software and pixel-perfect web experiences.</strong><br>
  A modern, high-performance developer portfolio showcasing full-stack projects, interactive skills, and contact automation.
</p>

[Explore Live Portfolio](https://about-yassin.vercel.app/) • [View Projects](https://about-yassin.vercel.app/html/projects.html) • [Get In Touch](https://about-yassin.vercel.app/#Contact)

</div>

---

## 👨‍💻 About Me

Hey there! I'm **Yassin** — a 16-year-old developer based in Cairo, Egypt. I'm passionate about programming, constantly exploring emerging technologies, building real-world projects, and sharpening my skills across:

- 🌐 **Front-End & Full-Stack Web Development**
- 📱 **Cross-Platform Mobile Apps with Flutter & Dart**
- 🐍 **Python Scripting, Automation & CLI Tooling**
- 📊 **Data Science & Machine Learning** (Pandas, NumPy, Scikit-Learn)
- 🎮 **Game Development** with Godot & Unity

---

## ✨ Features

- **⚡ Blazing Fast & Lightweight**: Zero bloated heavy frameworks — crafted with pure HTML5, CSS3, and vanilla JavaScript.
- **🎨 Modern Dark & Light Mode**: Seamless theme switching with automatic system preference detection and `localStorage` persistence.
- **🔄 Live Database Sync**: Skills and project cards are dynamically fetched and rendered in real time from **Supabase PostgreSQL**.
- **📬 Interactive Contact Form**: Direct form submission with database storage and optional instant **Discord Webhook** notifications.
- **🛡️ Secure Admin Dashboard (`/admin`)**: Key-protected management panel for viewing messages, adding/removing skill cards, and creating project showcases.
- **📱 Fully Responsive & Crisp**: Hardware-accelerated animations, subpixel antialiasing, and custom mobile-first layout.

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) ![Bootstrap 5](https://img.shields.io/badge/Bootstrap_5-7952B3?style=flat-square&logo=bootstrap&logoColor=white) |
| **Backend & API** | ![Vercel Functions](https://img.shields.io/badge/Vercel_Serverless-000000?style=flat-square&logo=vercel&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) |
| **Database & Auth** | ![Supabase](https://img.shields.io/badge/Supabase_PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white) ![RLS](https://img.shields.io/badge/Row_Level_Security-Active-blue?style=flat-square) |
| **Libraries & Assets** | ![FontAwesome](https://img.shields.io/badge/FontAwesome_6-528DD7?style=flat-square&logo=fontawesome&logoColor=white) ![AOS](https://img.shields.io/badge/AOS_Animations-00A4A6?style=flat-square) ![Typed.js](https://img.shields.io/badge/Typed.js-FF6F61?style=flat-square) |

</div>

---

## 📂 Project Structure

```bash
Portfolio/
├── api/                    # Vercel serverless API routes
│   ├── _auth.js            # Auth verification, CORS, and safe body parser
│   ├── _supabase.js        # Supabase client singleton
│   ├── messages.js         # Contact message handling (POST, GET, PATCH, DELETE)
│   ├── projects.js         # Project showcase endpoints (GET, POST, DELETE)
│   └── skills.js           # Technical skill endpoints (GET, POST, DELETE)
├── CSS/                    # Stylesheets
│   ├── main.css            # Global portfolio styles, animations & themes
│   ├── projects.css        # Projects gallery page layout
│   └── projectdetails.css  # Project case study layouts
├── html/                   # Additional pages
│   ├── projects.html       # Full projects catalog
│   └── project-details/    # Individual project case study pages
├── Images/                 # Static visual assets & project screenshots
├── JavaScript/             # Client-side scripts
│   └── main.js             # Theme toggle, dynamic card loader, mobile menu
├── supabase/               # Database definitions
│   └── migration.sql       # PostgreSQL schema, indexes, seed data & RLS policies
├── admin.html              # Secure administrative control panel
├── index.html              # Portfolio landing page
├── vercel.json             # Vercel deployment routing & clean URLs
└── package.json            # Dependencies & metadata
```

---

## 🌟 Featured Projects

| Project | Description | Live Demo |
| :--- | :--- | :---: |
| **Web Password Generator** | Secure, randomized password generator with customizable character sets and length controls. | [Live Demo](https://pleasepassword.netlify.app/) |
| **Countries Guide** | Real-time world explorer fetching country flags, populations, and capitals via live REST API. | [Live Demo](https://countrysguide.netlify.app/) |
| **Temperature Convertor** | Clean, instant conversion tool between Celsius, Fahrenheit, and Kelvin. | [Live Demo](https://thetemperature-convertor.vercel.app/) |
| **Egypt Culture & Tourism** | Responsive showcase celebrating Egyptian heritage, travel itineraries, and historic wonders. | [Live Demo](https://egypt-culture.netlify.app/) |
| **Todo List Web App** | Task management application with categorized progress tracking and clean UI. | [Live Demo](https://yourtodos-list.netlify.app/) |

---

## 🚀 Running Locally & Deploying

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yassinah82/Portfolio.git
   cd Portfolio
   ```
2. Open `index.html` in your browser or run a lightweight local web server:
   ```bash
   npx serve .
   ```

### Supabase & Vercel Deployment
1. **Database**: Run [`supabase/migration.sql`](./supabase/migration.sql) in your **Supabase Dashboard $\rightarrow$ SQL Editor**.
2. **Hosting**: Import the repository into [Vercel](https://vercel.com/) and configure your Environment Variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
   - `DISCORD_WEBHOOK_URL` *(Optional)*

---

## 📬 Connect With Me

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/yassinahmed82/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yassinah82)
[![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/GurqXcS9g9)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/yassinah82/)
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@YassinAhmedYehia)

<br>

*Crafted with 🤍, clean code, and passion for building.*

</div>

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yassinah82/Portfolio.git
   cd Portfolio
   ```
2. Open `index.html` in your browser or run a lightweight local web server:
   ```bash
   npx serve .
   ```

### Supabase & Vercel Deployment
1. **Database**: Run [`supabase/migration.sql`](./supabase/migration.sql) in your **Supabase Dashboard $\rightarrow$ SQL Editor**.
2. **Hosting**: Import the repository into [Vercel](https://vercel.com/) and configure your Environment Variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
   - `DISCORD_WEBHOOK_URL` *(Optional)*

---

## 📬 Connect With Me

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/yassinahmed82/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yassinah82)
[![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/GurqXcS9g9)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/yassinah82/)
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@YassinAhmedYehia)

<br>

*Crafted with 🤍, clean code, and passion for building.*

</div>

