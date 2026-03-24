import Collection from "../models/Collection.js";
import FoodListing from "../models/FoodListing.js";

// ─────────────────────────────────────────────
// NGO requests pickup
// ─────────────────────────────────────────────
export const requestCollection = async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const exists = await Collection.findOne({
      listing: listing._id,
      ngo: req.user._id,
    });

    if (exists) {
      return res.status(400).json({ message: "Already requested" });
    }

    const collection = await Collection.create({
      listing: listing._id,
      ngo: req.user._id,
      restaurant: listing.createdBy,
    });

    // ✅ FIX: Tell the specific restaurant a new request came in
    const io = req.app.get("io");
    io.to(listing.createdBy.toString()).emit("newRequest", {
      message: "An NGO has requested to pick up your food listing",
      collection,
    });

    res.json(collection);
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// Restaurant approves the request
// ─────────────────────────────────────────────
export const approveCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).populate("listing");

    if (!collection) {
      return res.status(404).json({ message: "Request not found" });
    }

    collection.status = "approved";
    await collection.save();

    collection.listing.status = "reserved";
    await collection.listing.save();

    // ✅ FIX: Tell the specific NGO their request was approved
    const io = req.app.get("io");
    io.to(collection.ngo.toString()).emit("statusUpdate", {
      message: "Your pickup request has been approved! Please collect the food.",
      collection,
    });

    res.json({ message: "Approved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// NGO marks as collected
// ─────────────────────────────────────────────
export const completeCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).populate("listing");

    if (!collection) {
      return res.status(404).json({ message: "Request not found" });
    }

    collection.status = "collected";
    await collection.save();

    if (collection.listing) {
      collection.listing.status = "collected";
      await collection.listing.save();
    }

    // ✅ FIX: Tell the restaurant their food was successfully collected
    const io = req.app.get("io");
    io.to(collection.restaurant.toString()).emit("statusUpdate", {
      message: "Food has been successfully collected by the NGO!",
      collection,
    });

    res.json({ message: "Collected successfully" });
  } catch (error) {
    console.log("COMPLETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// Get all requests for a restaurant
// ─────────────────────────────────────────────
export const getRestaurantRequests = async (req, res) => {
  try {
    const requests = await Collection.find({ restaurant: req.user._id })
      .populate("listing")
      .populate("ngo", "name email");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────
// Get all collections for an NGO
// ─────────────────────────────────────────────
export const getNgoCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ ngo: req.user._id }).populate("listing");
    return res.json(collections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};