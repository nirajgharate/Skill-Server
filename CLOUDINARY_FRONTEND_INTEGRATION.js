/**
 * Frontend Cloudinary Integration Guide
 * 
 * This guide shows where and how to use Cloudinary in frontend
 */

// ============================================
// 1. WORKER PROFILE EDIT - WorkerProfileEdit.jsx
// ============================================

// BEFORE (Using Base64):
const handleFileUpload = (e, fieldName) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, [fieldName]: reader.result }));
      setPreviewImages(prev => ({ ...prev, [fieldName]: reader.result }));
    };
    reader.readAsDataURL(file);
  }
};

// AFTER (Using Cloudinary):
import { uploadBase64ToCloudinary } from '../../services/cloudinary.service.js';

const handleFileUpload = async (e, fieldName) => {
  const file = e.target.files?.[0];
  if (file) {
    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        // Upload to Cloudinary
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: reader.result,
            folder: fieldName === 'profilePhoto' ? 'skill-server/worker-profiles' : `skill-server/documents/${fieldName}`,
            workerId: authUser._id
          })
        });
        const data = await response.json();
        
        // Use Cloudinary URL instead of Base64
        setFormData(prev => ({ ...prev, [fieldName]: data.url }));
        setPreviewImages(prev => ({ ...prev, [fieldName]: data.url }));
      } catch (error) {
        setError('Image upload failed');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }
};

// ============================================
// 2. SIGNUP PAGE - Signup.jsx
// ============================================

// When worker takes photo during signup
const handlePhotoCapture = async (photoBase64) => {
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: photoBase64,
        folder: 'skill-server/worker-profiles',
        publicId: `worker_${newWorker.email}`
      })
    });
    const data = await response.json();
    
    // Use Cloudinary URL
    setNewWorker(prev => ({ ...prev, profilePhoto: data.url }));
  } catch (error) {
    console.error('Photo upload failed:', error);
  }
};

// ============================================
// 3. WORKER SERVICE - worker.service.js
// ============================================

// UPDATE METHODS to send to backend for Cloudinary upload

const uploadProfilePhoto = async (workerId, photoBase64) => {
  try {
    const response = await API.post(`/workers/${workerId}/upload-photo`, {
      photo: photoBase64
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Photo upload failed');
  }
}

const uploadAadharCard = async (workerId, aadharBase64) => {
  try {
    const response = await API.post(`/workers/${workerId}/upload-aadhar`, {
      document: aadharBase64
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Aadhar upload failed');
  }
};

const uploadPanCard = async (workerId, panBase64) => {
  try {
    const response = await API.post(`/workers/${workerId}/upload-pan`, {
      document: panBase64
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'PAN upload failed');
  }
};

const uploadDegreeCertificate = async (workerId, degreeBase64) => {
  try {
    const response = await API.post(`/workers/${workerId}/upload-degree`, {
      document: degreeBase64
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Degree upload failed');
  }
};

// ============================================
// 4. BACKEND ROUTES - worker.routes.js
// ============================================

// Add these new routes to handle Cloudinary uploads

router.post('/:id/upload-photo', async (req, res) => {
  try {
    const { photo } = req.body;
    const { url } = await uploadBase64ToCloudinary(
      photo,
      'skill-server/worker-profiles',
      `worker_${req.params.id}`
    );
    
    // Update worker in database
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { profilePhoto: url },
      { new: true }
    );
    
    res.json({ success: true, url });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/:id/upload-aadhar', async (req, res) => {
  try {
    const { document } = req.body;
    const { url } = await uploadBase64ToCloudinary(
      document,
      'skill-server/documents/aadhar',
      `aadhar_${req.params.id}`
    );
    
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { aadharCard: url },
      { new: true }
    );
    
    // Emit Socket.io event
    req.io.emit('worker_updated', { workerId: req.params.id });
    
    res.json({ success: true, url });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Similar for PAN and Degree...

// ============================================
// 5. SOCKET.IO CLIENT - Socket setup
// ============================================

import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Register user
socket.emit('user_register', {
  userId: authUser._id,
  role: authUser.role,
  ack: (response) => console.log('Registered:', response)
});

// Listen for worker updates
socket.on('worker_updated', (data) => {
  console.log('Worker profile updated:', data);
  // Refresh worker list or profile
});

// Listen for booking events
socket.on('booking_created', (data) => {
  console.log('New booking:', data);
  // Show notification
});

socket.on('booking_accepted', (data) => {
  console.log('Booking accepted:', data);
  // Show success notification
});

// ============================================
// 6. IMAGE OPTIMIZATION URLs
// ============================================

// Use Cloudinary's URL transformation for better performance

// Example: Get optimized profile photo
const optimizedProfileUrl = `${cloudinaryUrl}?w=400&h=400&c=fill&q=auto&f=auto`;

// Example: Get optimized service image
const optimizedServiceUrl = `${cloudinaryUrl}?w=800&h=600&c=fill&q=auto&f=auto`;

// ============================================
// SUMMARY OF CHANGES
// ============================================

/*
FILES TO UPDATE:

1. ✅ client/src/pages/profile/WorkerProfileEdit.jsx
   - Replace Base64 file handling with Cloudinary upload

2. ✅ client/src/pages/auth/Signup.jsx
   - Update photo capture to use Cloudinary

3. ✅ client/src/services/worker.service.js
   - Update upload methods to send to backend

4. ✅ server/routes/worker.routes.js
   - Add upload endpoints (upload-photo, upload-aadhar, upload-pan, upload-degree)

5. ✅ client/src/hooks/useSocket.js (CREATE)
   - Create Socket.io hook for easy event handling

6. ✅ Backend controllers
   - Import cloudinary service and use uploadBase64ToCloudinary()

BENEFITS OF USING CLOUDINARY:

✅ No more Base64 bloat (smaller API payloads)
✅ Automatic image optimization (60-80% smaller)
✅ CDN delivery (ultra-fast loading)
✅ Automatic format conversion (WebP for modern browsers)
✅ Image resizing on-the-fly
✅ Secure storage
✅ Easy image management and deletion
*/
