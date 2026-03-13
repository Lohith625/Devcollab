const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");
const Message = require("./src/models/Message");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
//app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("DevCollab API is running...");
});

const PORT = process.env.PORT || 5000;

const authRoutes = require("./src/routes/authRoutes");

app.use("/api/auth", authRoutes);

const protect = require("./src/middleware/authMiddleware");

app.get("/api/profile", protect, (req, res) => {
  res.json(req.user);
});

const roomRoutes = require("./src/routes/roomRoutes");

app.use("/api/rooms", roomRoutes);

const snippetRoutes = require("./src/routes/snippetRoutes");

app.use("/api/snippets", snippetRoutes);

const messageRoutes = require("./src/routes/messageRoutes");

app.use("/api/messages", messageRoutes);

const codeRoutes = require("./src/routes/codeRoutes");
app.use("/api/code", codeRoutes);

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  const roomUsers = {};
  console.log("User connected:", socket.id);

  socket.on("joinRoom", ({ roomId, username }) => {

    socket.join(roomId);
  
    if (!roomUsers[roomId]) {
      roomUsers[roomId] = [];
    }
  
    roomUsers[roomId].push(username);
  
    io.to(roomId).emit("roomUsers", roomUsers[roomId]);
  
  });

  socket.on("codeChange", ({ roomId, code }) => {
    socket.to(roomId).emit("receiveCode", code);
  });

  socket.on("sendMessage", async ({ roomId, message, username, userId }) => {

    try {
  
      const newMessage = await Message.create({
        room: roomId,
        sender: null,
        username,
        message
      });
  
      io.to(roomId).emit("receiveMessage", {
        _id: newMessage._id,
        message: newMessage.message,
        username: newMessage.username,
        createdAt: newMessage.createdAt
      });
  
    } catch (error) {
      console.log("Message save error:", error);
    }
  
  });

  socket.on("disconnect", () => {

    for (const roomId in roomUsers) {
  
      roomUsers[roomId] = roomUsers[roomId].filter(
        (user) => user !== socket.username
      );
  
      io.to(roomId).emit("roomUsers", roomUsers[roomId]);
    }
  
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

