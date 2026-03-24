import mongoose from "mongoose";

const foodListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    quantity: {
      type: String,
      required: true,
    },

    expiryTime: {
      type: Date,
      required: true,
    },

    images: [String],

    status: {
      type: String,
      enum: ["available", "reserved", "collected", "expired"],
      default: "available",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    pickupLocation: {
      address: String,

      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [lng, lat]
          required: true,
        },
      },
    },
  },
  { timestamps: true }
);

// Geospatial index
foodListingSchema.index({ "pickupLocation.location": "2dsphere" });

export default mongoose.model("FoodListing", foodListingSchema);