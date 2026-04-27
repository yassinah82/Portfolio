# 📡 Portfolio Backend API Documentation

Base URL: `http://localhost:5000/api`

---

## 🔐 Authentication

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Get Current Admin
```
GET /api/auth/me
Authorization: Bearer <token>
```

---

## 📁 Projects

### Get All Projects (Public)
```
GET /api/projects
GET /api/projects?featured=true
```

### Get Single Project (Public)
```
GET /api/projects/:id
```

### Create Project (Admin)
```
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Countries Guide",
  "description": "Explore any country in the world",
  "technologies": ["HTML", "CSS", "JavaScript", "REST API"],
  "imageUrl": "https://example.com/image.png",
  "githubLink": "https://github.com/yassinah82/Country-Guide-App",
  "liveDemoLink": "https://countrysguide.netlify.app/",
  "featured": true
}
```

### Update Project (Admin)
```
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "featured": false
}
```

### Delete Project (Admin)
```
DELETE /api/projects/:id
Authorization: Bearer <token>
```

---

## 📬 Messages (Contact Form)

### Submit Message (Public — Rate Limited)
```
POST /api/messages
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hey Yassin, great portfolio!"
}
```
> ⚠️ Limited to 5 requests per 15 minutes per IP

### Get All Messages (Admin)
```
GET /api/messages
Authorization: Bearer <token>
```

### Mark Message as Read (Admin)
```
PATCH /api/messages/:id/read
Authorization: Bearer <token>
```

### Delete Message (Admin)
```
DELETE /api/messages/:id
Authorization: Bearer <token>
```

---

## 🚀 Quick Start

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create your .env file (copy from .env.example)
cp .env.example .env

# 4. Create admin user
npm run seed

# 5. Start development server
npm run dev

# 6. Server runs at http://localhost:5000/api
```

---

## 🔒 Security Features

| Feature | Implementation |
|---|---|
| Rate Limiting | 5 req/15min for contact, 100 req/15min for API |
| CORS | Configurable allowed origins |
| Helmet | HTTP security headers |
| JWT Auth | 24h expiry, Bearer token |
| Password Hashing | bcrypt with 12 salt rounds |
| Input Validation | Mongoose schema validation |
| Body Size Limit | 10KB max payload |
