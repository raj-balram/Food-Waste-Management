import { useState } from "react";
import API from "../services/api";
import MapPicker from "./MapPicker";
import toast from "react-hot-toast"; // 🆕

const FoodForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    quantity: "",
    expiryTime: "",
    address: "",
  });

  const [image, setImage] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "food_app");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/depjjbkyo/image/upload",
      { method: "POST", body: data }
    );
    const result = await res.json();
    return result.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🆕 Validation
    if (!form.title || !form.quantity || !form.expiryTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!coordinates) {
      toast.error("Please select a pickup location on the map"); // 🆕 (was alert)
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImage();
      }

      await API.post("/food", {
        title: form.title,
        description: form.description,
        quantity: form.quantity,
        expiryTime: form.expiryTime,
        images: imageUrl ? [imageUrl] : [],
        pickupLocation: {
          address: form.address,
          location: {
            type: "Point",
            coordinates: [coordinates.lng, coordinates.lat],
          },
        },
      });

      toast.success("Food listing created! NGOs have been notified. 🎉"); // 🆕 (was alert)

      if (onSuccess) 
        onSuccess();

      // 🆕 Reset form after success
      setForm({ title: "", description: "", quantity: "", expiryTime: "", address: "" });
      setImage(null);
      setCoordinates(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating listing"); // 🆕 (was alert)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-1 text-gray-800">
        📦 Create Food Listing
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        List your surplus food so nearby NGOs can collect it
      </p>

      <form onSubmit={handleSubmit}>
        {/* 🆕 Required field markers */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Food Title <span className="text-red-400">*</span>
        </label>
        <input
          placeholder="e.g. Leftover biryani — 30 portions"
          value={form.title}
          className="w-full mb-4 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantity <span className="text-red-400">*</span>
        </label>
        <input
          placeholder="e.g. 30 plates, 5 kg"
          value={form.quantity}
          className="w-full mb-4 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Best Before <span className="text-red-400">*</span>
        </label>
        <input
          type="datetime-local"
          value={form.expiryTime}
          className="w-full mb-4 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          onChange={(e) => setForm({ ...form, expiryTime: e.target.value })}
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          placeholder="Any details about food type, allergies, packaging..."
          value={form.description}
          rows={3}
          className="w-full mb-4 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pickup Address
        </label>
        <input
          placeholder="Street address, landmark..."
          value={form.address}
          className="w-full mb-4 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        {/* Image upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Food Image (optional)
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition text-sm font-medium">
            📷 Choose Image
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          {image && (
            <span className="ml-3 text-sm text-gray-500">✅ {image.name}</span>
          )}
        </div>

        {/* Map */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pin Pickup Location on Map <span className="text-red-400">*</span>
        </label>
        <MapPicker setCoordinates={setCoordinates} />

        {/* 🆕 Show selected coordinates */}
        {coordinates && (
          <p className="text-xs text-green-600 mt-1">
            ✅ Location selected: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
          </p>
        )}

        <button
          type="submit"
          className="w-full mt-5 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white p-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            "🚀 Create Listing"
          )}
        </button>
      </form>
    </div>
  );
};

export default FoodForm;