# Railway Deployment Guide

## Prerequisites
- GitHub account with your RISAPP repository
- Railway.app account (https://railway.app)

## Step 1: Create PostgreSQL Database on Railway

1. Go to https://railway.app
2. Click **New Project**
3. Select **Provision PostgreSQL**
4. Wait for it to initialize (1-2 minutes)

## Step 2: Deploy Backend (Node.js)

1. In your Railway project, click **Add Service**
2. Select **GitHub Repo**
3. Connect and select `Ragul-ceo/RISAPP`
4. Set the following settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. Add Environment Variables:
   - `JWT_SECRET`: Set to your secret key (e.g., `your_jwt_secret_2024`)
   - `NODE_ENV`: `production`
   - Railway automatically provides `DATABASE_URL` from PostgreSQL

6. Deploy and wait for "Running" status

## Step 3: Run Database Initialization

1. In the backend service, go to **Deployments**  
2. Click the latest deployment
3. Open **Logs** tab
4. Run this command in the terminal:
   ```bash
   node init-db.js
   ```

This will create tables and a default HR user:
- Email: `hr@raminfosys.com`
- Password: `password123`

## Step 4: Deploy Frontend (React)

1. In your Railway project, click **Add Service**
2. Select **GitHub Repo**
3. Select `Ragul-ceo/RISAPP` again
4. Set the following:
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm install -g serve && serve -s build -l 3001`

5. Deploy and wait for "Running" status

## Step 5: Update API Endpoint

After both services are deployed:

1. Get your backend URL from Railway (looks like `risapp-backend-xxx.railway.app`)
2. Update [client/src/api.js](../client/src/api.js):
   ```javascript
   const API_URL = 'https://your-backend-url.railway.app/api';
   ```
3. Rebuild and redeploy the frontend

## Access Your Application

- **Frontend**: Get URL from your frontend service on Railway
- **Login**: Use `hr@raminfosys.com` / `password123`

## Troubleshooting

**Database connection errors:**
- Check DATABASE_URL is correct in backend variables
- Verify PostgreSQL service is running

**Frontend not connecting to backend:**
- Ensure CORS is enabled in backend
- Verify API_URL in client/src/api.js is correct
- Check that backend domain is accessible from frontend

**Default user not created:**
- Run `node init-db.js` again
- Check logs for errors

## Database Schema

Two tables are automatically created:
- `users`: Stores employee and HR account data
- `attendance`: Stores check-in/check-out records with GPS coordinates

See [init-db.js](./init-db.js) for the complete schema.
