import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    sitterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [500, "Minimum withdrawal is ₹500"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "processing", "completed", "rejected", "cancelled"],
      default: "pending",
    },
    
    // Payment method details
    paymentMethod: {
      type: {
        type: String,
        enum: ["bank", "upi", "paypal"],
        required: true,
      },
      // For bank transfers
      bankDetails: {
        accountHolderName: String,
        accountNumber: String,
        ifsc: String,
        bankName: String,
      },
      // For UPI
      upiId: String,
      // For PayPal
      paypalEmail: String,
    },

    // Transaction tracking
    transactionId: String, // From payment gateway
    processingNotes: String, // Admin notes during processing
    
    // Rejection details
    rejectionReason: String,
    rejectedAt: Date,
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Completion details
    completedAt: Date,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Cancellation
    cancelledAt: Date,
    cancellationReason: String,

    // Timestamps for each status change
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        notes: String,
      },
    ],

    // Metadata
    ipAddress: String,
    userAgent: String,
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
withdrawalSchema.index({ sitterId: 1, status: 1 });
withdrawalSchema.index({ createdAt: -1 });
withdrawalSchema.index({ status: 1, createdAt: -1 });

// Virtual for days pending
withdrawalSchema.virtual("daysPending").get(function () {
  if (this.status !== "pending") return 0;
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Add status to history before saving
withdrawalSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  next();
});

export default mongoose.model("Withdrawal", withdrawalSchema);