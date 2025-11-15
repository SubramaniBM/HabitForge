# HabitForge - A Gamified Social Habit Tracker

<div align="center">
  <h3>🔥 Build Better Habits Together 🔥</h3>
  <p>Turn your goals into achievements with gamification and social accountability</p>
</div>

---

## 📖 Project Description

HabitForge is a full-stack web application designed to make habit formation engaging and effective through **gamification** and **social accountability**. It tackles the main weakness of traditional habit trackers — lack of external motivation.

Users can track their personal habits and form small groups called **"Squads."** Within a Squad, members work together toward shared goals, view each other's progress through a live feed, and engage in friendly competition via leaderboards. Completing habits earns points and badges, helping users "level up," turning everyday goals into a collaborative and rewarding experience.

---

## ✨ Key Features

### 🎯 Personal Dashboard
- **Private habit tracking** with streak calendars and progress charts
- **Quick stats overview** showing your level, points, and achievements
- **One-click habit completion** with instant feedback

### 👥 Squad System
- **Create or join** private/public squads
- **Collaborative goals** - Weekly team targets foster teamwork
- **Live activity feed** - See what your squad members are achieving in real-time
- **Leaderboards** - Friendly competition keeps everyone engaged

### 🎮 Gamification Engine
- **Points & Levels** - Earn points for every habit completion
- **Streak Bonuses** - The longer your streak, the more points you earn
- **Badges & Achievements** - Unlock special rewards for milestones
- **Progress Tracking** - Visual representation of your journey

### 🏆 Social Features
- **Activity Feed** - Share your wins with your squad
- **Cheers System** - Celebrate each other's achievements
- **User Profiles** - Showcase your level, badges, and streaks
- **Squad Discovery** - Browse and join public squads

---

## 🛠️ Technology Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Icon library
- **CSS3** - Custom design system with modern styling
- **Google Fonts** - Clash Grotesk & Inter typography

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

---

## 📁 Project Structure

```
Webtech Project/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Habit.js
│   │   ├── Squad.js
│   │   └── Activity.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── habits.js
│   │   ├── squads.js
│   │   ├── users.js
│   │   └── activities.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── HabitCard.js
│   │   │   ├── CreateHabitModal.js
│   │   │   └── PrivateRoute.js
│   │   ├── pages/
│   │   │   ├── Landing.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── SquadDashboard.js
│   │   │   ├── SquadDiscovery.js
│   │   │   ├── Profile.js
│   │   │   └── About.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js

### Installation

#### 1. Clone or Navigate to the Project

```bash
cd "c:\Users\madap\Desktop\College\WebTech\Webtech Project"
```

#### 2. Set Up the Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env file with your settings
# Set MONGODB_URI, JWT_SECRET, and PORT
```

**Example `.env` file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/habitforge
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

#### 3. Set Up the Frontend

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env
```

**Example `.env` file:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Or run mongod directly
mongod
```

#### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
The React app will start on `http://localhost:3000`

---

## 🌐 Application Pages

1. **Landing Page** (`/`) - Overview of features and sign-up CTA
2. **Registration Page** (`/register`) - Create new accounts securely
3. **Login Page** (`/login`) - Secure login for returning users
4. **User Dashboard** (`/dashboard`) - Manage habits, streaks, and squads
5. **Squad Dashboard** (`/squads/:id`) - View leaderboard, activity feed, and team progress
6. **Squad Discovery** (`/squads/find`) - Browse and join public squads
7. **User Profile** (`/profile/:id`) - View badges, levels, and stats
8. **About Us** (`/about`) - Team and mission information

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Habits
- `GET /api/habits` - Get all user habits
- `POST /api/habits` - Create new habit
- `POST /api/habits/:id/complete` - Mark habit as complete
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `GET /api/habits/stats` - Get habit statistics

