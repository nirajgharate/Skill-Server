# ✅ Setup & Verification Checklist

## 🎯 Before You Start

### System Requirements:

- [ ] Node.js installed (v14+)
- [ ] npm or yarn package manager
- [ ] MongoDB running (local or Atlas)
- [ ] Two browser tabs available for testing
- [ ] Terminal for running commands

---

## 📦 Backend Setup

### 1. Install Dependencies

```bash
cd server
npm install cloudinary
```

- [ ] Cloudinary package installed
- [ ] No error messages
- [ ] node_modules/cloudinary exists

### 2. Environment Variables

Create/update `.env` file:

```env
# Database
MONGODB_URI=your_mongodb_connection
DB_NAME=skill_server

# Server
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=dhxt9swpg
CLOUDINARY_API_KEY=793951369521343
CLOUDINARY_API_SECRET=74gYsIAW4zF9p8sVdS4LhD_CHGA
```

Verification:

- [ ] All 11 variables set
- [ ] Cloudinary credentials added
- [ ] No quotes around values
- [ ] .env file saved

### 3. Start Backend Server

```bash
npm start
# or
npm run dev  # if using nodemon
```

Expected output:

```
✅ Connected to MongoDB
✅ Server running on port 5000
✅ Socket.io server initialized
```

Verification:

- [ ] No error messages
- [ ] Server starts without crashing
- [ ] "Socket.io server" message appears
- [ ] Can access http://localhost:5000

---

## 🎨 Frontend Setup

### 1. Dependencies Already Installed

```bash
cd client
# Socket.io client should already be in package.json
# If not: npm install socket.io-client
```

Verification:

- [ ] `socket.io-client` in package.json
- [ ] No errors on `npm install`

### 2. Start Frontend Server

```bash
npm run dev
# Should show: http://localhost:5173
```

Expected output:

```
✅ Local:   http://localhost:5173/
✅ ready in 200ms
```

Verification:

- [ ] App loads at localhost:5173
- [ ] No compilation errors
- [ ] Pages render without errors

---

## 🔌 Socket.io Connection

### 1. Check useSocket Hook Exists

```bash
# File should exist at:
client/src/hooks/useSocket.js
```

- [ ] File exists
- [ ] Has export default useSocket
- [ ] Has Socket.io initialization

### 2. Check Hook is Used

Verify in these files:

- [ ] `WorkerProfileEdit.jsx` imports useSocket
- [ ] `ProfileHeader.jsx` imports useSocket
- [ ] `ProfileInfo.jsx` imports useSocket
- [ ] `UserDashboard.jsx` imports useSocket
- [ ] `WorkerDashboard.jsx` imports useSocket

### 3. Verify Socket.io Server Integration

Check `server/index.js`:

```javascript
import { initializeSocketIO } from "./controllers/socketio.controller.js";

// After creating io server:
initializeSocketIO(io);
```

- [ ] Import statement present
- [ ] `initializeSocketIO(io)` called
- [ ] No duplicate Socket.io handlers

---

## 🧪 Test Connection

### Test 1: Browser Console Check

1. Open browser (Chrome/Firefox)
2. Press F12 (DevTools)
3. Go to Console tab
4. Navigate to any page
5. Look for messages:

Expected:

```
🟢 Socket.io connected: socket_abc123xyz
✅ User registered: {userId, socketId}
```

Verification:

- [ ] "Socket.io connected" message appears
- [ ] No error messages
- [ ] Can see socket ID

### Test 2: Network Check

1. Press F12 (DevTools)
2. Go to Network tab
3. Filter by "WS" (WebSocket)
4. Refresh page
5. Look for Socket.io connection

Expected:

```
io/?transport=websocket  →  101 Switching Protocols
```

Verification:

- [ ] WebSocket connection appears
- [ ] Status is 101
- [ ] Connection stays open (not red X)

### Test 3: Application Storage

1. Press F12 (DevTools)
2. Go to Application tab
3. Click Local Storage
4. Look for `skillserverUser` key

Expected:

```json
{
  "_id": "user_id_here",
  "name": "Your Name",
  "role": "worker",
  ...
}
```

Verification:

- [ ] localStorage key exists
- [ ] Contains user data
- [ ] Updates after profile edit

---

## 🚀 Test Dynamic Updates

### Test 1: Single Tab (Verify Save Works)

1. Go to: http://localhost:5173/worker-profile-edit
2. Change your name (e.g., "John" → "Jane")
3. Click "Save Profile"
4. Wait 2 seconds

Expected:

- [ ] Success message appears
- [ ] Redirects to /worker-profile
- [ ] New name shows on profile page

### Test 2: Two Tabs (Verify Real-Time Sync)

1. **Tab 1:** http://localhost:5173/worker-profile-edit
2. **Tab 2:** http://localhost:5173/worker-profile
3. In Tab 1, change name and click Save
4. Watch Tab 2

Expected:

- [ ] Tab 2 name updates **instantly**
- [ ] No manual refresh needed
- [ ] Changes appear < 1 second

### Test 3: Dashboard Updates

1. **Tab 1:** http://localhost:5173/worker-profile-edit
2. **Tab 2:** http://localhost:5173/worker-dashboard
3. In Tab 1, change name/details and Save
4. Watch Tab 2

Expected:

- [ ] Tab 2 dashboard updates in real-time
- [ ] Stats refresh automatically
- [ ] Profile completion % updates

### Test 4: Multiple Tabs

1. Open 4 tabs of different pages:
   - Tab 1: Profile Edit
   - Tab 2: Profile View
   - Tab 3: Dashboard
   - Tab 4: Services
2. Edit profile in Tab 1
3. Watch Tabs 2 & 3 update

Expected:

- [ ] All relevant tabs update simultaneously
- [ ] No delay or race conditions
- [ ] Data consistent across tabs

---

## 🖼️ Cloudinary Setup

### Verify Configuration

Check `server/config/cloudinary.js`:

