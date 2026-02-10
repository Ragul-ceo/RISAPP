# Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites
- Node.js 14+ (https://nodejs.org)
- MySQL 8.0+ (https://dev.mysql.com/downloads/mysql/)

### Step 1: Install Dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### Step 2: Database Setup

```bash
# Create database and tables
mysql -u root -p < server/database.sql
```

When prompted, enter your MySQL password.

### Step 3: Configure Environment

**Backend** - Edit `server/.env`:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=risapp_db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

**Frontend** - `.env` file already has correct API URL:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Run Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

### Step 5: Login

Visit http://localhost:3000

**Demo Credentials:**
- **HR:** hr@raminfosys.com / password123
- **Employee:** john@raminfosys.com / password123

---

## 📱 Features Overview

### Employee Dashboard
✅ Check-in with GPS location
✅ Check-out with GPS location
✅ View today's status
✅ Secure logout

### HR Dashboard
✅ View all employee attendance
✅ Filter by date range
✅ See GPS coordinates
✅ Download Excel reports

---

## 🔧 Troubleshooting

### "Cannot connect to database"
```bash
# Check if MySQL is running
mysql -u root -p -e "SELECT 1"
```

### Port already in use
```bash
# Change PORT in .env to different number (e.g., 5001)
```

### Location permission denied
- Allow location access when browser prompts
- Use HTTPS in production

### Login fails
```bash
# Check database has users
mysql -u root -p risapp_db -e "SELECT * FROM users;"
```

---

## 📦 Project Structure

```
RISAPP/
├── server/                 # Backend (Node.js/Express)
│   ├── routes/            # API endpoints
│   ├── middleware/        # JWT auth
│   ├── database.sql       # DB schema
│   └── server.js          # Main server
│
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── components/   # Page components
│   │   ├── api.js        # API client
│   │   └── App.js        # Main app
│   └── public/
│
├── README.md              # Full documentation
└── DEPLOYMENT.md          # Deployment guide
```

---

## 🌐 Deploy to Production

For free hosting, check [DEPLOYMENT.md](DEPLOYMENT.md):
- Railway.app (Backend)
- Vercel (Frontend)
- Render.com
- Replit

---

## 📝 Create New Employee

### Via MySQL:
```bash
mysql -u root -p risapp_db
```

```sql
INSERT INTO users (name, email, password, role) 
VALUES ('John Smith', 'john.smith@raminfosys.com', 
        '$2a$10$hashedpassword', 'employee');
```

### Password Hash Generator:
Use bcryptjs in Node:
```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('password123', 10).then(hash => console.log(hash));
```

---

## 🔒 Security Notes

⚠️ Before production:
1. Change JWT_SECRET to a random 32+ character string
2. Use strong MySQL password
3. Enable HTTPS
4. Update CORS settings for your domain

---

## 📞 Support

- Check README.md for detailed docs
- Review DEPLOYMENT.md for hosting
- Check backend logs: `npm run dev`
- Check frontend console: F12 → Console

---

**Happy Deployment! 🎉**
