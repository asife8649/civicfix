# CivicFix 🏙️

### Simple Civic Complaint Management System

CivicFix is a full-stack web application where citizens can report local civic problems and administrators can manage those complaints.

For example, users can report problems like road damage, garbage, street lights, water leakage, and drainage issues.

---

## 🌐 Live Project

**Frontend:**  
https://civicfix-asife8649.vercel.app/

**Backend:**  
https://civicfix-0tmy.onrender.com/

**GitHub:**  
https://github.com/asife8649/civicfix

---

## ✨ Main Features

### Citizen
- Register and Login
- Create a complaint
- Select complaint category
- Capture a photo using the device camera
- Capture current location
- View submitted complaints
- Track complaint status

### Admin
- Login as Admin
- View all complaints
- View complaint photos
- View complaint location
- Update complaint status
- Delete complaints
- Filter complaints by status

---

## 📸 Live Photo & Location

When a user creates a complaint:

```text
Create Complaint
       ↓
Capture Photo
       ↓
Capture Current Location
       ↓
Submit Complaint
       ↓
Admin Reviews Complaint
```

The system stores the photo, location, and capture time with the complaint.

---

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- Axios
- React Router
- CSS

### Backend
- Node.js
- Express.js
- REST API
- JWT
- bcryptjs
- Multer

### Database
- TiDB Cloud
- MySQL

### Other Services
- Cloudinary — Image Storage
- Vercel — Frontend Hosting
- Render — Backend Hosting
- GitHub — Code Management

---

## 🔐 Authentication

The project uses **JWT authentication**.

Passwords are encrypted using **bcryptjs** before storing them in the database.

Admin-only features are protected using role-based access.

---

## 🔄 How the Project Works

```text
Citizen
   ↓
Login
   ↓
Create Complaint
   ↓
Photo + Location
   ↓
Backend API
   ↓
Database + Cloudinary
   ↓
Admin Dashboard
   ↓
Update Complaint Status
```

---

## 📂 Project Structure

```text
civicfix/
│
├── client/       # React Frontend
│
├── server/       # Node.js Backend
│
├── database/     # Database Schema
│
└── README.md
```

---

## 🚀 Run Locally

### Backend

```bash
cd server
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:4000
```

### Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 🎯 Project Goal

The main goal of CivicFix is to make it easier for citizens to report civic problems and help administrators manage those complaints efficiently.

---

## 🔮 Future Improvements

- Email notifications
- Complaint map
- Better admin analytics
- Complaint priority system
- Duplicate complaint detection
- Citizen feedback system

---

## 👨‍💻 Developer

**Asif Ekbal**

Computer Science & Engineering Student
