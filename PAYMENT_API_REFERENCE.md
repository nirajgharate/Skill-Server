# SkillServer Payment System - API Quick Reference

## 🔗 Base URL

```
Development: http://localhost:5001/api
Production: https://api.skillserver.com/api
```

---

## 💳 Payment Endpoints

### 1. CREATE PAYMENT ORDER

**Endpoint:** `POST /payments/create-order`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "bookingId": "66f1234567890abcdef01234",
  "amount": 500,
  "currency": "INR",
  "method": "upi",
  "notes": {
    "time": "10:00 AM",
    "problemDesc": "Water leakage from ceiling",
    "requirements": "Bring materials"
  }
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "orderId": "order_1234567890",
    "amount": 50000,
    "currency": "INR",
    "key": "rzp_test_Sf4fNNSo3H0zgA",
    "paymentRecordId": "66f1234567890abcdef05678",
    "transactionId": "TXN-1713754800000-A1B2C3D4E",
    "workerUpiId": "john@okhdfcbank",
    "workerName": "John Doe"
  }
}
```

**Error Responses:**

❌ **400 - Worker UPI Not Configured:**

```json
{
  "success": false,
  "message": "⚠️ Worker payment details not configured",
  "code": "WORKER_NO_UPI"
}
```

❌ **400 - Payment Already Completed:**

```json
{
  "success": false,
  "message": "Payment already completed for this booking"
}
```

❌ **404 - Booking Not Found:**

```json
{
  "success": false,
  "message": "Booking not found or unauthorized"
}
```

---

### 2. VERIFY PAYMENT

**Endpoint:** `POST /payments/verify-payment`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "razorpay_order_id": "order_1234567890",
  "razorpay_payment_id": "pay_1234567890",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a",
  "bookingId": "66f1234567890abcdef01234",
  "method": "upi"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "paymentId": "pay_1234567890",
    "orderId": "order_1234567890",
    "transactionId": "TXN-1713754800000-A1B2C3D4E",
    "amount": 500,
    "bookingId": "66f1234567890abcdef01234",
    "status": "paid",
    "workerUpiId": "john@okhdfcbank",
    "workerName": "John Doe"
  }
}
```

**Error Response (400) - Verification Failed:**

```json
{
  "success": false,
  "message": "Payment verification failed"
}
```

---

### 3. RELEASE PAYMENT (Admin/Backend)

**Endpoint:** `POST /payments/release-payment`

**Headers:**

```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "bookingId": "66f1234567890abcdef01234"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Payment released to worker",
  "data": {
    "workerAmount": 450,
    "platformCommission": 50,
    "transactionId": "TXN-1713754800000-A1B2C3D4E",
    "workerUpiId": "john@okhdfcbank"
  }
}
```

---

## 📋 Booking Endpoints

### 1. CREATE BOOKING

**Endpoint:** `POST /bookings/create`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "serviceId": "66f1234567890abcdef02345",
  "workerId": "66f1234567890abcdef03456",
  "date": "2026-04-25T00:00:00Z",
  "time": "10:00 AM",
  "address": "123 Main St, Bangalore",
  "notes": {
    "time": "10:00 AM",
    "problemDesc": "Leaky faucet in bathroom",
    "requirements": "Bring replacement parts"
  },
  "amount": 500
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "66f1234567890abcdef01234",
    "userId": "66f1234567890abcdef00001",
    "workerId": "66f1234567890abcdef03456",
    "serviceId": "66f1234567890abcdef02345",
    "amount": 500,
    "status": "pending",
    "date": "2026-04-25T00:00:00Z",
    "time": "10:00 AM",
    "address": "123 Main St, Bangalore",
    "createdAt": "2026-04-21T18:30:00Z"
  }
}
```

**Error Response (400) - Worker UPI Not Configured:**

```json
{
  "success": false,
  "message": "⚠️ Worker payment method not configured. Please try another worker.",
  "code": "WORKER_NO_UPI"
}
```

---

### 2. GET BOOKING

**Endpoint:** `GET /bookings/:bookingId`

**Headers:**

```
Authorization: Bearer {token}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "66f1234567890abcdef01234",
    "userId": "66f1234567890abcdef00001",
    "workerId": {
      "_id": "66f1234567890abcdef03456",
      "name": "John Doe",
      "upiId": "john@okhdfcbank"
    },
    "serviceId": "66f1234567890abcdef02345",
    "amount": 500,
    "status": "confirmed",
    "paymentId": "66f1234567890abcdef05678",
    "date": "2026-04-25T00:00:00Z",
    "time": "10:00 AM",
    "address": "123 Main St, Bangalore"
  }
}
```

---

### 3. UPDATE BOOKING STATUS

**Endpoint:** `PATCH /bookings/:bookingId/status`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "status": "in_progress"
}
```

**Valid Status Values:**

