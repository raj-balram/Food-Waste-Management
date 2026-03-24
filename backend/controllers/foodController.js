import FoodListing from "../models/FoodListing.js";
import Collection from "../models/Collection.js";

// ✅ CREATE LISTING (Restaurant only)
export const createListing = async (req, res) => {
  try {
    const { title, description, quantity, expiryTime, pickupLocation } =
      req.body;

    const listing = await FoodListing.create({
      title,
      description,
      quantity,
      expiryTime,
      pickupLocation,
      createdBy: req.user._id,
    });

    // 🔔 Emit notification to NGOs
    const io = req.app.get("io");

    io.to("ngo").emit("newFood", {
      message: "New food listing available",
      listing,
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL LISTINGS
export const getAllListings = async (req, res) => {
  try {
    const listings = await FoodListing.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET SINGLE LISTING
export const getListingById = async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE LISTING (only owner)
export const updateListing = async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Only creator can update
    if (listing.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await FoodListing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE LISTING
export const deleteListing = async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await listing.deleteOne();

    res.json({ message: "Listing deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE STATUS (Reserved / Collected)
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const listing = await FoodListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    listing.status = status;
    await listing.save();

    const io = req.app.get("io");

    // Notify specific user (reservedBy NGO)
    if (listing.reservedBy) {
      io.to(listing.reservedBy.toString()).emit("statusUpdate", {
        message: `Listing status updated to ${status}`,
        listing,
      });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ GET NEARBY LISTINGS (NGO)
export const getNearbyListings = async (req, res) => {
  try {
    const { lng, lat, distance = 5000 } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({
        message: "Please provide latitude and longitude",
      });
    }

    const listings = await FoodListing.find({
      status: "available",
      "pickupLocation.location": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(distance), // in meters
        },
      },
    }).populate("createdBy", "name phone address");

    const updatedListings = await Promise.all(
      listings.map(async (listing) => {
        const exists = await Collection.findOne({
          listing: listing._id,
          ngo: req.user._id,
        });

        return {
          ...listing.toObject(),
          requested: !!exists, // true or false
        };
      })
    );

    res.json(updatedListings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyListings = async (req, res) => {
  const listings = await FoodListing.find({
    createdBy: req.user._id,
  }).sort({ createdAt: -1 });

  res.json(listings);
};