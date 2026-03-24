const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // Join room based on role
    socket.on("joinRoom", ({ userId, role }) => {
      socket.join(role); // "ngo", "restaurant", "admin"
      socket.join(userId); // personal room
      console.log(`${userId} joined ${role}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

export default socketHandler;