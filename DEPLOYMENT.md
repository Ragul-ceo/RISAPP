# Deployment Guide - RAM Infosys Attendance System

## Quick Start - Local Development

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Configure Environment Variables

**Backend (.env):**
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=risapp_db
JWT_SECRET=your_super_secret_key_12345
NODE_ENV=development
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Setup Database

```bash
mysql -u root -p < server/database.sql
```

### 4. Run Application

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

Visit http://localhost:3000

---

## Docker Deployment (Local)

```bash
docker-compose up -d
```

Access: http://localhost:3000

---

## Production Deployment on Free Servers

### Option 1: Railway.app + Vercel (RECOMMENDED)

#### Backend on Railway.app:

1. Sign up at https://railway.app
2. Create new project
3. Connect GitHub repository
4. Select `/server` as root directory
5. Add environment variables:
   - `PORT=3001`
   - `DB_HOST=your_mysql_host`
   - `DB_USER=root`
   - `DB_PASSWORD=your_password`
   - `DB_NAME=risapp_db`
   - `JWT_SECRET=generate_strong_secret`
6. Deploy

#### Frontend on Vercel:

1. Sign up at https://vercel.com
2. Import GitHub repo
3. Select `/client` root directory
4. Environment variables:
   - `REACT_APP_API_URL=https://your-railway-app.up.railway.app/api`
5. Deploy

#### Database on Railway.app:

1. Add MySQL service to Railway project
2. Use Railway MySQL credentials in backend

---

### Option 2: Render.com (Full Stack)

#### Backend on Render:

1. Sign up at https://render.com
2. Create Web Service
3. Connect GitHub
4. Build command: `npm install`
5. Start command: `npm start`
6. Set environment variables
7. Deploy

#### Frontend on Render:

1. Create Static Site
2. Build command: `cd client && npm run build`
3. Publish directory: `client/build`
4. Set environment variables
5. Deploy

#### Database Setup:

1. Use Railway MySQL or AWS RDS free tier
2. Update DB credentials in Render

---

### Option 3: Replit (Simple Single Deployment)

1. Create new Replit project
2. Import from GitHub
3. Create `.env` file with credentials
4. Run backend: `cd server && npm install && npm start`
5. In another tab run frontend or use proxy
6. Get public URL from Replit

---

### Option 4: AWS Free Tier

**EC2 Instance:**
```bash
# SSH into instance
ssh -i key.pem ec2-user@public-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt-get install mysql-server

# Clone project
git clone your-repo-url

# Install PM2 for process management
sudo npm install -g pm2

# Start backend
cd server
npm install
pm2 start server.js --name "risapp-backend"

# Start frontend (build)
cd ../client
npm run build
pm2 serve build 3000 --name "risapp-frontend"

# Save PM2 config
pm2 save
```

**RDS for MySQL:**
1. Create RDS MySQL instance (free tier eligible)
2. Update database credentials in backend
3. Use RDS endpoint as DB_HOST

---

## Environment Variables Checklist

### Backend Requirements:
- [ ] PORT (default: 5000)
- [ ] DB_HOST (MySQL server address)
- [ ] DB_USER (MySQL username)
- [ ] DB_PASSWORD (MySQL password)
- [ ] DB_NAME (Database name)
- [ ] JWT_SECRET (Random string, 32+ chars)
- [ ] NODE_ENV (development/production)

### Frontend Requirements:
- [ ] REACT_APP_API_URL (Backend API URL)

---

## Testing Deployment

After deployment, test with:

```bash
# Test backend
curl https://your-backend-url/health

# Login test
curl -X POST https://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@raminfosys.com","password":"password123"}'
```

---

## Database Backup & Restore

```bash
# Backup
mysqldump -u root -p risapp_db > backup.sql

# Restore
mysql -u root -p risapp_db < backup.sql
```

---

## Scaling Tips

1. Add database indexes for large datasets
2. Implement caching (Redis)
3. Use CDN for frontend assets
4. Load balancing with multiple backend instances
5. Database optimization and query caching

---

## Monitoring & Logging

- Use PM2 logs: `pm2 logs`
- Check application errors: `pm2 show risapp-backend`
- Database monitoring: MySQL slow query log
- Frontend errors: Browser console & Sentry

---

## SSL/HTTPS Setup

For production, enable SSL:

```bash
# Using Let's Encrypt on Linux
sudo certbot certonly --standalone -d yourdomain.com

# Update backend to use SSL
const https = require('https');
const fs = require('fs');

https.createServer({
  key: fs.readFileSync('/path/to/key.pem'),
  cert: fs.readFileSync('/path/to/cert.pem')
}, app).listen(443);
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS Error | Update `REACT_APP_API_URL` in frontend |
| Database Connection Failed | Check DB credentials and network access |
| 404 on Frontend | Build frontend: `npm run build` |
| Location Permission Denied | HTTPS required for geolocation in production |
| Token Expired | Check JWT_SECRET matches both environments |

---

## Cost Breakdown (Free Tier)

- Railway: $5/month after free credits
- Vercel: Free tier included
- Render: Free tier included
- Replit: Free tier included
- AWS: Free for 12 months
- Total: $0-5/month

---

## Next Steps

1. ✅ Test locally
2. ✅ Setup database
3. ✅ Deploy backend
4. ✅ Deploy frontend
5. ✅ Configure environment variables
6. ✅ Test all features
7. ✅ Setup monitoring
8. ✅ Backup strategy

---

For questions or issues, check the main README.md file.