- `pending` - Initial state after booking
- `confirmed` - After payment verified
- `in_progress` - Work has started
- `completed` - Work finished
- `released` - Payment released to worker
- `cancelled` - Booking cancelled

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "66f1234567890abcdef01234",
    "status": "in_progress",
    "updatedAt": "2026-04-25T12:00:00Z"
  }
}
```

---

## 👤 Worker Endpoints

### 1. UPDATE WORKER PROFILE (with UPI)

**Endpoint:** `PUT /workers/:workerId`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "profession": "plumber",
  "serviceArea": "Bangalore North",
  "experienceYears": 5,
  "hourlyRate": 500,
  "bio": "Professional plumber with 5 years experience",
  "gender": "male",
  "upiId": "john@okhdfcbank",
  "skills": ["Leak Repair", "Pipe Installation"],
  "coreExpertise": ["Pipe Installation", "Leak Repair"],
  "portfolio": []
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "✅ Profile updated successfully! UPI ID configured for payments.",
  "data": {
    "_id": "66f1234567890abcdef03456",
    "name": "John Doe",
    "upiId": "john@okhdfcbank",
    "totalEarnings": 2500,
    "pendingEarnings": 500
  }
}
```

**Validation Errors:**

❌ **400 - UPI Required:**

```json
{
  "success": false,
  "message": "⚠️ UPI ID is mandatory! Please add your UPI ID to receive payments."
}
```

❌ **400 - Invalid UPI Format:**

```json
{
  "success": false,
  "message": "⚠️ Invalid UPI ID format! Use format like name@upi or name@okhdfcbank"
}
```

---

### 2. GET WORKER PROFILE

**Endpoint:** `GET /workers/:workerId`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "66f1234567890abcdef03456",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "profession": "plumber",
    "upiId": "john@okhdfcbank",
    "totalEarnings": 2500,
    "pendingEarnings": 500,
    "skills": ["Leak Repair", "Pipe Installation"],
    "coreExpertise": ["Pipe Installation", "Leak Repair"],
    "rating": 4.8,
    "reviewsCount": 45
  }
}
```

---

### 3. GET WORKER EARNINGS

**Endpoint:** `GET /workers/:workerId/earnings`

**Headers:**

```
Authorization: Bearer {token}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "totalEarnings": 2500,
    "pendingEarnings": 500,
    "availableForWithdrawal": 2000,
    "transactions": [
      {
        "_id": "66f1234567890abcdef04567",
        "transactionId": "TXN-1713754800000-A1B2C3D4E",
        "amount": 450,
        "date": "2026-04-20T10:30:00Z",
        "bookingId": "66f1234567890abcdef01234",
        "status": "completed"
      }
    ]
  }
}
```

---

## 🔐 Authentication

### Login Endpoint

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "66f1234567890abcdef00001",
      "name": "John User",
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

### Token Usage

Add to all authenticated requests:

```
Authorization: Bearer {token}
```

---

## 📊 Request/Response Format

### Success Response Template

```json
{
  "success": true,
  "message": "Operation successful (optional)",
  "data": {
    // Response data here
  }
}
```

### Error Response Template

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE (optional)",
  "error": "Technical error details (optional)"
}
```

---

## 🔢 Status Codes

| Code | Meaning      | Example                       |
| ---- | ------------ | ----------------------------- |
| 200  | OK           | Payment verified successfully |
| 201  | Created      | Booking created               |
| 400  | Bad Request  | Invalid UPI format            |
| 401  | Unauthorized | Missing authentication token  |
| 404  | Not Found    | Worker/Booking not found      |
| 500  | Server Error | Database connection failed    |

---

## 🧪 Testing with cURL

### Create Payment Order

```bash
curl -X POST http://localhost:5001/api/payments/create-order \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "66f1234567890abcdef01234",
    "amount": 500,
    "currency": "INR",
    "method": "upi"
  }'
```

### Verify Payment

```bash
curl -X POST http://localhost:5001/api/payments/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_1234567890",
    "razorpay_payment_id": "pay_1234567890",
    "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a",
    "bookingId": "66f1234567890abcdef01234"
  }'
```

### Update Worker UPI

```bash
curl -X PUT http://localhost:5001/api/workers/66f1234567890abcdef03456 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "upiId": "john@okhdfcbank"
  }'
```

---

## 🎯 Integration Checklist

- [ ] Backend running on port 5001
- [ ] Frontend running on port 5175
- [ ] MongoDB connected
- [ ] Razorpay keys in .env
- [ ] Worker has valid UPI configured
- [ ] Authentication token obtained
- [ ] Payment order created
- [ ] Razorpay checkout opens successfully
- [ ] Payment signature verified on backend
- [ ] Booking status updated to confirmed
- [ ] Transaction ID displayed on frontend
- [ ] Socket.io events received

---

**Last Updated:** April 2026
**Version:** 1.0
**Status:** Production Ready ✅
