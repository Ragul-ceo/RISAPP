#!/bin/bash

# RAM Infosys Attendance System - Setup Script

echo "🚀 RAM Infosys Attendance System Setup"
echo "======================================"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check MySQL
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not installed. Please install MySQL Server."
fi

# Backend setup
echo ""
echo "📦 Installing Backend Dependencies..."
cd server
npm install
cp .env.example .env
echo "✅ Backend setup complete"

# Frontend setup
echo ""
echo "📦 Installing Frontend Dependencies..."
cd ../client
npm install
cp .env.example .env
echo "✅ Frontend setup complete"

echo ""
echo "⚙️  Next Steps:"
echo "1. Update server/.env with your MySQL credentials"
echo "2. Update client/.env with API URL"
echo "3. Run: mysql -u root -p < server/database.sql"
echo "4. Run backend: cd server && npm run dev"
echo "5. Run frontend: cd client && npm start"
echo ""
echo "🎉 Setup complete!"
