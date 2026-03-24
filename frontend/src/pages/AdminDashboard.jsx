import { useEffect, useState } from "react";
import API from "../services/api";
import AdminStats from "../components/AdminStats";
import AdminUsers from "../components/AdminUsers";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/admin/stats");
      setStats(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LoadingSpinner text="Loading admin data..." />
    </div>
  );

  const cards = [
    { label: "Total Users", value: stats?.totalUsers, color: "text-blue-500" },
    { label: "Restaurants", value: stats?.totalRestaurants, color: "text-orange-500" },
    { label: "NGOs", value: stats?.totalNGOs, color: "text-green-500" },
    { label: "Pending NGOs", value: stats?.pendingNGOs, color: "text-red-500" },
    { label: "Total Listings", value: stats?.totalListings, color: "text-purple-500" },
    { label: "Collections", value: stats?.totalCollections, color: "text-teal-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Full platform overview and management</p>
        </div>

        {/* Stats grid - 3 cols on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {cards.map((c) => (
            <div key={c.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{c.label}</p>
              <p className={`text-4xl font-black ${c.color}`}>{c.value ?? 0}</p>
            </div>
          ))}
        </div>

        {/* Chart + Users side by side */}
        <div className="grid md:grid-cols-2 gap-6">
          <AdminStats />
          <AdminUsers />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;