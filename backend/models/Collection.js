import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodListing",
      required: true,
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["requested", "approved", "collected"],
      default: "requested",
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: Date,

    collectedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Collection", collectionSchema);