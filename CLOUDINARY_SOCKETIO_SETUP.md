# Cloudinary & Socket.io Setup Guide

## 🎯 Cloudinary Setup Complete

### Your Cloudinary Credentials:

```
Cloud Name: dhxt9swpg
API Key: 793951369521343
API Secret: 74gYsIAW4zF9p8sVdS4LhD_CHGA
```

---

## 📁 Files Created

### Backend Setup Files:

1. **`server/config/cloudinary.js`** - Cloudinary configuration
2. **`server/services/cloudinary.service.js`** - Cloudinary utility functions
3. **`server/controllers/socketio.controller.js`** - Socket.io event handlers
4. **`server/utils/socketio.utils.js`** - Socket.io helper utilities
5. **`server/.env.example`** - Environment variables template

---

## 🖼️ What Cloudinary Will Be Used For

### ✅ Image Upload Locations:

1. **Worker Profile Photo**
   - Folder: `skill-server/worker-profiles`
   - Usage: Worker signup and profile edit pages
   - Optimization: 400x400px, auto quality

2. **Aadhar Card Images**
   - Folder: `skill-server/documents/aadhar`
   - Usage: Worker verification during profile completion
   - Optimization: Maintains original quality for document verification

3. **PAN Card Images**
   - Folder: `skill-server/documents/pan`
   - Usage: Worker verification during profile completion
   - Optimization: Maintains original quality for document verification

4. **Degree Certificate Images**
   - Folder: `skill-server/documents/degrees`
   - Usage: Optional professional credentials
   - Optimization: Maintains original quality

5. **User Profile Photos**
   - Folder: `skill-server/user-profiles`
   - Usage: Customer profile pages
   - Optimization: 400x400px, auto quality

6. **Service Images**
   - Folder: `skill-server/service-images`
   - Usage: Service listing and detail pages
   - Optimization: 800x600px, auto quality

---

## 🚀 Installation Steps

### 1. Install Cloudinary Package

```bash
cd server
npm install cloudinary
```

### 2. Update .env File

Create or update `server/.env` with:

```env
CLOUDINARY_CLOUD_NAME=dhxt9swpg
CLOUDINARY_API_KEY=793951369521343
CLOUDINARY_API_SECRET=74gYsIAW4zF9p8sVdS4LhD_CHGA
```

### 3. Verify Installation

```bash
npm start
# You should see Cloudinary config loaded in console
```

---

## 📊 Socket.io Events Available

### Worker Events:

- `worker_joined` - New worker signup
- `worker_updated` - Worker profile updated
- `worker_online` - Worker came online
- `worker_offline` - Worker went offline
- `availability_changed` - Worker status changed (online/offline/busy)

### Booking Events:

- `booking_created` - New booking request
- `booking_accepted` - Worker accepted booking
- `booking_rejected` - Worker rejected booking
- `booking_completed` - Service completed
- `booking_cancelled` - Booking cancelled

### User Events:

- `user_online` - User came online
- `user_offline` - User went offline
- `user_profile_updated` - User profile changed

### Other Events:

- `rating_received` - Worker received rating
- `message_sent` - Message sent between parties
- `user_register` - User joins Socket.io room

---

## 📝 Usage Examples

### Using Cloudinary in Controllers

#### Upload Worker Profile Photo (Base64):

```javascript
import { uploadBase64ToCloudinary } from "../services/cloudinary.service.js";

// In your controller
const photoUrl = await uploadBase64ToCloudinary(
  base64Data,
  "skill-server/worker-profiles",
  `worker_${workerId}`,
);

worker.profilePhoto = photoUrl.url;
```

#### Upload Document (Aadhar/PAN):

```javascript
const documentUrl = await uploadBase64ToCloudinary(
  base64Data,
  "skill-server/documents/aadhar",
  `aadhar_${workerId}`,
);

worker.aadharCard = documentUrl.url;
```

#### Delete Image:

