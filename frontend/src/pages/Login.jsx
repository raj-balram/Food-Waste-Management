import { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast"; // 🆕

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // 🆕
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🆕 Basic validation
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true); // 🆕
      const { data } = await API.post("/auth/login", form);
      login(data);
      toast.success(`Welcome back, ${data.name}! 👋`); // 🆕
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed"); // 🆕 (was alert)
    } finally {
      setLoading(false); // 🆕
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-emerald-500 to-blue-500">
      {/* 🆕 Improved card with subtitle */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🍱 FoodSaver</h1>
          <p className="text-gray-500 text-sm mt-1">
            Connecting surplus food with those who need it
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email} // 🆕 controlled input
            className="w-full mb-4 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password} // 🆕 controlled input
            className="w-full mb-6 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* 🆕 Loading state on button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white p-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;