```javascript
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

- [ ] Config file exists
- [ ] Uses process.env variables
- [ ] No hardcoded credentials

### Verify Services

Check `server/services/cloudinary.service.js`:

- [ ] Has `uploadBase64ToCloudinary()`
- [ ] Has `uploadToCloudinary()`
- [ ] Has `deleteFromCloudinary()`
- [ ] Has `getOptimizedImageUrl()`

### Verify Utils

Check `server/utils/socketio.utils.js`:

- [ ] Has SOCKET_EVENTS constants
- [ ] Has broadcast functions
- [ ] Has helper functions

---

## 🔒 Security Check

### 1. Credentials Not Committed

```bash
# Check .env is in .gitignore
cat .gitignore
```

- [ ] `.env` is in .gitignore
- [ ] `.env.example` exists (template only)
- [ ] No credentials in code

### 2. API Keys Protected

- [ ] CLOUDINARY_API_SECRET only in .env
- [ ] JWT_SECRET in .env
- [ ] MONGODB_URI in .env

### 3. CORS Configured

Check `server/index.js`:

```javascript
cors: {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST"]
}
```

- [ ] CORS has CLIENT_URL
- [ ] Only allows needed methods

---

## 📊 Performance Check

### 1. Bundle Size

```bash
npm run build
```

Expected:

- [ ] Client build completes
- [ ] No size warnings
- [ ] Socket.io client bundle included

### 2. Network Speed

Check DevTools Network tab:

- [ ] WebSocket ping < 50ms
- [ ] API responses < 100ms
- [ ] No slow requests

### 3. Memory Usage

Open DevTools Performance tab:

- [ ] No memory leaks
- [ ] Cleanup on unmount
- [ ] Listeners properly removed

---

## 🐛 Debugging Checklist

### If Updates Not Working:

1. **Check Browser Console** (F12):

   ```javascript
   // Should see these messages:
   console.log("🟢 Socket.io connected");
   console.log("📡 Worker update received");
   ```

   - [ ] Connection message appears
   - [ ] Update message appears
   - [ ] No error messages

2. **Check Network** (F12 → Network):
   - [ ] WebSocket connection open
   - [ ] HTTP PUT request successful (200)
   - [ ] No 404 or 500 errors

3. **Check Server Logs**:

   ```bash
   # Terminal should show:
   # 🟢 User connected: socket_id
   # ✏️ Worker profile updated: worker_id
   # (or similar messages)
   ```

   - [ ] User connection logged
   - [ ] Profile update logged
   - [ ] No errors in server

4. **Check localStorage** (F12 → Application → Storage):
   - [ ] skillserverUser exists
   - [ ] Contains latest data
   - [ ] Updates after save

5. **Check .env Variables**:
   ```bash
   # In server terminal:
   npm start
   # Should see Cloudinary config loaded
   ```

   - [ ] All .env variables loaded
   - [ ] No undefined errors
   - [ ] Cloudinary initialized

---

## ✅ Full System Check

Run this final verification:

- [ ] Backend server running on :5000
- [ ] Frontend running on :5173
- [ ] Socket.io connected (console shows 🟢)
- [ ] Can log in / access dashboard
- [ ] Can navigate to profile edit
- [ ] Can edit profile and save
- [ ] Success message appears
- [ ] Other tabs update instantly
- [ ] Profile completion % updates
- [ ] localStorage updated
- [ ] No errors in console
- [ ] No errors in terminal
- [ ] Database has new data (check MongoDB)

---

## 🎯 Verification Scores

### 100% Complete:

- ✅ All checkboxes marked
- ✅ All tests passing
- ✅ Real-time updates working
- ✅ Cloudinary ready
- ✅ No errors

### 80-99% Complete:

- Minor issues (some updates delayed)
- Check network latency
- Verify Socket.io connection stable

### < 80% Complete:

- Major issues exist
- Check backend logs
- Verify .env configuration
- Hard refresh browser
- Restart servers

---

## 🆘 Emergency Fixes

If something breaks:

### 1. Full System Restart

```bash
# Terminal 1 (Backend)
cd server
npm start

# Terminal 2 (Frontend)
cd client
npm run dev

# Browser
Ctrl+Shift+Delete (Clear cache)
Ctrl+F5 (Hard refresh)
```

### 2. Check All Files

Verify these critical files exist:

- [ ] `client/src/hooks/useSocket.js`
- [ ] `server/config/cloudinary.js`
- [ ] `server/controllers/socketio.controller.js`
- [ ] `server/utils/socketio.utils.js`

### 3. Reinstall Dependencies

```bash
# Clear dependencies
rm -rf node_modules package-lock.json

# Reinstall
npm install
npm install cloudinary
npm install socket.io-client
```

### 4. Reset Database

```bash
# Option: Delete all collections and start fresh
# Or: Use MongoDB Compass GUI
# Or: Run reset script if available
```

---

## 📞 Support Resources

### Check These Files for Docs:

- [ ] `IMPLEMENTATION_SUMMARY.md` - Complete guide
- [ ] `DYNAMIC_PROFILE_UPDATES.md` - Real-time updates
- [ ] `CLOUDINARY_SOCKETIO_SETUP.md` - Cloudinary setup
- [ ] `QUICK_TEST_GUIDE.md` - Quick testing
- [ ] `CLOUDINARY_FRONTEND_INTEGRATION.js` - Code examples

### Useful Commands:

```bash
# Check if ports are in use:
netstat -tuln | grep 5000

# Kill process on port 5000:
kill -9 $(lsof -t -i:5000)

# Check Node version:
node --version

# Check npm packages:
npm list

# Check environment:
echo $MONGODB_URI
echo $CLOUDINARY_CLOUD_NAME
```

---

## 🎉 Ready to Go!

If all checkboxes are marked, you're ready to use the system!

**Status: ✅ FULLY OPERATIONAL**

Real-time profile updates + Cloudinary setup complete! 🚀
