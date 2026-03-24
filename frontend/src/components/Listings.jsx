import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import ListingCard from "./ListingCard";
import useRealtime from "../hooks/useRealtime"; // 🆕
import LoadingSpinner from "./LoadingSpinner";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    try {
      const { data } = await API.get("/food/my");
      setListings(data);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🆕 Auto-refresh when status updates come in
  useRealtime(fetchListings, ["statusUpdate"]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  if (loading) return <LoadingSpinner text="Loading your listings..." />;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">📦 Your Listings</h2>
      {listings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-4xl mb-2">📋</p>
          <p className="text-gray-500 font-medium">No listings yet</p>
          <p className="text-gray-400 text-sm mt-1">Create your first food listing above</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} refresh={fetchListings} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Listings;