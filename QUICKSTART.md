# 🚀 Quick Start Guide - HabitForge

## Prerequisites Checklist
- [ ] Node.js installed (v14+)
- [ ] MongoDB installed and running
- [ ] Git Bash or Command Prompt available

## Step-by-Step Setup (5 minutes)

### 1️⃣ Run the Setup Script
```bash
# Double-click setup.bat OR run in command prompt:
setup.bat
```
This will:
- Install all backend dependencies
- Install all frontend dependencies
- Create .env files from templates

### 2️⃣ Configure Backend Environment
Edit `backend\.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/habitforge
JWT_SECRET=change_this_to_a_random_secret_key_12345
NODE_ENV=development
```
**Important:** Change the JWT_SECRET to something unique!

### 3️⃣ Start MongoDB
```bash
# Windows - If installed as service:
net start MongoDB

# OR run mongod directly:
mongod
```

### 4️⃣ Start the Backend
```bash
# Option 1: Use the batch file (recommended)
start-backend.bat

# Option 2: Manual
cd backend
npm run dev
```
✅ Backend should be running on http://localhost:5000

### 5️⃣ Start the Frontend (New Terminal)
```bash
# Option 1: Use the batch file (recommended)
start-frontend.bat

# Option 2: Manual
cd frontend
npm start
```
✅ Frontend should open automatically at http://localhost:3000

---

## 🎯 First Time Usage

### Create Your Account
1. Click "Sign Up" on the landing page
2. Enter username, email, and password
3. You'll be redirected to your dashboard

### Create Your First Habit
1. Click "New Habit" on dashboard
2. Choose a category (e.g., Fitness, Learning)
3. Add title: "Morning workout" or "Read 30 minutes"
4. Click "Create Habit"

### Join a Squad
1. Go to "Find Squads" in navigation
2. Browse public squads
3. Click "Join Squad" on one you like
4. View squad dashboard to see leaderboard and activity feed

### Complete a Habit
1. On your dashboard, find a habit
2. Click "Mark Complete"
3. Earn points and build your streak! 🔥
4. Check your squad's activity feed to see your achievement

---

## 📱 Application Tour

### 🏠 Landing Page (/)
- Learn about HabitForge features
- Beautiful hero section with animations
- Call-to-action to sign up

### 🔐 Authentication (/login, /register)
- Secure JWT-based authentication
- Form validation
- Auto-redirect on success

### 📊 Dashboard (/dashboard)
- View all your habits
- Quick stats (level, points, streaks)
- Your squads at a glance
- Create new habits

### 👥 Squad Dashboard (/squads/:id)
- Leaderboard rankings
- Live activity feed
- Weekly team goal progress
- Cheer system

### 🔍 Squad Discovery (/squads/find)
- Browse public squads
- Search and filter
- Create your own squad
- Join instantly

### 👤 Profile (/profile/:id)
- User level and points
- Badges and achievements
- Squads membership
- Public profile view

### ℹ️ About Page (/about)
- Mission and values
- How it works
- Technology stack
- Team information

---

## 🎮 Gamification Features

### Points System
- **Base Points:** 10 points per habit completion
- **Streak Bonus:** +2 points per streak day (max 50)
- **Example:** 7-day streak = 10 + 14 = 24 points per completion

### Levels
- Level up every 100 points
- Level 1: 0-99 points
- Level 2: 100-199 points
- And so on...

### Streaks
- Complete habits daily to build streaks
- Track current streak and longest streak
- Milestone celebrations at 7, 14, 30+ days

### Squad Goals
- Weekly team point targets
- Collaborative achievement
- Progress tracking
- Reset every week

---

## 🔧 Troubleshooting

### "Cannot connect to backend"
**Solution:**
- Check backend is running (http://localhost:5000)
- Verify REACT_APP_API_URL in frontend\.env
- Check browser console for errors

### "MongoDB connection failed"
**Solution:**
- Ensure MongoDB is running: `net start MongoDB`
- Check MONGODB_URI in backend\.env
- Default: `mongodb://localhost:27017/habitforge`

### "Dependencies not installed"
**Solution:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### "Port already in use"
**Solution:**
- Backend: Change PORT in backend\.env
- Frontend: Will prompt to use different port automatically

### "Token invalid" errors
**Solution:**
- Clear browser localStorage
- Log out and log in again
- Check JWT_SECRET is set in backend\.env

---

## 💡 Pro Tips

### For Development
1. **Keep both terminals open** - one for backend, one for frontend
2. **Check terminal logs** - errors appear there first
3. **Use browser DevTools** - Network tab shows API calls
4. **MongoDB Compass** - Great for viewing database visually

### For Testing
1. **Create test accounts** - Try different user scenarios
2. **Create multiple squads** - Test squad features
3. **Test with friends** - Real social interaction is fun!
4. **Try different habits** - Various categories and frequencies

### For Presenting
1. **Prepare demo data** - Have habits and squads ready
2. **Show mobile view** - Responsive design in action
3. **Demonstrate flow** - Registration → Habit → Squad → Profile
4. **Highlight features** - Gamification, social, real-time

---

## 📚 API Testing

### Using Browser or Postman

**Register a user:**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Login:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```
Copy the token from response!

**Get habits (with auth):**
```http
GET http://localhost:5000/api/habits
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🎨 Customization Ideas

### Easy Changes
1. **Colors:** Update CSS variables in `index.css`
2. **Icons:** Change emojis in components
3. **Categories:** Add more in CreateHabitModal
4. **Points:** Modify in Habit model complete method

### Advanced Features
1. Add streak recovery (1-day grace period)
2. Implement badge auto-awarding
3. Add habit templates
4. Create data visualization charts
5. Email notifications
6. Habit reminders

---

## 📦 Project Structure Summary

```
📁 Backend (Node.js + Express)
   ├── Models (MongoDB schemas)
   ├── Routes (API endpoints)
   ├── Middleware (Auth, validation)
   └── server.js (Main entry)

📁 Frontend (React)
   ├── Components (Reusable UI)
   ├── Pages (8 main pages)
   ├── Context (Auth state)
   ├── Services (API calls)
   └── Styling (CSS modules)
```

---

## ✅ Checklist Before Presenting

- [ ] MongoDB is running
- [ ] Backend server is running (port 5000)
- [ ] Frontend is running (port 3000)
- [ ] At least 2 test accounts created
- [ ] Multiple habits created
- [ ] Joined or created at least 1 squad
- [ ] Some habits completed (to show points/streaks)
- [ ] Tested all 8 pages
- [ ] Responsive design tested (resize browser)
- [ ] No console errors

---

## 🎯 Demo Script

1. **Landing page** - Show features and design (30 sec)
2. **Register** - Create account quickly (30 sec)
3. **Dashboard** - Create 2-3 habits (1 min)
4. **Complete habit** - Show points/streak (30 sec)
5. **Squad discovery** - Find and join squad (30 sec)
6. **Squad dashboard** - Show leaderboard, feed (1 min)
7. **Profile** - Show level, badges (30 sec)
8. **About** - Explain mission (30 sec)

**Total: ~5 minutes**

---

## 🚀 Ready to Start?

1. Run `setup.bat`
2. Configure `backend\.env`
3. Start MongoDB
4. Run `start-backend.bat`
5. Run `start-frontend.bat`
6. Open http://localhost:3000
7. Create account and start building habits! 🔥

---

**Questions? Check README.md for detailed documentation!**

*Happy Habit Building! 💪*
