# 🚀 Free Hosting Setup Guide

Choose one option below to deploy your RAM Infosys Attendance System for FREE!

---

## Option 1: Railway.app + Vercel (RECOMMENDED) ⭐

### Why Railway + Vercel?
- ✅ Simple deployment
- ✅ Automatic scaling
- ✅ Free database option
- ✅ Perfect for startups

### Step 1: Deploy Backend on Railway.app

1. **Sign up**: https://railway.app (use GitHub login)

2. **Create Project**:
   - Click "Create Project"
   - Select "Deploy from GitHub"
   - Connect your GitHub account
   - Select your RISAPP repository

3. **Configure Backend**:
   - Click "Add Service" → "GitHub Repo"
   - Select your repo
   - Root directory: `/server`
   - Build command: `npm install`
   - Start command: `npm start`

4. **Add Environment Variables** (Railway Dashboard):
   ```
   PORT=3001
   DB_HOST=your-railway-mysql-host
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=risapp_db
   JWT_SECRET=your_super_secret_key_here_min_32_chars
   NODE_ENV=production
   ```

5. **Add MySQL Database**:
   - Click "Add" → Select "MySQL"
   - Railway will provide connection string
   - Import `server/database.sql`

6. **Deploy**: Railway automatically deploys when you push to GitHub

7. **Copy Backend URL**: You'll see `https://your-app.up.railway.app`

---

### Step 2: Deploy Frontend on Vercel

1. **Sign up**: https://vercel.com (GitHub login)

2. **Import Project**:
   - Click "Add New" → "Project"
   - Select your GitHub repo
   - Root directory: `client`

3. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-app.up.railway.app/api
   ```

4. **Deploy**: Click "Deploy"

5. **Your app is live!** 🎉

Access: `https://your-app.vercel.app`

---

## Option 2: Render.com (Full Stack) 🔧

### Backend on Render

1. **Sign up**: https://render.com

2. **Create Web Service**:
   - Click "New Web Service"
   - Connect GitHub
   - Select repo
   - Build command: `cd server && npm install`
   - Start command: `npm start`
   - Plan: Free

3. **Add Database**:
   - Create MySQL database
   - Get connection details
   - Add to environment variables

4. **Environment Variables**:
   ```
   PORT=3000
   DB_HOST=...
   DB_USER=...
   DB_PASSWORD=...
   DB_NAME=risapp_db
   JWT_SECRET=your_secret_key
   NODE_ENV=production
   ```

### Frontend on Render

1. **Create Static Site**:
   - Click "New Static Site"
   - Connect GitHub
   - Build command: `cd client && npm run build`
   - Publish directory: `client/build`

2. **Add Env Variable**:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com/api
   ```

---

## Option 3: Replit (Simplest) 🎯

### One-Click Setup

1. **Visit**: https://replit.com

2. **Create New**:
   - Click "Create"
   - Import from GitHub
   - Select your repo

3. **Create .env file**:
   ```bash
   echo "DB_HOST=localhost" > .env
   echo "DB_USER=root" >> .env
   echo "DB_PASSWORD=root" >> .env
   echo "DB_NAME=risapp_db" >> .env
   echo "JWT_SECRET=your_secret_key" >> .env
   echo "PORT=3000" >> .env
   echo "NODE_ENV=production" >> .env
   echo "REACT_APP_API_URL=https://$(replit.dev)/api" >> .env
   ```

4. **Run Backend**:
   ```bash
   cd server && npm install && npm start
   ```

5. **In Another Tab - Run Frontend**:
   ```bash
   cd client && npm install && npm start
   ```

6. **Share**: Replit gives you a public URL instantly!

---

## Option 4: AWS Free Tier (12 Months) 💼

### EC2 Instance Setup

1. **Create EC2 Instance**:
   - Sign up: https://aws.amazon.com
   - EC2 Dashboard → Launch Instance
   - Ubuntu 22.04 LTS
   - t3.micro (free tier eligible)
   - Create security group (open ports 3000, 5000)

2. **SSH into Instance**:
   ```bash
   ssh -i your-key.pem ec2-user@your-instance-ip
   ```

3. **Install Software**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install MySQL
   sudo apt install -y mysql-server

   # Install Git
   sudo apt install -y git

   # Install PM2 (process manager)
   sudo npm install -g pm2
   ```

