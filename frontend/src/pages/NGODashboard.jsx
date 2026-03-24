import Navbar from "../components/Navbar";
import { useEffect, useState, useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import NearbyListings from "../components/NearbyListings";
import MyCollections from "../components/MyCollections";
import API from "../services/api";
import toast from "react-hot-toast";

const NGODashboard = () => {
  const socket = useSocket();
  const [stats, setStats] = useState({ requests: 0, collected: 0 });

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await API.get("/collection/ngo");
      setStats({
        requests: data.length,
        collected: data.filter((c) => c.status === "collected").length,
      });
    } catch {}
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // 🆕 Real-time: refresh stats when status changes or new food posted
  useEffect(() => {
    if (!socket) return;
    const handler = (data) => {
      toast("🍱 " + data.message, {
        duration: 5000,
        style: { background: "#16a34a", color: "#fff", borderRadius: "12px", fontWeight: "600" },
      });
      fetchStats();
    };
    socket.on("newFood", handler);
    socket.on("statusUpdate", fetchStats);
    return () => {
      socket.off("newFood", handler);
      socket.off("statusUpdate", fetchStats);
    };
  }, [socket, fetchStats]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">NGO Dashboard</h1>
          <p className="text-gray-500 mt-1">Find and collect surplus food in your area</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Total Requests</p>
            <p className="text-4xl font-black text-green-500">{stats.requests}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Collected</p>
            <p className="text-4xl font-black text-blue-500">{stats.collected}</p>
          </div>
        </div>

        <NearbyListings />
        <MyCollections />
      </div>
    </div>
  );
};

export default NGODashboard;