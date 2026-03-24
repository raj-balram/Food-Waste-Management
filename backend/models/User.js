import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "restaurant", "ngo"],
      required: true,
    },

    phone: String,

    address: String,

    // For location-based features (important)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },

    isApproved: {
      type: Boolean,
      default: function () {
        return this.role !== "ngo"; // NGOs need approval
      },
    },
  },
  { timestamps: true }
);

// Index for geospatial queries
userSchema.index({ location: "2dsphere" });

export default mongoose.model("User", userSchema);