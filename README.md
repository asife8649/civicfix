# CivicFix

Simple full-stack civic complaint management system.

## Technology
- React.js
- Node.js
- Express.js
- MySQL
- JWT
- bcrypt
- Axios

## Features
- User registration and login
- JWT authentication
- Create complaints
- View personal complaints
- Admin complaint management
- Update complaint status
- Delete complaints

## Run

### Backend
cd server
npm install
copy .env.example .env
npm run dev

### Frontend
cd client
npm install
npm run dev

## Database
Run database/schema.sql in MySQL, then update server/.env with your MySQL password.

After registering a user, make that account admin:
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
