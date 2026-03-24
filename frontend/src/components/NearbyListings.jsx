import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import useRealtime from "../hooks/useRealtime"; // 🆕

const NearbyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // useCallback so useRealtime doesn't re-register on every render
  const fetchNearby = useCallback(() => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { data } = await API.get(
            `/food/nearby?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&distance=100000`
          );
          setListings(data);
        } catch {
          toast.error("Failed to load nearby listings");
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.error("Location access denied");
        setLoading(false);
      }
    );
  }, []);

  // 🆕 Auto-refresh when new food is posted
  useRealtime(fetchNearby, ["newFood"]);

  useEffect(() => {
    fetchNearby();
  }, [fetchNearby]);

  const requestPickup = async (id) => {
    try {
      await API.post(`/collection/${id}/request`);
      toast.success("Pickup request sent! 🚚");
      fetchNearby();
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed");
    }
  };

  if (loading) return <LoadingSpinner text="Finding food near you..." />;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">📍 Nearby Food</h2>
        <button
          onClick={fetchNearby}
          className="cursor-pointer text-sm text-green-600 hover:text-green-700 font-semibold border border-green-200 hover:border-green-400 px-3 py-1.5 rounded-lg transition"
        >
          🔄 Refresh
        </button>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-5xl mb-3">🔍</p>
          <p className="text-gray-600 font-semibold text-lg">No food listings nearby</p>
          <p className="text-gray-400 text-sm mt-1">You'll be notified automatically when food becomes available</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all hover:-translate-y-0.5"
            >
              {item.images?.[0] ? (
                <img src={item.images[0]} alt="food" className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-5xl">
                  🍱
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg leading-tight">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">📦 {item.quantity}</p>
                <p className="text-xs text-gray-400 mt-1">
                  ⏰ {new Date(item.expiryTime).toLocaleString()}
                </p>
                {item.pickupLocation?.address && (
                  <p className="text-xs text-gray-400 mt-1 truncate">📍 {item.pickupLocation.address}</p>
                )}
                <button
                  disabled={item.requested}
                  onClick={() => requestPickup(item._id)}
                  className={`cursor-pointer w-full mt-4 py-2.5 rounded-xl font-semibold text-sm transition ${
                    item.requested
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 active:scale-95 text-white shadow-sm hover:shadow"
                  }`}
                >
                  {item.requested ? "✅ Already Requested" : "🚚 Request Pickup"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyListings;