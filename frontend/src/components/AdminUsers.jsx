import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast"; // 🆕

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [approvingId, setApprovingId] = useState(null); // 🆕

  const fetchUsers = async () => {
    const { data } = await API.get("/admin/users");
    setUsers(data);
  };

  const approveNGO = async (id) => {
    try {
      setApprovingId(id); // 🆕
      await API.put(`/admin/approve/${id}`);
      toast.success("NGO approved successfully! ✅"); // 🆕
      fetchUsers();
    } catch (err) {
      toast.error("Failed to approve NGO"); // 🆕
    } finally {
      setApprovingId(null); // 🆕
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const roleColor = {
    restaurant: "bg-orange-100 text-orange-700",
    ngo: "bg-blue-100 text-blue-700",
    admin: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">👥 Manage Users</h2>

      {users.length === 0 ? (
        <p className="text-gray-400 text-center py-6">No users found</p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center border border-gray-100 p-3 rounded-xl hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
                {/* 🆕 Role badge */}
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${roleColor[user.role]}`}>
                  {user.role}
                </span>
              </div>

              {user.role === "ngo" && !user.isApproved && (
                <button
                  onClick={() => approveNGO(user._id)}
                  disabled={approvingId === user._id} // 🆕
                  className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-1.5 rounded-xl text-sm font-medium transition"
                >
                  {approvingId === user._id ? "Approving..." : "Approve"} {/* 🆕 */}
                </button>
              )}

              {/* 🆕 Show approved badge */}
              {user.role === "ngo" && user.isApproved && (
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                  ✓ Approved
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;