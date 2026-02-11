import mongoose from "mongoose";

const sitterSchema = new mongoose.Schema(
  {
    name: String,
    city: String,
    experience: String,
    services: [String],
    price: String,

    // 🔥 Profile fields
    bio: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },

    // 🔥 Stats
    totalBookings: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },

    // 🔴 THIS IS WHAT WAS MISSING
    availableDates: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    }, 
    
    // 🏦 Professional Bank Details
    bankDetails: {
      accountHolderName: { 
        type: String,
        trim: true
      },
      accountNumber: { 
        type: String,
        trim: true
      },
      ifscCode: { 
        type: String,
        uppercase: true,
        trim: true
      },
      bankName: { 
        type: String,
        trim: true
      },
      branchName: { 
        type: String,
        trim: true,
        default: ""
      },
      accountType: { 
        type: String,
        enum: ["savings", "current"],
        default: "savings"
      },
      verified: { 
        type: Boolean, 
        default: false 
      },
      verifiedAt: {
        type: Date
      },
      addedAt: {
        type: Date,
        default: Date.now
      },
      // Store verification documents (optional for future use)
      documents: [{
        type: { type: String }, // "cancelled_cheque", "passbook", etc.
        url: String,
        uploadedAt: { type: Date, default: Date.now }
      }]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Sitter", sitterSchema);