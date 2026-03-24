import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import socketHandler from "./sockets/socketHandler.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/collection", collectionRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🆕 404 handler — catches routes that don't exist
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// 🆕 Global error handler — catches any unhandled errors
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.stack);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

socketHandler(io);
app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));