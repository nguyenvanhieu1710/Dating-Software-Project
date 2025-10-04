const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const routes = require("./routes/index");

// Import core modules
const {
  setupMiddleware,
  setupErrorHandler,
  setupGracefulShutdown,
  startServer,
} = require("./core");

// Import environment config
const env = require("./config/environment");

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Middleware Socket.io để auth và join room
io.use((socket, next) => {
  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined" && userId !== "null") {
    socket.userId = Number(userId);
    socket.join(`user_${socket.userId}`);
    console.log(`User ${socket.userId} joined room user_${socket.userId}`);
    next();
  } else {
    console.warn("❌ Invalid userId in handshake:", userId);
    next(new Error("Authentication error: userId required"));
  }
});

// Setup middleware
setupMiddleware(app, env);

// API routes
app.use("/api", routes);

const MessageModel = require("./app/models/messageModel");
const messageModel = new MessageModel();

// Socket.io event handlers
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id, "userId:", socket.userId);

  socket.on("join-room", ({ room }) => {
    socket.join(room);
    console.log(`👤 User ${socket.userId} joined room: ${room}`);
  });

  // Nhận sự kiện gửi tin nhắn
  socket.on("send-message", async (data) => {
    try {
      const { match_id, content, message_type, reply_to_message_id } = data;
      // console.log("Received message:", data);
      if (!match_id || !content) {
        socket.emit("error", { message: "match_id and content are required" });
        return;
      }

      // 1. Lưu vào DB
      const message = await messageModel.createMessage({
        match_id,
        sender_id: socket.userId,
        content,
        message_type: message_type || "text",
        reply_to_message_id: reply_to_message_id || null,
      });

      // 2. Emit về cho người nhận và chính sender
      // => Lấy user còn lại trong match (ví dụ query matches table hoặc truyền từ client)
      const otherUserId = await messageModel.getOtherUserFromMatch(
        match_id,
        socket.userId
      );

      // gửi cho người nhận
      io.to(`user_${otherUserId}`).emit("receive-message", message);

      // gửi lại cho chính người gửi để confirm
      socket.emit("message-sent", message);

      console.log(
        `💬 Message saved & sent: ${message.id} from ${socket.userId} to ${otherUserId}`
      );
    } catch (err) {
      console.error("Error sending message:", err);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Gửi thông báo toàn hệ thống
  socket.on("send-global-notification", (notificationData) => {
    // Kiểm tra quyền admin (thay bằng logic thực tế, ví dụ check JWT)
    // Giả sử socket.user là admin (thêm middleware auth nếu cần)
    if (true) {
      // Thay bằng: if (socket.user?.isAdmin)
      io.emit("global-notification", notificationData);
      console.log("Broadcasted notification:", notificationData);
    } else {
      socket.emit("error", { message: "Admin access required" });
    }
  });
});

// Setup error handler
setupErrorHandler(app);

// Setup graceful shutdown
setupGracefulShutdown(server);

// Start server
startServer(server, env);

// Export for testing
module.exports = { app, server };
