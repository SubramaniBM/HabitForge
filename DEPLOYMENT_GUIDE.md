# 🚀 Deployment Guide - HabitForge

## Deploy to the Cloud (Free Options)

This guide shows you how to deploy HabitForge online so **anyone can access it via a URL** without installing anything.

---

## 🌟 **Recommended: Free Deployment Stack**

### **Backend + Database:**
- **Render.com** (Free tier) - For Node.js backend
- **MongoDB Atlas** (Free tier) - For database

### **Frontend:**
- **Vercel** or **Netlify** (Free tier) - For React frontend

**Total Cost: $0** ✅

---

## 📋 **Step-by-Step Deployment**

### **Part 1: Deploy Database (MongoDB Atlas)**

#### 1. Create MongoDB Atlas Account
- Go to https://www.mongodb.com/cloud/atlas
- Click "Try Free"
- Sign up with email or Google

#### 2. Create a Free Cluster
- Choose **M0 (Free tier)**
- Select a region close to you
- Click "Create Cluster" (takes 3-5 minutes)

#### 3. Setup Database Access
- Go to "Database Access" → Click "Add New Database User"
- Username: `habitforge_admin`
- Password: Create a strong password (save it!)
- Database User Privileges: "Read and write to any database"
- Click "Add User"

#### 4. Setup Network Access
- Go to "Network Access" → Click "Add IP Address"
- Click "Allow Access from Anywhere" (0.0.0.0/0)
- Click "Confirm"

#### 5. Get Connection String
- Go to "Database" → Click "Connect"
- Choose "Connect your application"
- Copy the connection string:
  ```
  mongodb+srv://habitforge_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```
- Replace `<password>` with your actual password
- Save this string - you'll need it!

---

### **Part 2: Deploy Backend (Render.com)**

#### 1. Prepare Your Code
First, push your code to GitHub (see GitHub setup below)

#### 2. Create Render Account
- Go to https://render.com
- Sign up with GitHub

#### 3. Create New Web Service
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Select "habitforge" repo

#### 4. Configure Service
```
Name: habitforge-backend
Root Directory: backend
Environment: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

#### 5. Add Environment Variables
Click "Advanced" → "Add Environment Variable":

```
PORT=5000
MONGODB_URI=mongodb+srv://habitforge_admin:yourpassword@cluster0.xxxxx.mongodb.net/habitforge?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_random_string_change_this_xyz123
NODE_ENV=production
```

**Important:** Replace with your actual MongoDB connection string!

#### 6. Deploy
- Click "Create Web Service"
- Wait 5-10 minutes for deployment
- You'll get a URL like: `https://habitforge-backend.onrender.com`
- Save this URL!

#### 7. Test Backend
Visit: `https://habitforge-backend.onrender.com/api/health`
You should see: `{"status":"OK","message":"HabitForge API is running"}`

---

### **Part 3: Deploy Frontend (Vercel)**

#### 1. Update Frontend API URL
Edit `frontend/.env`:
```env
REACT_APP_API_URL=https://habitforge-backend.onrender.com/api
```

Commit and push this change to GitHub.

#### 2. Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub

#### 3. Import Project
- Click "Add New..." → "Project"
- Import your GitHub repository
- Select "habitforge"

#### 4. Configure Project
```
Framework Preset: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

#### 5. Add Environment Variable
- Click "Environment Variables"
- Add:
  ```
  REACT_APP_API_URL = https://habitforge-backend.onrender.com/api
  ```

#### 6. Deploy
- Click "Deploy"
- Wait 3-5 minutes
- You'll get a URL like: `https://habitforge.vercel.app`
- **This is your public URL!** 🎉

---

## 🎉 **Your App is Live!**

### **Share These URLs:**
```
Frontend (User Access): https://habitforge.vercel.app
Backend API: https://habitforge-backend.onrender.com/api
```

Anyone can now:
1. Visit your frontend URL
2. Create an account
3. Start using HabitForge!

---

## 📋 **Alternative: Deploy Frontend to Netlify**

If you prefer Netlify over Vercel:

#### 1. Create Netlify Account
- Go to https://www.netlify.com
- Sign up with GitHub

#### 2. Deploy
- Click "Add new site" → "Import an existing project"
- Connect to GitHub
- Select your repository

