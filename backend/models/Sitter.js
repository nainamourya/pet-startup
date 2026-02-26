import mongoose from "mongoose";

const sitterSchema = new mongoose.Schema(
  {
    // 👤 Basic Information
    name: {
      type: String,
      default: "",
      trim: true
    },
    city: {
      type: String,
      default: "",
      trim: true
    },
    experience: {
      type: String,
      default: ""
    },
    services: {
      type: [String],
      default: []
    },
    price: {
      dayCare: { type: Number, default: 0 },
      walking30: { type: Number, default: 0 },
      walking60: { type: Number, default: 0 },
      boarding: { type: Number, default: 0 },
      hourly: { type: Number, default: 0 }
    },

    // 🏠 Address & Location
    address: {
      type: String,
      trim: true,
      default: ""
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [0, 0]
      }
    },

    // 🔥 Profile fields
    bio: {
      type: String,
      default: ""
    },
    photo: {
      type: String,
      default: ""
    },
    homePhoto: {
      type: String,
      default: ""
    },

    // 🆔 Identity Verification
    aadhaarNumber: {
      type: String,
      trim: true,
      default: ""
    },
    panNumber: {
      type: String,
      uppercase: true,
      trim: true,
      default: ""
    },

    // 🔥 Stats
    totalBookings: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    verified: {
      type: Boolean,
      default: false
    },

    // 📅 Availability
    availableDates: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    },

    // 🏦 Professional Bank Details
    bankDetails: {
      accountHolderName: {
        type: String,
        trim: true,
        default: ""
      },
      accountNumber: {
        type: String,
        trim: true,
        default: ""
      },
      ifscCode: {
        type: String,
        uppercase: true,
        trim: true,
        default: ""
      },
      bankName: {
        type: String,
        trim: true,
        default: ""
      },
      branchName: {
        type: String,
        trim: true,
        default: ""
      },
      accountType: {
        type: String,
        enum: ["savings", "current", ""],
        default: ""
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
        type: {
          type: String,
          enum: ["cancelled_cheque", "passbook", "bank_statement", ""]
        },
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }],
      balance: {
        type: Number,
        default: 0
      },
      totalEarnings: {
        type: Number,
        default: 0
      },
      totalWithdrawn: {
        type: Number,
        default: 0
      },
    }

  },

  {
    timestamps: true
  }
);

// 🗺️ Geospatial index for location-based queries
sitterSchema.index({ location: "2dsphere" });

// 📍 Index for city searches
sitterSchema.index({ city: 1 });

// ✅ Index for active sitters
sitterSchema.index({ isActive: 1 });

// ⭐ Index for ratings
sitterSchema.index({ averageRating: -1 });

export default mongoose.model("Sitter", sitterSchema);