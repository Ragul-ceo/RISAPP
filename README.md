# RAM Infosys Employee Attendance System

A comprehensive React web application for employee attendance management with check-in/check-out functionality, GPS location tracking, and HR dashboard analytics.

## Features

✅ **Role-Based Login System**
- Employee and HR accounts
- Secure JWT authentication
- Password hashing with bcryptjs

✅ **Employee Check-in/Check-out**
- Real-time geolocation tracking (latitude & longitude)
- Automatic timestamp recording
- Daily attendance status

✅ **HR Dashboard**
- Real-time attendance summary
- Detailed attendance records with filters
- Location coordinates tracking
- Excel export functionality

✅ **Database**
- MySQL database with proper schema
- Employee and attendance tables
- Indexes for optimal performance

## Tech Stack

**Backend:**
- Node.js with Express.js
- MySQL 8.0
- JWT Authentication
- ExcelJS for Excel generation

**Frontend:**
- React 18
- React Router v6
- Axios for API calls
- CSS3 with responsive design

## Project Structure

```
RISAPP/
├── server/
│   ├── routes/
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── attendance.js    # Check-in/check-out endpoints
│   │   └── dashboard.js     # HR dashboard endpoints
│   ├── middleware/
│   │   └── auth.js          # JWT verification
│   ├── server.js            # Main server file
│   ├── package.json         # Backend dependencies
│   ├── .env.example         # Environment variables template
│   └── database.sql         # Database schema
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Login.js       # Login page
    │   │   ├── CheckIn.js     # Employee check-in page
    │   │   ├── Dashboard.js   # HR dashboard
    │   │   └── PrivateRoute.js# Protected routes
    │   ├── api.js            # Axios instance
    │   ├── App.js            # Main app component
    │   └── index.js          # Entry point
    ├── public/
    │   └── index.html        # HTML template
    ├── package.json          # Frontend dependencies
    └── .env.example          # Environment variables
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MySQL Server (v8.0+)
- npm or yarn

### Step 1: Clone and Setup Backend

```bash
cd server
npm install
```

Create `.env` file from `.env.example`:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=risapp_db
JWT_SECRET=your_jwt_secret_key_change_this
NODE_ENV=development
```

### Step 2: Setup MySQL Database

```bash
mysql -u root -p < database.sql
```

Or manually:
1. Create database: `CREATE DATABASE risapp_db;`
2. Import the schema from `database.sql`

### Step 3: Setup Frontend

```bash
cd client
npm install
```

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Run Application

**Backend:**
```bash
cd server
npm start
# Or development mode with auto-reload
npm run dev
```

**Frontend (in new terminal):**
```bash
cd client
npm start
```

The application will open at `http://localhost:3000`

## Demo Credentials

**HR Account:**
- Email: hr@raminfosys.com
- Password: password123

**Employee Account:**
- Email: john@raminfosys.com
- Password: password123

## Deployment to Free Server

### Option 1: Railway.app (Recommended)

**Backend Deployment:**
1. Sign up at https://railway.app
2. Connect GitHub repository
3. Create new project from repo
4. Add environment variables in Railway dashboard
5. Deploy

**Frontend Deployment:**
1. In Vercel (https://vercel.com)
2. Import frontend repository
3. Set `REACT_APP_API_URL` to Railway backend URL
4. Deploy

### Option 2: Render.com

**Backend:**
1. Sign up at https://render.com
2. Create new Web Service
3. Connect GitHub
4. Set environment variables
5. Deploy

**Frontend:**
- Use Vercel or Netlify for free frontend hosting

### Option 3: Heroku (Limited Free Tier)

**Backend:**
```bash
heroku login
heroku create your-app-name
git push heroku main
heroku config:set DB_HOST=your_db_host
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Attendance
- `POST /api/attendance/checkin` - Check-in with location
- `POST /api/attendance/checkout` - Check-out with location
- `GET /api/attendance/status` - Get today's status

### Dashboard (HR Only)
- `GET /api/dashboard/summary` - Summary statistics
- `GET /api/dashboard/attendance` - Get attendance records
- `POST /api/dashboard/export` - Export to Excel

## Security Features

✅ Password hashing with bcryptjs (10 salt rounds)
✅ JWT token-based authentication
✅ Role-based access control
✅ Token expiration (24 hours)
✅ Protected API endpoints
✅ CORS enabled

## Database Schema

### users table
```sql
id - Primary Key
name - Employee/HR name
email - Unique email
password - Hashed password
role - enum('employee', 'hr', 'admin')
created_at - Timestamp
updated_at - Timestamp
```

### attendance table
```sql
id - Primary Key
user_id - Foreign Key to users
check_in_time - Timestamp
check_in_latitude - Decimal
check_in_longitude - Decimal
check_out_time - Nullable Timestamp
check_out_latitude - Nullable Decimal
check_out_longitude - Nullable Decimal
created_at - Timestamp
```

## Features in Detail

### Employee Features
- Secure login with email/password
- One-click check-in with GPS location
- One-click check-out with GPS location
- View today's check-in/check-out status
- Location coordinates stored for audit trail

### HR Features
- Dashboard with real-time statistics
- Filter attendance by date range
- View all employee attendance records
- See GPS coordinates for verification
- Export attendance data to Excel with all details
- Search and view employee information

## Future Enhancements

- Mobile app (React Native)
- QR code check-in
- Biometric authentication
- Attendance reports (PDF)
- Email notifications
- Geofencing validation
- Leave management
- Shift scheduling

## Troubleshooting

**Connection refused error:**
- Ensure MySQL is running
- Check database credentials in .env

**CORS error:**
- Verify API_URL in frontend .env
- Check backend CORS configuration

**Location access denied:**
- Enable location permissions in browser
- Use HTTPS for production (required for geolocation)

**Login issues:**
- Clear browser localStorage
- Check JWT_SECRET in backend .env
- Verify user exists in database

## License

MIT License - Feel free to use and modify

## Support

For issues or questions, create an issue or contact the development team.
