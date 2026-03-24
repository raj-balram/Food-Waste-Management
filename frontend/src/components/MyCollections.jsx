import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { useSocket } from "../context/SocketContext"; // 🆕

const statusConfig = {
  requested: { label: "Pending Approval", color: "bg-yellow-100 text-yellow-700", icon: "⏳" },
  approved:  { label: "Approved — Ready to collect", color: "bg-blue-100 text-blue-700", icon: "✅" },
  collected: { label: "Collected", color: "bg-green-100 text-green-700", icon: "🎉" },
};

const MyCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket(); // 🆕

  const fetchCollections = useCallback(async () => {
    try {
      const { data } = await API.get("/collection/ngo");
      setCollections(data);
    } catch {
      toast.error("Failed to load collections");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  // ✅ THE FIX: when restaurant approves, NGO page updates automatically
  useEffect(() => {
    if (!socket) return;

    socket.on("statusUpdate", (data) => {
      toast("✅ " + data.message, {
        duration: 5000,
        style: {
          background: "#3b82f6",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: "600",
        },
      });
      fetchCollections(); // re-fetches → button changes from "Waiting" to "Mark Collected"
    });

    return () => socket.off("statusUpdate");
  }, [socket, fetchCollections]);

  const markCollected = async (id) => {
    try {
      await API.put(`/collection/${id}/complete`);
      toast.success("Marked as collected! 🎉");
      fetchCollections();
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
      Loading collections...
    </div>
  );

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📋 My Collection Requests</h2>

      {collections.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-4xl mb-2">📭</p>
          <p className="text-gray-500 font-medium">No collection requests yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Request pickups from nearby listings above
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((item) => {
            const cfg = statusConfig[item.status] || statusConfig.requested;
            return (
              <div
                key={item._id}
                className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-800 leading-tight flex-1 mr-2">
                    {item.listing?.title || "Listing removed"}
                  </h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${cfg.color}`}>
                    {cfg.icon} {cfg.label}
                  </span>
                </div>

                {item.listing?.quantity && (
                  <p className="text-sm text-gray-500">📦 {item.listing.quantity}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Requested: {new Date(item.createdAt).toLocaleDateString()}
                </p>

                {item.status === "approved" && (
                  <button
                    onClick={() => markCollected(item._id)}
                    className="cursor-pointer w-full mt-4 bg-green-500 hover:bg-green-600 active:scale-95 text-white py-2.5 rounded-xl text-sm font-semibold transition shadow-sm hover:shadow"
                  >
                    ✅ Mark as Collected
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCollections;