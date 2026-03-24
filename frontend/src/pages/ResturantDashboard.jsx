import Navbar from "../components/Navbar";
import FoodForm from "../components/FoodForm";
import Listings from "../components/Listings";
import Requests from "../components/Requests";
import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useSocket } from "../context/SocketContext";

const RestaurantDashboard = () => {
  const socket = useSocket();
  const [stats, setStats] = useState({ total: 0, active: 0, collected: 0 });
  const [showForm, setShowForm] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await API.get("/food/my");
      setStats({
        total: data.length,
        active: data.filter((l) => l.status === "available").length,
        collected: data.filter((l) => l.status === "collected").length,
      });
    } catch {}
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // 🆕 Real-time: refresh stats when status updates come in
  useEffect(() => {
    if (!socket) return;
    socket.on("statusUpdate", fetchStats);
    return () => socket.off("statusUpdate", fetchStats);
  }, [socket, fetchStats]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Restaurant Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your surplus food listings</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="cursor-pointer bg-green-500 hover:bg-green-600 active:scale-95 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
          >
            {showForm ? "✕ Close" : "+ New Listing"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Listings", value: stats.total, color: "text-green-500" },
            { label: "Available", value: stats.active, color: "text-blue-500" },
            { label: "Collected", value: stats.collected, color: "text-purple-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Collapsible form */}
        {showForm && (
          <div className="mb-8 animate-fadeIn">
            <FoodForm onSuccess={() => { setShowForm(false); fetchStats(); }} />
          </div>
        )}

        <div className="mb-8">
          <Listings />
        </div>

        <Requests />
      </div>
    </div>
  );
};

export default RestaurantDashboard;