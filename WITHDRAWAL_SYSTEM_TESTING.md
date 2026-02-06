# 💳 Withdrawal System Testing Guide

## Overview
The withdrawal system consists of:
1. **Balance Calculation** - Shows available balance for withdrawal
2. **Withdrawal Request** - Creates a new withdrawal request
3. **Minimum Hold Period** - Bookings must be 3 days old to be eligible
4. **Minimum Amount** - ₹500 minimum per withdrawal

---

## 📊 How to Test the System

### Step 1: Check Browser Console (Frontend)
Open your browser DevTools (F12 → Console tab) and look for logs like:

```
🔄 Fetching balance for profile: 6977babb2b03248e1ce296ce Type: string
📊 Balance response status: 200
✅ Balance loaded: {totalEarnings: 1000, withdrawnAmount: 0, availableBalance: 1000, minWithdrawal: 500}
```

### Step 2: Check Backend Console (Terminal)
In your backend terminal (`npm run dev`), you'll see logs like:

```
📊 Balance request for sitterId: 6977babb2b03248e1ce296ce
✅ Converted to ObjectId: ObjectId("6977babb2b03248e1ce296ce")
📦 Found 2 completed paid bookings
💸 Found 0 withdrawals
💰 Balance: Total: 1000 Withdrawn: 0 Available: 1000
```

---

## 🧪 Testing Scenarios

### Scenario 1: View Balance (No Completed Bookings Yet)
**Expected Result:**
```json
{
  "totalEarnings": 0,
  "withdrawnAmount": 0,
  "availableBalance": 0,
  "minWithdrawal": 500
}
```

### Scenario 2: View Balance (With Completed Bookings)
**What you need:**
- At least 1 completed booking marked as "paid"
- Booking must be 3+ days old (to pass `HOLD_DAYS` check)

**Expected Result:**
```json
{
  "totalEarnings": 1500,
  "withdrawnAmount": 500,
  "availableBalance": 1000,
  "minWithdrawal": 500
}
```

### Scenario 3: Request Withdrawal (Success)
**Frontend Code:**
```javascript
const amount = prompt("Enter withdrawal amount");
if (amount) {
  const res = await fetch("http://localhost:5000/api/withdrawals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sitterId: profile._id,
      amount: Number(amount),
    }),
  });
  const data = await res.json();
  if (res.ok) {
    console.log("✅ Withdrawal created:", data);
  } else {
    console.error("❌ Error:", data.message);
  }
}
```

**Backend Console Output:**
```
💳 Withdrawal request: sitterId = 6977babb2b03248e1ce296ce amount = 800
✅ Withdrawal created: {
  _id: '...',
  sitterId: 6977babb2b03248e1ce296ce,
  amount: 800,
  status: 'requested',
  requestedAt: 2026-02-06T...,
  createdAt: 2026-02-06T...,
  updatedAt: 2026-02-06T...
}
```

### Scenario 4: Withdrawal Fails (Insufficient Balance)
**Frontend Prompt:** Enter `2000` when available is `1000`

**Response:**
```json
{
  "message": "Insufficient balance",
  "availableBalance": 1000,
  "requestedAmount": 2000
}
```

### Scenario 5: Withdrawal Fails (Below Minimum)
**Frontend Prompt:** Enter `300` (minimum is 500)

**Response:**
```json
{
  "message": "Minimum withdrawal is ₹500"
}
```

---

## 🐛 Debugging Tips

### If you see: "Invalid sitter ID format"
1. **Frontend:** Check that `profile._id` is being loaded:
   ```javascript
   console.log("Profile:", profile);
   console.log("Profile ID:", profile?._id, "Type:", typeof profile?._id);
   ```

2. **Backend:** The ID should be exactly 24 hex characters:
   ```
   Valid:   "6977babb2b03248e1ce296ce" ✅
   Invalid: "6977babb2b03248e1ce296" ❌ (too short)
   ```

### If you see: "Failed to calculate balance"
1. Check MongoDB connection: Backend should show "✓ MongoDB connected successfully"
2. Check if Sitter with this ID exists in database
3. Check browser console for more details (now includes error message)

### If Withdrawal Button is Disabled
The button is disabled if:
- `balance.availableBalance < balance.minWithdrawal` (less than ₹500 available)

---

## ✅ Database Queries to Verify

### Check if a Sitter exists:
```bash
# In MongoDB:
db.sitters.findOne({ _id: ObjectId("6977babb2b03248e1ce296ce") })
```

### Check Completed Bookings:
```bash
db.bookings.find({
  sitterId: ObjectId("6977babb2b03248e1ce296ce"),
  status: "completed",
  "payment.paid": true
})
```

### Check Withdrawals:
```bash
db.withdrawals.find({
  sitterId: ObjectId("6977babb2b03248e1ce296ce")
})
```

---

## 📋 Withdrawal Request Properties
```javascript
{
  _id: ObjectId,          // Unique withdrawal ID
  sitterId: ObjectId,     // Reference to Sitter
  amount: Number,         // Amount in rupees
  status: String,         // "requested" | "approved" | "rejected" | "paid"
  requestedAt: Date,      // When requested
  processedAt: Date,      // When approved/paid
  createdAt: Date,        // Auto timestamp
  updatedAt: Date         // Auto timestamp
}
```

---

## 🚀 Next Steps
1. Create some test bookings marked as "completed" with payment
2. Change their `completedAt` to 3+ days ago to pass the hold period
3. Try viewing balance - should show earnings
4. Try requesting a withdrawal
5. Monitor both console logs to ensure everything flows correctly

All detailed logs are printed to help you trace the flow!