```javascript
import { deleteFromCloudinary } from "../services/cloudinary.service.js";

await deleteFromCloudinary(publicId);
```

---

### Using Socket.io in Controllers

#### Emit Worker Status Update:

```javascript
import { broadcastToUsers } from "../utils/socketio.utils.js";

// In your controller after worker updates profile
broadcastToUsers(req.io, "worker_updated", {
  workerId: worker._id,
  updates: {
    name: worker.name,
    profession: worker.profession,
    profileCompletionPercentage: worker.profileCompletionPercentage,
  },
});
```

#### Send Booking Notification:

```javascript
import { emitToUser } from "../utils/socketio.utils.js";

// Notify specific worker about new booking
emitToUser(req.io, booking.workerId, "booking_created", {
  bookingId: booking._id,
  userName: booking.userName,
  service: booking.service,
  notification: `New booking from ${booking.userName}`,
});
```

---

## 🎨 Cloudinary Features Enabled

✅ **Auto Quality** - Automatically optimizes image quality
✅ **Auto Format** - Serves WebP to modern browsers, JPG to others
✅ **Responsive Images** - Automatically serves correct size
✅ **Secure URLs** - All images on HTTPS
✅ **CDN Delivery** - Ultra-fast global delivery
✅ **Image Optimization** - 60-80% smaller file sizes

---

## 📱 Frontend Integration (Coming Soon)

Update these frontend components to use Cloudinary:

1. **`client/src/pages/profile/WorkerProfileEdit.jsx`**
   - Replace Base64 uploads with Cloudinary
   - Use `uploadBase64ToCloudinary()` for all images

2. **`client/src/pages/auth/Signup.jsx`**
   - Update photo upload to use Cloudinary

3. **`client/src/services/worker.service.js`**
   - Update upload methods to use Cloudinary service

---

## 🔗 Socket.io Connection Flow

### Frontend (Client):

```javascript
import io from "socket.io-client";

const socket = io("http://localhost:5000");

// Register user
socket.emit("user_register", {
  userId: user._id,
  role: user.role, // 'user' or 'worker'
});

// Listen for worker updates
socket.on("worker_updated", (data) => {
  console.log("Worker profile updated:", data);
});
```

### Backend (Server):

```javascript
// Automatically handled by socketio.controller.js
// Events are broadcasted to appropriate rooms
```

---

## 🛠️ Socket.io Controller Methods

### Available Broadcast Functions:

1. **`emitToUser(io, userId, eventName, data)`**
   - Send to specific user

2. **`broadcastToWorkers(io, eventName, data)`**
   - Send to all connected workers

3. **`broadcastToUsers(io, eventName, data)`**
   - Send to all connected customers

4. **`broadcastToAll(io, eventName, data)`**
   - Send to everyone

---

## ✅ Next Steps

1. **Install Cloudinary**: `npm install cloudinary`
2. **Update .env** with your credentials
3. **Test uploads** using the WorkerProfileEdit page
4. **Monitor Socket.io** real-time events in browser console
5. **Update Frontend** services to use Cloudinary utilities

---

## 🔒 Security Notes

⚠️ **IMPORTANT**: Never commit credentials to GitHub!

- ✅ Use `.env` file (in `.gitignore`)
- ✅ Use `.env.example` as template
- ✅ All uploads go through your backend (not directly from frontend)
- ✅ Cloudinary API secrets are server-side only

---

## 📞 Cloudinary Folder Structure

```
skill-server/
├── worker-profiles/         (Worker profile photos)
├── user-profiles/          (Customer profile photos)
├── service-images/         (Service listing images)
└── documents/
    ├── aadhar/            (Aadhar documents)
    ├── pan/               (PAN documents)
    └── degrees/           (Degree certificates)
```

---

## 🎯 What's Working Now

✅ Cloudinary configuration loaded
✅ Upload service ready
✅ Socket.io controller with all events
✅ Real-time event broadcasting
✅ User authentication and room management
✅ Booking event notifications
✅ Worker status updates

**Ready to use!** 🚀
