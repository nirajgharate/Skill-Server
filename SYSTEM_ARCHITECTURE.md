# 🏗️ SkillServer Payment System Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SKILLSERVER PAYMENT SYSTEM                       │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────────┐
                              │   MongoDB Atlas  │
                              │   (Database)     │
                              └────────┬─────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
              ┌─────▼─────┐    ┌──────▼──────┐   ┌──────▼──────┐
              │   Worker   │    │   Payment   │   │   Booking   │
              │  Collection│    │ Collection  │   │ Collection  │
              └────────────┘    └─────────────┘   └─────────────┘
                    │
              ┌─────▼──────────┐
              │ { upiId: "..." │
              │  totalEarnings │
              └────────────────┘
```

---

## Frontend to Backend Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                                   │
│  http://localhost:5175                                                   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  1. ElitePaymentStep.jsx (5-step wizard)                                 │
│     ├─ Select service                                                     │
│     ├─ Choose date & time                                                │
│     ├─ Enter address                                                      │
│     ├─ Review service                                                     │
│     └─ Select payment method                                             │
│            │                                                              │
│            ▼                                                              │
│  2. Call Backend: POST /api/payments/create-order                        │
│     ├─ sends: { bookingId, amount, method }                             │
│     ├─ receives: { orderId, key, transactionId, workerUpiId }           │
│            │                                                              │
│            ▼                                                              │
│  3. Razorpay Checkout Opens                                              │
│     ├─ Test Card: 4111 1111 1111 1111                                   │
│     ├─ OTP: 123456                                                       │
│            │                                                              │
│            ▼                                                              │
│  4. Call Backend: POST /api/payments/verify-payment                      │
│     ├─ sends: { razorpay_order_id, razorpay_payment_id, signature }     │
│     ├─ receives: { transactionId, status, amount, workerUpiId }         │
│            │                                                              │
│            ▼                                                              │
│  5. ConfirmationPage.jsx                                                  │
│     ├─ Success message ✅                                                │
│     ├─ Transaction ID: TXN-1713754800000-A1B2C3D4E                      │
│     ├─ Copy button 📋                                                    │
│     ├─ Amount: ₹500                                                      │
│     └─ Routed To: worker@okhdfcbank                                      │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS/WSS
                                    │
┌──────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Node.js)                                  │
│  http://localhost:5001                                                   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  1. POST /api/payments/create-order (payment.controller.js)              │
│     ├─ Validate worker exists                                            │
│     ├─ Check worker.upiId exists ✅                                      │
│     ├─ Generate unique transactionId                                     │
│     │  Format: TXN-${Date.now()}-${random}                              │
│     ├─ Create Razorpay order                                            │
│     └─ Return: { orderId, key, transactionId }                          │
│            │                                                              │
│            ▼                                                              │
│  2. POST /api/payments/verify-payment (payment.controller.js)            │
│     ├─ Receive: payment details from Razorpay                           │
│     ├─ Verify signature: crypto.createHmac("sha256", SECRET)            │
│     │  Expected: digest === razorpay_signature                          │
│     ├─ If valid:                                                         │
│     │  ├─ Create Payment record                                         │
│     │  ├─ Update Booking status → "confirmed"                          │
│     │  ├─ Save workerUpiId in Payment                                  │
│     │  ├─ Emit Socket.io event: booking_confirmed                      │
│     │  └─ Return: { transactionId, status }                            │
│     └─ If invalid:                                                       │
│        └─ Return error: "Payment verification failed"                   │
│            │                                                              │
│            ▼                                                              │
│  3. Real-time Updates (Socket.io)                                        │
│     ├─ Event: booking_confirmed                                          │
│     ├─ Payload: { bookingId, transactionId, status }                    │
│     ├─ Audience: worker, user                                           │
│     └─ Result: Dashboard updates instantly                              │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Payment Processing Pipeline

```
                        ┌─────────────────────┐
                        │  Worker Booking     │
                        │  ────────────────   │
                        │  WorkerId: 123      │
                        │  Amount: ₹500       │
                        │  Status: pending    │
                        └──────────┬──────────┘
                                   │
                ┌──────────────────▼──────────────────┐
                │   Validate Worker UPI               │
                │   ────────────────────────────────  │
                │   worker.upiId = "john@upi"        │
                │   Pattern: /^[a-z0-9._-]+@[a-z]+$/ │
                │   Status: ✅ VALID                 │
                └──────────────────┬──────────────────┘
                                   │
                ┌──────────────────▼──────────────────┐
                │   Create Razorpay Order             │
                │   ────────────────────────────────  │
                │   Amount: 50000 (in paise)         │
                │   Currency: INR                    │
                │   Receipt: transactionId            │
                └──────────────────┬──────────────────┘
                                   │
                ┌──────────────────▼──────────────────┐
                │   Generate Transaction ID           │
                │   ────────────────────────────────  │
                │   Format: TXN-{timestamp}-{random} │
                │   Example: TXN-1713754800000-A1B2C │
                │   Status: ✅ GENERATED             │
                └──────────────────┬──────────────────┘
                                   │
                ┌──────────────────▼──────────────────┐
                │   Return Order Details              │
                │   ────────────────────────────────  │
                │   orderId: order_12345              │
                │   key: rzp_test_Sf4fNNSo3H0zgA     │
                │   transactionId: TXN-...            │
                │   workerUpiId: john@upi             │
                └──────────────────┬──────────────────┘
                                   │
                ┌──────────────────▼──────────────────┐
                │   Frontend Opens Razorpay Checkout  │
                │   ────────────────────────────────  │
                │   User enters card details          │
                │   Razorpay handles payment          │
                │   Sends response to frontend        │
                └──────────────────┬──────────────────┘
                                   │
                ┌──────────────────▼──────────────────┐
                │   Backend Verifies Signature        │
                │   ────────────────────────────────  │
                │   Compute: HMAC-SHA256              │
                │   message: order_id|payment_id      │
                │   key: RAZORPAY_KEY_SECRET          │
                │   Compare: digest === signature     │
                │   Status: ✅ VERIFIED              │
                └──────────────────┬──────────────────┘
                                   │
                ┌──────────────────▼──────────────────┐
                │   Update Booking Status             │
                │   ────────────────────────────────  │
                │   status: pending → confirmed       │
                │   paymentId: payment_record_id      │
                │   paidAt: new Date()                │
                │   Status: ✅ UPDATED               │
                └──────────────────┬──────────────────┘
                                   │
                ┌──────────────────▼──────────────────┐
                │   Create Payment Record             │
                │   ────────────────────────────────  │
                │   transactionId: TXN-...            │
                │   razorpayPaymentId: pay_123        │
                │   workerUpiId: john@upi             │
                │   amount: 500                       │
                │   status: paid                      │
                │   Status: ✅ RECORDED              │
                └──────────────────┬──────────────────┘
                                   │
                ┌──────────────────▼──────────────────┐
                │   Emit Socket.io Events             │
                │   ────────────────────────────────  │
                │   Event: booking_confirmed          │
                │   To: worker, user                  │
                │   Payload: { bookingId, status }    │
                │   Status: ✅ EMITTED               │
                └──────────────────┬──────────────────┘
                                   │
                ┌──────────────────▼──────────────────┐
                │   Return Confirmation               │
                │   ────────────────────────────────  │
                │   transactionId: TXN-...            │
                │   status: paid                      │
                │   amount: 500                       │
                │   workerUpiId: john@upi             │
                │   Status: ✅ COMPLETE              │
                └──────────────────────────────────────┘
```

---

## Data Model Relationships

```
┌──────────────────────────┐
│       USER               │
│  ──────────────────────  │
│  _id: ObjectId           │
│  name: String            │
│  email: String           │
│  role: user|worker       │
└──────────┬───────────────┘
           │
           │ Creates
           │
           ▼
┌──────────────────────────┐         ┌──────────────────────────┐
│      BOOKING             │────────▶│      WORKER              │
│  ──────────────────────  │ Books   │  ──────────────────────  │
│  _id: ObjectId           │         │  _id: ObjectId           │
│  userId: ObjectId ──────────────┐  │  name: String            │
│  workerId: ObjectId ──────┐      │  │  upiId: String ⭐       │
│  serviceId: ObjectId      │      │  │  totalEarnings: Number  │
│  paymentId: ObjectId ──┐  │      │  │  pendingEarnings: Number│
│  amount: Number        │  │      │  │  bankAccount: Object    │
│  status: String        │  │      │  └──────────────────────────┘
│  date: Date            │  │      │
│  time: String          │  │      │
│  address: String       │  │      │
└──────────────┬─────────┘  │      │
               │            │      │
               │ Linked     │      │ Created by
               │            │      │
               ▼            │      │
┌──────────────────────────┐│      │
│      PAYMENT             ││      │
│  ──────────────────────  ││      │
│  _id: ObjectId           ││      │
│  bookingId: ObjectId ────┼┘      │
│  userId: ObjectId ───────┴──────┤
│  workerId: ObjectId ─────────────┘
│  transactionId: String ⭐        │
│  razorpayOrderId: String         │ ⭐ Key Field
│  razorpayPaymentId: String       │
│  razorpaySignature: String       │
│  workerUpiId: String ⭐          │
│  amount: Number                  │
│  currency: String                │
│  status: paid|failed|cancelled   │
│  paidAt: Date                    │
│  createdAt: Date                 │
└──────────────────────────┘
```

---

## Security Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SECURE SIGNATURE VERIFICATION                    │
└─────────────────────────────────────────────────────────────────────┘

RAZORPAY SENDS TO FRONTEND:
┌────────────────────────────────────────┐
│ razorpay_order_id: "order_123456"      │
│ razorpay_payment_id: "pay_123456"      │
│ razorpay_signature: "abcdef1234567890" │
└────────────────────────────────────────┘
                    │
                    │ Frontend sends to Backend
                    │ (NO SECRET KEY PASSED)
                    │
                    ▼
┌────────────────────────────────────────────────────────────────┐
│              BACKEND VERIFICATION (SECRET)                     │
│  ────────────────────────────────────────────────────────────  │
│                                                                │
│  1. Receive from frontend:                                    │
│     ├─ razorpay_order_id                                      │
│     ├─ razorpay_payment_id                                    │
│     └─ razorpay_signature                                     │
│                                                                │
│  2. Load secret (from .env):                                  │
│     └─ RAZORPAY_KEY_SECRET = "kfubHGuKGuzmv3mmDNybAVQs" ✅   │
│                                                                │
│  3. Create HMAC-SHA256:                                        │
│     ├─ message = order_id + "|" + payment_id                 │
│     ├─ key = RAZORPAY_KEY_SECRET                             │
│     └─ digest = HMAC-SHA256(message, key)                    │
│                                                                │
│  4. Compare:                                                   │
│     ├─ IF digest === razorpay_signature                      │
│     │  └─ ✅ PAYMENT VERIFIED - SAFE TO PROCESS             │
│     └─ ELSE                                                    │
│        └─ ❌ PAYMENT FAILED - REJECT IMMEDIATELY            │
│                                                                │
│  5. Only if verified:                                         │
│     ├─ Update booking status                                 │
│     ├─ Save payment record                                   │
│     ├─ Emit real-time events                                │
│     └─ Send response to frontend                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘

🔐 SECURITY GUARANTEES:
✅ Secret key NEVER sent to frontend
✅ Secret key NEVER in code or logs
✅ Verification happens ONLY on backend
✅ Tampering detected immediately
✅ Fraudulent payments rejected
```

---

## Real-time Update Flow (Socket.io)

```
                    USER (Browser 1)              WORKER (Browser 2)
                            │                              │
                            │ Payment Complete             │
                            │                              │
                            └──────┐ Backend ┌────────────┘
                                   │ Receives│
                                   │ Payment │
                                   ▼         │
                                  Verify    │
                                Signature   │
                                   │        │
                        ✅ VALID   │        │
                                   │        │
                    ┌──────────────▼────────▼─────────┐
                    │    Socket.io Event Emission     │
                    │ ──────────────────────────────  │
                    │ Event: "booking_confirmed"      │
                    │ Payload: {                      │
                    │   bookingId: "123",             │
                    │   transactionId: "TXN-...",     │
                    │   status: "confirmed",          │
                    │   amount: 500                   │
                    │ }                               │
                    └────┬───────────────────────┬────┘
                         │                       │
                         │ Real-time             │ Real-time
                         │ Broadcast             │ Broadcast
                         │                       │
                    ┌────▼──────────┐    ┌──────▼─────────┐
                    │  Dashboard    │    │  Notification  │
                    │  Updates      │    │  Center        │
                    │               │    │                │
                    │ Status:       │    │ "Booking       │
                    │ confirmed ✅  │    │ confirmed! ✅"  │
                    │               │    │                │
                    │ Transaction:  │    │ TXN-...        │
                    │ TXN-... ✅    │    │ Amount: ₹500   │
                    │               │    │                │
                    │ Amount: ₹500  │    │ Action:        │
                    │ Visible ✅    │    │ View Details   │
                    └───────────────┘    └────────────────┘
```

---

## Error Handling Flow

```
┌────────────────────────────────────────────────────────┐
│           ERROR HANDLING SCENARIOS                     │
└────────────────────────────────────────────────────────┘

SCENARIO 1: Worker Without UPI
────────────────────────────────
User clicks "Book Now"
    ↓
Backend checks: worker.upiId
    ↓
❌ upiId is null/empty
    ↓
Response: {
  success: false,
  code: "WORKER_NO_UPI",
  message: "⚠️ Worker payment method not configured"
}
    ↓
Frontend shows: "This worker's payment is not configured"
    ↓
Button disabled or shows error
    ↓
User tries different worker


SCENARIO 2: Invalid UPI Format
───────────────────────────────
Worker enters: "john" (invalid)
    ↓
Frontend validates: /^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/
    ↓
❌ Pattern mismatch
    ↓
Frontend shows error: "Invalid UPI format"
    ↓
Hint: "Use format like: name@upi"
    ↓
Worker corrects to: "john@okhdfcbank"
    ↓
✅ Pattern matches
    ↓
Form accepts input


SCENARIO 3: Signature Verification Failed
───────────────────────────────────────────
Payment received from Razorpay
    ↓
Backend computes signature
    ↓
❌ digest !== razorpay_signature
    ↓
Payment marked as FAILED
    ↓
Booking status NOT updated
    ↓
User informed: "Payment verification failed"
    ↓
Suggest retry or contact support


SCENARIO 4: Worker UPI Not Found
──────────────────────────────────
Payment attempt for worker
    ↓
Booking lookup: OK
    ↓
Worker lookup: OK
    ↓
Check: worker.upiId
    ↓
❌ Found: null
    ↓
Response: {
  code: "WORKER_NO_UPI",
  message: "Worker payment not configured"
}
    ↓
Payment halted
    ↓
User redirected to error
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                         │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┐
│      Client Browser (HTTPS)          │
│  https://skillserver.com             │
└────────────────┬─────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    │ ┌──────────▼─────────┐  │
    │ │  Load Balancer     │  │
    │ │  (Optional)        │  │
    │ └──────────┬─────────┘  │
    │            │            │
    ├────────────┼────────────┤
    │            │            │
    │ ┌──────────▼──────────┐ │
    │ │  Frontend Server    │ │
    │ │  (Nginx/Vite)       │ │
    │ │  Port: 443 (HTTPS)  │ │
    │ └──────────┬──────────┘ │
    │            │            │
    │ API Requests (HTTPS)    │
    │            │            │
    │ ┌──────────▼──────────┐ │
    │ │  Backend Server     │ │
    │ │  (Express.js)       │ │
    │ │  Port: 443 (HTTPS)  │ │
    │ └──────────┬──────────┘ │
    │            │            │
    │            │            │
    │ Database Queries        │
    │            │            │
    │ ┌──────────▼──────────┐ │
    │ │  MongoDB Atlas      │ │
    │ │  (Cloud Database)   │ │
    │ └─────────────────────┘ │
    │                         │
    │ ┌─────────────────────┐ │
    │ │  Redis (Optional)   │ │
    │ │  (Caching)          │ │
    │ └─────────────────────┘ │
    │                         │
    │ ┌─────────────────────┐ │
    │ │  Razorpay API       │ │
    │ │  (Payment Gateway)  │ │
    │ └─────────────────────┘ │
    │                         │
    │ ┌─────────────────────┐ │
    │ │  Email Service      │ │
    │ │  (SendGrid/AWS SES) │ │
    │ └─────────────────────┘ │
    │                         │
    │ ┌─────────────────────┐ │
    │ │  Error Logging      │ │
    │ │  (Sentry/LogRocket) │ │
    │ └─────────────────────┘ │
    │                         │
    └─────────────────────────┘
```

---

**Version:** 1.0
**Last Updated:** April 2026
**Status:** Complete Architecture