#### 3. Configure
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/build
```

#### 4. Environment Variables
- Go to "Site settings" → "Environment variables"
- Add:
  ```
  REACT_APP_API_URL = https://habitforge-backend.onrender.com/api
  ```

#### 5. Deploy
- Click "Deploy site"
- You'll get: `https://your-site-name.netlify.app`

---

## 🔧 **Important Notes**

### **Free Tier Limitations:**

**Render.com Free Tier:**
- ⚠️ **Sleeps after 15 minutes of inactivity**
- First request after sleep takes 30-60 seconds to wake up
- Solution: Use a service like UptimeRobot to ping it every 14 minutes

**MongoDB Atlas Free Tier:**
- 512 MB storage (plenty for starting)
- Shared cluster (slower than paid)

**Vercel/Netlify Free Tier:**
- Unlimited bandwidth
- No sleep time
- Fast global CDN

### **To Prevent Backend Sleep:**

Use **UptimeRobot** (free):
1. Go to https://uptimerobot.com
2. Create account
3. Add New Monitor:
   - Type: HTTP(s)
   - URL: `https://habitforge-backend.onrender.com/api/health`
   - Monitoring Interval: 5 minutes
4. Your backend stays awake! 🎉

---

## 🔒 **Security for Production**

Before deploying, update:

### **Backend (`backend/.env`):**
```env
JWT_SECRET=generate_a_very_long_random_secure_string_here_minimum_32_characters
NODE_ENV=production
```

Generate secure JWT_SECRET:
```bash
# In terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **CORS Settings** 
Update `backend/server.js` to only allow your frontend:
```javascript
app.use(cors({
  origin: 'https://habitforge.vercel.app'
}));
```

---

## 📊 **Deployment Checklist**

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Backend deployed to Render
- [ ] Environment variables set on Render
- [ ] Backend URL working (test /api/health)
- [ ] Frontend .env updated with backend URL
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Frontend environment variable set
- [ ] Test registration on live site
- [ ] Test creating habits
- [ ] Test creating/joining squads
- [ ] UptimeRobot setup (optional but recommended)

---

## 🐛 **Troubleshooting**

### **"Cannot connect to backend"**
- Check backend URL in frontend `.env`
- Test backend directly: `https://your-backend.onrender.com/api/health`
- Check Render logs for errors

### **"MongoDB connection failed"**
- Verify connection string in Render environment variables
- Check MongoDB Atlas user password
- Ensure network access allows 0.0.0.0/0

### **"JWT invalid"**
- Clear browser localStorage
- Check JWT_SECRET is same in Render env vars

### **Backend is slow**
- Free tier sleeps after 15 minutes
- First request wakes it up (takes 30-60s)
- Use UptimeRobot to keep it awake

---

## 💰 **Upgrade Options (Optional)**

If you get lots of users:

**Render:**
- Starter plan: $7/month (no sleep, faster)

**MongoDB Atlas:**
- M10 plan: $10/month (dedicated cluster, faster)

**Vercel/Netlify:**
- Pro plans: $20/month (more features, support)

---

## 🎯 **Custom Domain (Optional)**

Want your own domain like `habitforge.com`?

1. Buy domain from Namecheap/Google Domains (~$10/year)
2. Add to Vercel/Netlify in settings
3. Update DNS records (they'll guide you)
4. Your site: `https://habitforge.com` ✨

---

## 📱 **Share Your App**

Once deployed, share:
```
🔥 Check out HabitForge - Build Better Habits Together!
https://habitforge.vercel.app

- Track habits with gamification
- Join squads for accountability  
- Earn points, levels, and badges
- Compete on leaderboards
- 100% free to use!
```

---

## 🎓 **For Your College Project**

Include in your presentation:
- ✅ "Deployed to production on Render + Vercel"
- ✅ "Using MongoDB Atlas cloud database"
- ✅ "Accessible worldwide via HTTPS"
- ✅ Show the live URL
- ✅ Demo on actual deployed site (not localhost)

**Bonus points for going beyond requirements!** 🌟

---

**Your app is production-ready and shareable!** 🚀

Need help? Check Render/Vercel/MongoDB Atlas documentation or Discord communities.
