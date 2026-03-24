import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { useSocket } from "../context/SocketContext"; // 🆕 direct socket

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const socket = useSocket(); // 🆕

  const fetchRequests = useCallback(async () => {
    try {
      const { data } = await API.get("/collection");
      setRequests(data);
    } catch {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // ✅ THE FIX: listen for newRequest + statusUpdate events from backend
  useEffect(() => {
    if (!socket) return;

    // When NGO requests a pickup → auto-refresh restaurant's list
    socket.on("newRequest", (data) => {
      toast("📬 " + data.message, {
        duration: 5000,
        style: {
          background: "#3b82f6",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: "600",
        },
      });
      fetchRequests(); // pulls the new request from DB immediately
    });

    // When NGO marks collected → refresh so status changes on screen
    socket.on("statusUpdate", (data) => {
      toast("✅ " + data.message, {
        duration: 4000,
        style: {
          background: "#16a34a",
          color: "#fff",
          borderRadius: "12px",
          fontWeight: "600",
        },
      });
      fetchRequests();
    });

    return () => {
      socket.off("newRequest");
      socket.off("statusUpdate");
    };
  }, [socket, fetchRequests]);

  const approveRequest = async (id) => {
    try {
      setApprovingId(id);
      await API.put(`/collection/${id}/approve`);
      toast.success("Pickup approved! NGO has been notified 🎉");
      fetchRequests();
    } catch {
      toast.error("Failed to approve request");
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
      Loading requests...
    </div>
  );

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📬 Pickup Requests</h2>

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-4xl mb-2">📭</p>
          <p className="text-gray-500 font-medium">No pickup requests yet</p>
          <p className="text-gray-400 text-sm mt-1">
            NGOs will request pickups when you list food
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all"
            >
              <h3 className="font-bold text-gray-800 mb-1">
                {req.listing?.title || "—"}
              </h3>
              <p className="text-sm text-gray-500">🤝 {req.ngo?.name}</p>
              <p className="text-xs text-gray-400">{req.ngo?.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(req.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-4">
                {req.status === "requested" ? (
                  <button
                    onClick={() => approveRequest(req._id)}
                    disabled={approvingId === req._id}
                    className="cursor-pointer w-full bg-blue-500 hover:bg-blue-600 active:scale-95 disabled:bg-blue-300 text-white py-2.5 rounded-xl text-sm font-semibold transition"
                  >
                    {approvingId === req._id ? "Approving..." : "✅ Approve"}
                  </button>
                ) : req.status === "approved" ? (
                  <span className="flex items-center justify-center w-full py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl">
                    ✅ Approved — Awaiting Collection
                  </span>
                ) : (
                  <span className="flex items-center justify-center w-full py-2 text-sm font-semibold text-green-600 bg-green-50 rounded-xl">
                    🎉 Collected
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;