# 🏙️ CivicFix

### Simple Civic Complaint Management System

CivicFix is a full-stack web application that allows citizens to report civic issues in their area and helps administrators manage, track, and resolve those complaints.

The system allows citizens to capture a live photo using their device camera along with their current GPS location while submitting a complaint.

## 🌐 Live Demo

**Frontend:** https://civicfix-asife8649.vercel.app/

**Backend API:** https://civicfix-0tmy.onrender.com/

**GitHub:** https://github.com/asife8649/civicfix

## ✨ Features

### 👤 Citizen
- User registration and login
- JWT-based authentication
- Create civic complaints
- Select complaint category
- Capture live photo using device camera
- Capture current GPS location
- Automatic photo and location timestamps
- View submitted complaints
- Track complaint status
- View complaint details

### 🛡️ Admin
- Admin authentication
- View all complaints
- View complaint images
- View detailed complaint location
- View photo captured time
- View location captured time
- View complaint submission time
- Update complaint status
- Delete complaints
- Filter complaints by status

### 📸 Live Evidence Capture

When submitting a complaint, the application captures:
- Live camera photo
- Current GPS location
- Photo capture time
- Location capture time
- Complaint submission time

Images are uploaded to Cloudinary and complaint information is stored in the database.

> Camera and GPS capture improve the reliability of complaint evidence, but browser-based applications cannot completely prevent GPS spoofing or other manipulation.

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- REST API
- JWT
- bcryptjs
- Multer
- Streamifier

### Database
- TiDB Cloud
- MySQL-compatible database
- MySQL 8.0 for local development

### Cloud Services
- Vercel — Frontend deployment
- Render — Backend deployment
- Cloudinary — Image storage
- TiDB Cloud — Production database
- GitHub — Source code and version control

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       Citizen       │
                    │   React + Vite      │
                    └──────────┬──────────┘
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Node.js + Express │
                    │       Backend       │
                    └─────────┬───────────┘
                              │
                  ┌───────────┴───────────┐
                  ▼                       ▼
        ┌─────────────────┐      ┌─────────────────┐
        │   TiDB Cloud    │      │   Cloudinary    │
        │    Database     │      │ Image Storage   │
        └─────────────────┘      └─────────────────┘
```

## 📂 Project Structure

```text
civicfix/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── admin/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   ├── uploads/
│   ├── .env
│   ├── .env.example
│   └── package.json
├── database/
│   └── schema.sql
├── .gitignore
└── README.md
```

## 🔐 Authentication

CivicFix uses JWT (JSON Web Token) for authentication.

```text
User
  ↓
Register / Login
  ↓
Backend validates credentials
  ↓
JWT token generated
  ↓
Token stored in browser
  ↓
Token sent with API requests
  ↓
Protected API access
```

Passwords are hashed using bcryptjs before being stored in the database.

## 📸 Complaint Capture Flow

```text
Create Complaint
       ↓
Open Device Camera
       ↓
Capture Live Photo
       ↓
Capture Current GPS
       ↓
Record Photo & Location Time
       ↓
Upload Image to Cloudinary
       ↓
Save Complaint in TiDB
       ↓
Admin Reviews Complaint
```

## 🗄️ Database

### Users
Stores:
- User ID
- Name
- Email
- Password
- Role
- Account creation time

### Complaints
Stores:
- Complaint ID
- User ID
- Title
- Description
- Category
- Status
- Image URL
- Latitude
- Longitude
- Location details
- Photo captured time
- Location captured time
- Submission time

### Complaint Status

```text
Pending
   ↓
In Progress
   ↓
Resolved
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |

### Complaints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/complaints` | Create a complaint |
| GET | `/api/complaints/my` | Get user's complaints |
| GET | `/api/complaints` | Get all complaints |
| PUT | `/api/complaints/:id/status` | Update complaint status |
| DELETE | `/api/complaints/:id` | Delete complaint |

## ⚙️ Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/asife8649/civicfix.git
cd civicfix
```

### 2. Install Backend

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create `server/.env`:

```env
PORT=4000

DB_HOST=your_database_host
DB_PORT=4000
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=civicfix

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Never upload `.env` or any passwords/secrets to GitHub.**

### 4. Setup Database

Run:

```text
database/schema.sql
```

using your MySQL/TiDB-compatible database.

### 5. Start Backend

```bash
cd server
npm run dev
```

Backend: `http://localhost:4000`

### 6. Install Frontend

Open another terminal:

```bash
cd client
npm install
```

### 7. Start Frontend

```bash
npm run dev
```

Frontend: `http://localhost:5173`

## 🚀 Production Deployment

```text
                    GitHub
                       │
              ┌────────┴────────┐
              ▼                 ▼
           Vercel             Render
              │                 │
              ▼                 ▼
        React Frontend     Node.js Backend
                                │
                       ┌────────┴────────┐
                       ▼                 ▼
                  TiDB Cloud        Cloudinary
                   Database        Image Storage
```

### Frontend
**Vercel:** https://civicfix-asife8649.vercel.app/

### Backend
**Render:** https://civicfix-0tmy.onrender.com/

### Database
**TiDB Cloud**

### Image Storage
**Cloudinary**

## 🔒 Security

- JWT authentication
- Password hashing with bcryptjs
- Protected API routes
- Admin-only operations
- Environment variables for sensitive information
- Image type validation
- Maximum image upload size
- HTTPS in production

## 🎯 Project Objective

The goal of CivicFix is to provide a simple platform for citizens to report local civic problems and allow administrators to manage those complaints efficiently.

Examples:
- 🛣️ Road damage
- 🗑️ Garbage problems
- 💡 Street light issues
- 💧 Water leakage
- 🚰 Drainage problems
- 🏗️ Public infrastructure damage

## 🔮 Future Improvements

- Email notifications
- SMS notifications
- Push notifications
- Interactive complaint map
- Advanced analytics dashboard
- Complaint priority prediction using Machine Learning
- Duplicate complaint detection
- Department-wise complaint assignment
- Citizen feedback and ratings
- Progressive Web App (PWA)

## 👨‍💻 Developer

**Asif Ekbal**

Computer Science & Engineering Student

## 📄 License

This project is developed for educational, portfolio, and placement purposes.
