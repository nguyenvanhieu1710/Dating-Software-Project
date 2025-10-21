const socketIo = require("socket.io");
const MessageModel = require("../app/models/messageModel");
const NotificationModel = require("../app/models/notificationModel");

const messageModel = new MessageModel();
const notificationModel = new NotificationModel();

function initSocket(server) {
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

  // Middleware auth
  io.use((socket, next) => {
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined" && userId !== "null") {
      socket.userId = Number(userId);
      socket.join(`user_${socket.userId}`);
      console.log(`User ${socket.userId} joined room user_${socket.userId}`);
      next();
    } else {
      next(new Error("Authentication error: userId required"));
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id, "userId:", socket.userId);

    socket.on("join-room", ({ room }) => {
      socket.join(room);
      console.log(`👤 User ${socket.userId} joined room: ${room}`);
    });

    // Chat events
    socket.on("send-message", async (data) => {
      try {
        const { match_id, content, message_type, reply_to_message_id } = data;
        if (!match_id || !content) {
          socket.emit("error", {
            message: "match_id and content are required",
          });
          return;
        }

        const message = await messageModel.createMessage({
          match_id,
          sender_id: socket.userId,
          content,
          message_type: message_type || "text",
          reply_to_message_id: reply_to_message_id || null,
        });

        const otherUserId = await messageModel.getOtherUserFromMatch(
          match_id,
          socket.userId
        );

        io.to(`user_${otherUserId}`).emit("receive-message", message);
        socket.emit("message-sent", message);
      } catch (err) {
        console.error("Error sending message:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Typing events
    socket.on("typing", async (data) => {
      try {
        const { match_id, is_typing } = data;
        if (!match_id) return;

        // get the other user in the match
        const otherUserId = await messageModel.getOtherUserFromMatch(
          match_id,
          socket.userId
        );

        // emit to the other user(s) in that match
        io.to(`user_${otherUserId}`).emit("user-typing", {
          match_id,
          user_id: socket.userId,
          is_typing: !!is_typing,
        });
      } catch (err) {
        console.error("Error handling typing event:", err);
      }
    });

    // Notification events
    socket.on("send-global-notification", async (notificationData) => {
      try {
        io.emit("receive-notification", notificationData);
        socket.emit("notification-sent", notificationData);
      } catch (err) {
        console.error("Error sending notification:", err);
        socket.emit("error", { message: "Failed to send notification" });
      }
    });

    // Like notification events
    socket.on("send-like-notification", async (notificationData) => {
      try {
        const {
          swiper_user_id,
          swiped_user_id,
          title,
          body,
          data,
          sent_at,
          created_at,
        } = notificationData;

        if (!swiper_user_id || !swiped_user_id || !title || !body) {
          socket.emit("error", {
            message: "Required fields missing for like notification",
          });
          return;
        }

        if (socket.userId !== swiper_user_id) {
          socket.emit("error", {
            message: "Unauthorized to send notification",
          });
          return;
        }

        const notification = await notificationModel.create({
          user_id: swiped_user_id,
          title,
          body,
          data: data || null,
          sent_at: sent_at || new Date().toISOString(),
          read_at: null,
          created_at: created_at || new Date().toISOString(),
        });

        io.to(`user_${swiped_user_id}`).emit(
          "receive-notification",
          notification
        );
        console.log(
          `📢 Sent like notification to user_${swiped_user_id}:`,
          notification
        );

        socket.emit("notification-sent", notification);
      } catch (err) {
        console.error("Error sending like notification:", err);
        socket.emit("error", { message: "Failed to send like notification" });
      }
    });
  });

  return io;
}

module.exports = { initSocket };
