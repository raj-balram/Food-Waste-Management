import User from "../models/User.js";
import FoodListing from "../models/FoodListing.js";
import Collection from "../models/Collection.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await FoodListing.countDocuments();
    const totalCollections = await Collection.countDocuments();

    const requested = await Collection.countDocuments({ status: "requested" });
    const approved = await Collection.countDocuments({ status: "approved" });
    const collected = await Collection.countDocuments({ status: "collected" });

    // 🆕 Breakdown by role
    const totalRestaurants = await User.countDocuments({ role: "restaurant" });
    const totalNGOs = await User.countDocuments({ role: "ngo" });
    const pendingNGOs = await User.countDocuments({ role: "ngo", isApproved: false }); // 🆕

    res.json({
      totalUsers,
      totalListings,
      totalCollections,
      totalRestaurants,  // 🆕
      totalNGOs,         // 🆕
      pendingNGOs,       // 🆕
      statusData: [
        { name: "Requested", value: requested },
        { name: "Approved", value: approved },
        { name: "Collected", value: collected },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try { // 🆕 wrapped in try/catch
    const users = await User.find().select("-password"); // 🆕 never send passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveNGO = async (req, res) => {
  try { // 🆕 wrapped in try/catch
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "ngo") { // 🆕 safety check
      return res.status(400).json({ message: "User is not an NGO" });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: "NGO approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};