4. **Clone Repository**:
   ```bash
   git clone https://github.com/your-username/RISAPP.git
   cd RISAPP
   ```

5. **Setup Backend**:
   ```bash
   cd server
   npm install
   
   # Create .env
   cat > .env << EOF
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=risapp_db
   JWT_SECRET=your_secret_key
   NODE_ENV=production
   EOF

   # Setup database
   sudo mysql -u root < database.sql

   # Start with PM2
   pm2 start server.js --name "risapp-backend"
   ```

6. **Setup Frontend**:
   ```bash
   cd ../client
   npm install
   npm run build

   # Serve with PM2
   pm2 serve build 3000 --name "risapp-frontend"
   ```

7. **Make PM2 persistent**:
   ```bash
   pm2 save
   sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup
   ```

8. **Access Your App**:
   ```
   http://your-instance-ip:3000
   ```

---

## Option 5: DigitalOcean App Platform ($5/month)

1. **Sign up**: https://digitalocean.com

2. **Create App**:
   - Apps → Create App
   - Connect GitHub
   - Select repo

3. **Add Services**:
   - Backend (Node.js) - `/server`
   - Frontend (Static) - `/client`
   - Database (MySQL)

4. **Configure & Deploy**

---

## Option 6: Heroku (Limited Free Tier)

1. **Sign up**: https://heroku.com

2. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   heroku login
   ```

3. **Create App**:
   ```bash
   heroku create your-app-name
   ```

4. **Add MySQL Add-on**:
   ```bash
   heroku addons:create jawsdb:kitefin
   ```

5. **Set Environment Variables**:
   ```bash
   heroku config:set JWT_SECRET=your_secret_key
   ```

6. **Deploy**:
   ```bash
   git push heroku main
   ```

---

## 📊 Free Hosting Comparison

| Platform | Backend | Frontend | Database | Cost | Startup |
|----------|---------|----------|----------|------|---------|
| Railway | ✅ $5-10 | - | ✅ Free | ~$10 | Fast |
| Vercel | - | ✅ Free | - | Free | Fast |
| Render | ✅ Free | ✅ Free | ✅ Free | Free | 3-5 min |
| Replit | ✅ Free | ✅ Free | Local | Free | 2 min |
| AWS | ✅ Free* | ✅ Free* | ✅ Free* | Free* | 10 min |
| DigitalOcean | ✅ $5 | ✅ Free | ✅ $5 | $10 | 5 min |
| Heroku | Free* | Free* | Free* | $0* | 5 min |

*Free tier with limitations

---

## 🎯 Recommended Setup for Beginners

```
✅ Frontend: Vercel (Free, fast, easiest)
✅ Backend: Railway.app ($5-10/month, reliable)
✅ Database: Railway MySQL (included)
✅ Total Cost: ~$5-10/month
✅ Deployment Time: 15-20 minutes
```

---

## 🔄 GitHub Push to Auto-Deploy

After first setup, just push to GitHub:

```bash
git add .
git commit -m "updates"
git push origin main
```

All platforms automatically redeploy on push! ✅

---

## 🔐 Production Checklist

Before going live:

- [ ] Change JWT_SECRET to random 32+ char string
- [ ] Use strong database password
- [ ] Enable HTTPS (automatic with Vercel/Railway)
- [ ] Update CORS settings for your domain
- [ ] Test all features
- [ ] Setup monitoring/logging
- [ ] Create database backups
- [ ] Update frontend API URL

---

## 📞 Common Issues

### "Cannot connect to database in production"
```bash
# Check your DB_HOST - use the full hostname provided by hosting
# Example: mysql-1234.railway.internal
```

### "CORS error in production"
```bash
# Update REACT_APP_API_URL to your actual backend URL
# Don't use localhost in production!
```

### "502 Bad Gateway"
- Backend crashed or not running
- Check logs in hosting dashboard
- Verify environment variables are set

### "Frontend shows blank page"
- Build command incorrect
- API URL environment variable not set
- Check browser console for errors

---

## ✅ Testing Your Deployment

```bash
# Test backend
curl https://your-backend-url/health

# Test login
curl -X POST https://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@raminfosys.com","password":"password123"}'

# Test frontend
Visit https://your-frontend-url
```

---

## 🚀 Deploy Now!

Choose your platform above and follow the steps. Your app will be live in minutes!

**Recommended**: Railway.app + Vercel combo ⭐

Happy Deploying! 🎉
