import { useAuth } from "../context/AuthContext";
import RestaurantDashboard from "../pages/ResturantDashboard";
import NGODashboard from "../pages/NGODashboard";
import AdminDashboard from "../pages/AdminDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  if (user.role === "restaurant") return <RestaurantDashboard />;
  if (user.role === "ngo") return <NGODashboard />;
  if (user.role === "admin") return <AdminDashboard />;

  return <div>Invalid role</div>;
};

export default Dashboard;