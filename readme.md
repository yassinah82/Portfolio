# 🧠 Yassin's Dev Portfolio 🚀

Yo! I'm Yassin — a software developer passionate about Python, Flutter, Front-End development, Data Science & ML. 
This repo is my personal **Portfolio Website** – where I showcase my projects, skills, and experience.

---

## 🛠️ Built With

- **HTML5, CSS3, JavaScript** (Vanilla, zero-framework, lightning fast)
- **Supabase** (PostgreSQL database with Row Level Security)
- **Vercel** (Serverless API Functions & static global CDN hosting)

---

## 🚀 Deploying to Vercel + Supabase

### 1. Database Setup (Supabase)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and open your project.
2. Navigate to **SQL Editor** in the left sidebar.
3. Click **New query**, paste the entire contents of [`supabase/migration.sql`](./supabase/migration.sql), and click **Run**.
4. This creates the `messages`, `skills`, and `projects` tables, indexes, Row Level Security (RLS) policies, and seeds initial data.

### 2. Deployment Setup (Vercel)
1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com/), click **Add New...** -> **Project** and import this repository.
3. In **Project Settings -> Environment Variables**, add the following:
   - `SUPABASE_URL`: Your Supabase Project URL (`https://<ref>.supabase.co`)
   - `SUPABASE_ANON_KEY`: Your Supabase public anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase secret service_role key
   - `ADMIN_PASSWORD`: A secret password for accessing `/admin`
   - `DISCORD_WEBHOOK_URL` *(Optional)*: Discord webhook URL for contact notifications
4. Click **Deploy**. Vercel will host your static files and deploy the `/api/*` serverless functions automatically.

---

## 🧩 What’s Inside?

✨ Smooth, responsive UI with dark/light mode  
✨ Dynamic skill cards and project showcase synchronized with Supabase  
✨ Working contact form with database persistence & optional Discord notifications  
✨ Secure admin panel (`/admin`) for managing messages, skills, and projects  

---

## 📬 Wanna Talk?

Pull up in my DMs or connect via the links on the website!

---

*Made with 🤍, clean code, and passion for engineering.*