### Squads
- `GET /api/squads` - Get squads (public or user's)
- `GET /api/squads/:id` - Get squad details
- `POST /api/squads` - Create new squad
- `POST /api/squads/:id/join` - Join a squad
- `POST /api/squads/:id/leave` - Leave a squad
- `GET /api/squads/:id/leaderboard` - Get squad leaderboard
- `PUT /api/squads/:id` - Update squad (creator only)

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/search` - Search users

### Activities
- `GET /api/activities/squad/:squadId` - Get squad activity feed
- `GET /api/activities/user/:userId` - Get user activity feed
- `POST /api/activities/:id/cheer` - Add/remove cheer

---

## 🎮 How to Use

### 1. Create an Account
- Navigate to the registration page
- Enter username, email, and password
- You'll be automatically logged in

### 2. Set Up Your Habits
- Go to your dashboard
- Click "New Habit"
- Choose a category, add title and description
- Start tracking!

### 3. Complete Habits Daily
- Click "Mark Complete" on any habit
- Earn points and build your streak
- Watch your level increase!

### 4. Join or Create a Squad
- Browse public squads in "Find Squads"
- Join one that matches your interests
- Or create your own squad!

### 5. Engage with Your Squad
- View the activity feed
- Cheer on your squad members
- Compete on the leaderboard
- Work toward weekly team goals

---

## 🎨 Design Features

### Color Palette
- **Primary**: `#0d0f0d` (Dark)
- **Background**: `#f5f3e8` (Light Cream)
- **Card Background**: `#ffffff` (White)
- **Accent**: `#666666` (Gray)
- **Success**: `#22c55e` (Green)
- **Danger**: `#ef4444` (Red)
- **Warning**: `#f59e0b` (Orange)

### Visual Elements
- **Modern minimalist design** with clean lines
- **Rounded corners** (8px border-radius) for polished look
- **Subtle shadows** for depth and hierarchy
- **Smooth animations** and hover effects
- **Responsive design** for all screen sizes
- **Typography**: Clash Grotesk & Inter fonts
- **Icon system** using React Icons
- **Card-based layout** for content organization
- **Hover interactions** with lift effects on buttons

---

## 🔐 Security Features

- **Password hashing** with bcryptjs
- **JWT authentication** for secure sessions
- **Protected routes** on frontend
- **Authorization middleware** on backend
- **Input validation** with express-validator

---

## 📊 Database Schema

### User Model
- username, email, password (hashed)
- level, points
- badges array
- squads array (references)

### Habit Model
- title, description, category
- user reference
- currentStreak, longestStreak
- completions array with dates and points

### Squad Model
- name, description, icon
- creator reference
- members array with points
- weeklyGoal tracking
- isPublic, maxMembers

### Activity Model
- user, squad references
- type (habit_completed, level_up, etc.)
- description, metadata
- cheers array

---

## 🚧 Future Enhancements

- [ ] Dark mode toggle for accessibility
- [ ] Email notifications for squad activities
- [ ] Custom badge creation
- [ ] Habit templates and suggestions
- [ ] Advanced data visualization (charts and graphs)
- [ ] Mobile app version (React Native)
- [ ] Social sharing features
- [ ] Habit reminders and push notifications
- [ ] Premium features (custom themes, advanced stats)
- [ ] Calendar view for habit tracking
- [ ] Export progress reports (PDF/CSV)

---

## 👥 Contributors

- **Subramani B M**
- **Sujan S H**
- **Skanda M L**

This project was developed as part of the Web Technologies course.

---

## 🤝 Support

For questions or issues:
1. Check the troubleshooting section below
2. Review the code comments
3. Check MongoDB connection
4. Verify environment variables

---

## 🔧 Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check `.env` file exists and has correct values
- Verify port 5000 is not in use

### Frontend won't connect to backend
- Check `REACT_APP_API_URL` in frontend `.env`
- Ensure backend is running on correct port
- Check browser console for CORS errors

### Authentication issues
- Clear browser localStorage
- Check JWT_SECRET is set in backend `.env`
- Verify token format in API requests

---

<div align="center">
  <p>Made with ❤️ for habit builders everywhere</p>
  <p>🔥 <strong>HabitForge</strong> - Build Better Habits Together 🔥</p>
</div>
