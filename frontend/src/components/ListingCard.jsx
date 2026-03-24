import API from "../services/api";
import toast from "react-hot-toast";

const statusConfig = {
  available: { color: "bg-green-100 text-green-700", label: "Available" },
  reserved: { color: "bg-yellow-100 text-yellow-700", label: "Reserved" },
  collected: { color: "bg-blue-100 text-blue-700", label: "Collected" },
  expired: { color: "bg-red-100 text-red-700", label: "Expired" },
};

const ListingCard = ({ listing, refresh }) => {
  const handleDelete = async () => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await API.delete(`/food/${listing._id}`);
      toast.success("Listing deleted");
      refresh();
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  const updateStatus = async (status) => {
    try {
      await API.patch(`/food/${listing._id}/status`, { status });
      toast.success(`Marked as ${status}`);
      refresh();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const cfg = statusConfig[listing.status] || statusConfig.available;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all hover:-translate-y-0.5">
      {listing.images?.[0] ? (
        <img src={listing.images[0]} alt="food" className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center text-5xl">
          🍽️
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-800 text-base leading-tight flex-1 mr-2">
            {listing.title}
          </h3>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>

        <p className="text-sm text-gray-500">📦 {listing.quantity}</p>
        <p className="text-xs text-gray-400 mt-1">
          ⏰ {new Date(listing.expiryTime).toLocaleString()}
        </p>

        <div className="flex gap-2 mt-4">
          {listing.status !== "collected" && (
            <button
              onClick={() => updateStatus("collected")}
              className="cursor-pointer flex-1 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white py-2 rounded-xl text-sm font-semibold transition"
            >
              ✅ Collected
            </button>
          )}
          <button
            onClick={handleDelete}
            className="cursor-pointer flex-1 bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 py-2 rounded-xl text-sm font-semibold transition border border-red-100"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;