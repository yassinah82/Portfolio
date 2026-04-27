# Yassin's Portfolio Backend - User Manual

## Overview of Backend Updates
Here is a complete list of everything that was built for your portfolio's new backend system:

1. **Express.js Server**: A fast, modern web server running on Node.js (Port 5000).
2. **MongoDB Atlas Database**: A free cloud database to store your data securely.
3. **Projects API**: Endpoints to Add, View, Edit, and Delete your portfolio projects.
4. **Contact Form API**: Endpoints to receive messages from your website visitors.
5. **Email Notifications**: An automated system that emails `yassinah82@gmail.com` whenever a new contact form is submitted.
6. **Admin Authentication**: A secure login system using JWT (JSON Web Tokens) to ensure only you can manage projects and read messages.
7. **Security Features**: 
   - **Rate Limiting**: Stops spammers from flooding your inbox (max 5 messages per 15 minutes).
   - **Password Hashing**: Encrypts your admin password using bcrypt.
   - **CORS & Helmet**: Protects the API from unauthorized browser requests.

---

## How to Start the Backend
Whenever you want to work on your backend or start it up:

1. Open a terminal (or VS Code terminal) in the backend folder:
   `e:\yassin's files\git\portfolio\backend`
2. Run the development server command:
   ```bash
   npm run dev
   ```
3. You should see a message saying the server is running and MongoDB is connected.

---

## How to Manage Your Projects (API Usage)

Right now, your backend has an API (Application Programming Interface). This is how you "talk" to your database. You can interact with it using the browser console, or tools like Postman.

### 1. Logging In (Getting your Admin Pass)
Before you can add or delete projects, you must log in to get your security token.

**Using Browser Console (F12 -> Console):**
```javascript
let token;
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123456' })
}).then(r => r.json()).then(d => { 
    token = d.token; 
    console.log('Login Successful! Token saved.'); 
});
```

### 2. Viewing All Projects
Anyone can view the projects. You can just visit `http://localhost:5000/api/projects` in your browser.

### 3. Adding a New Project
*You must run the Login code above first!*

**Using Browser Console:**
```javascript
fetch('http://localhost:5000/api/projects', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token 
  },
  body: JSON.stringify({
    title: "My Awesome New App",
    description: "This is a description of my new app.",
    technologies: ["React", "Node.js"],
    githubLink: "https://github.com/yassinah82/myapp",
    liveDemoLink: "https://myapp.com",
    featured: true
  })
}).then(r => r.json()).then(d => console.log('Project Added:', d));
```

### 4. Deleting a Project
*You must run the Login code above first!*
You need the specific ID of the project you want to delete (you can find this by viewing all projects).

**Using Browser Console:**
```javascript
const projectId = "PASTE_THE_ID_HERE";
fetch(`http://localhost:5000/api/projects/${projectId}`, {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer ' + token }
}).then(r => r.json()).then(d => console.log('Project Deleted:', d));
```

---

## Contact Form & Messages

### Testing the Contact Form
To simulate a user sending you a message from your website:

**Using Browser Console:**
```javascript
fetch('http://localhost:5000/api/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'A Website Visitor',
    email: 'visitor@example.com',
    message: 'Hey Yassin, I love your portfolio!'
  })
}).then(r => r.json()).then(d => console.log(d));
```
*If successful, you will receive an email at yassinah82@gmail.com!*

### Viewing Received Messages
*You must run the Login code above first!*

**Using Browser Console:**
```javascript
fetch('http://localhost:5000/api/messages', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer ' + token }
}).then(r => r.json()).then(d => console.log('Messages:', d));
```

---

## Important Credentials
Keep these safe. They are currently stored in your `.env` file.

*   **Admin Username**: `admin`
*   **Admin Password**: `admin123456`
*   **MongoDB Cluster**: `portfoliobackend.pireend.mongodb.net`
*   **Email Receiving Notifications**: `yassinah82@gmail.com`

*Note: It is highly recommended to change the admin password and Google App Password for production deployment.*
