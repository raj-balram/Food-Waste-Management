import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // 🆕

const roleBadge = {
  restaurant: { label: "Restaurant", color: "bg-orange-100 text-orange-700" },
  ngo: { label: "NGO", color: "bg-blue-100 text-blue-700" },
  admin: { label: "Admin", color: "bg-red-100 text-red-700" },
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully"); // 🆕
    navigate("/");
  };

  const badge = roleBadge[user?.role];

  return (
    <div className="bg-white shadow-sm border-b border-gray-100 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🍱</span>
        <span className="text-lg font-bold text-green-600 hidden sm:block">
          FoodSaver
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* 🆕 Role badge */}
        {badge && (
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.color}`}>
            {badge.label}
          </span>
        )}

        {/* User name */}
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {user?.name}
        </span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;