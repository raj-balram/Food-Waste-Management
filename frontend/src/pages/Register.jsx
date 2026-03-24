import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast"; // 🆕

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "restaurant",
  });
  const [loading, setLoading] = useState(false); // 🆕
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🆕 Basic validation
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true); // 🆕
      await API.post("/auth/register", form);
      toast.success(
        form.role === "ngo"
          ? "Registered! Waiting for admin approval."
          : "Registered successfully! Please login."
      ); // 🆕 (was alert)
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed"); // 🆕 (was alert)
    } finally {
      setLoading(false); // 🆕
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-rose-400">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🍱 FoodSaver</h1>
          <p className="text-gray-500 text-sm mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            placeholder="Your name or organization name"
            value={form.name}
            className="w-full mb-4 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            placeholder="you@example.com"
            value={form.email}
            type="email"
            className="w-full mb-4 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            className="w-full mb-4 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            I am a...
          </label>
          {/* 🆕 Better role selector with visual cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {["restaurant", "ngo"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm({ ...form, role: r })}
                className={`p-3 rounded-xl border-2 font-medium capitalize transition ${
                  form.role === r
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {r === "restaurant" ? "🍽️ Restaurant" : "🤝 NGO"}
              </button>
            ))}
          </div>

          {/* 🆕 NGO approval note */}
          {form.role === "ngo" && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2 mb-4">
              ⚠️ NGO accounts require admin approval before you can log in.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white p-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-purple-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;