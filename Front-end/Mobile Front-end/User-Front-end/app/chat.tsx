import React, { useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";
import ChatHeader from "./chat/ChatHeader";
import MessageBubble from "./chat/MessageBubble";
import TypingIndicator from "./chat/TypingIndicator";
import ChatInput from "./chat/ChatInput";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messageService, {
  Message as ApiMessage,
} from "@/services/messageService";
import {
  getOtherUserProfile,
  getOtherUserProfileFromMatch,
  getCurrentUserId,
} from "@/services/userApi";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export default function ChatScreen() {
  const { matchId } = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [otherUser, setOtherUser] = useState<{
    id: number;
    first_name: string;
    is_online: boolean;
    last_seen?: string;
  } | null>(null);
  const [typingUsers, setTypingUsers] = useState<number[]>([]);
  let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const userJson = await AsyncStorage.getItem("user_data");
      // console.log("userJson: ", userJson);
      if (userJson) {
        const user = JSON.parse(userJson);
        setCurrentUserId(user.id);
      }
    };
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (matchId && currentUserId) {
      loadMessages();
      loadOtherUserProfile();
    }
  }, [matchId, currentUserId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await messageService.getMessages(Number(matchId), {
        limit: 50,
        offset: 0,
      });
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadOtherUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await getOtherUserProfileFromMatch(Number(matchId));
      // console.log("otherUser profile: ", profile);
      setOtherUser(profile);
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  useEffect(() => {
    if (!currentUserId) return;
    console.log("ChatScreen rendered at:", new Date().toISOString());
    const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
      query: { userId: currentUserId.toString() },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
      socket.emit("join-room", { room: `user_${currentUserId}` });
    });

    // Chỉ xử lý tin nhắn từ người khác (người nhận)
    socket.on("receive-message", (msg) => {
      console.log("📩 Received message from other user:", msg);
      console.log(
        "Current matchId:",
        matchId,
        "Message match_id:",
        msg.match_id
      );

      if (msg.match_id == matchId || msg.match_id === Number(matchId)) {
        const enrichedMsg = {
          ...msg,
          sender: { first_name: otherUser?.first_name || "User" },
        };
        console.log("✅ Adding received message to state:", enrichedMsg);
        setMessages((prev) => {
          // Kiểm tra duplicate dựa trên id và sent_at
          const isDuplicate = prev.some(
            (existingMsg) =>
              existingMsg.id === msg.id && existingMsg.sent_at === msg.sent_at
          );
          if (isDuplicate) {
            console.log("⚠️ Duplicate message detected, skipping");
            return prev;
          }
          return [...prev, enrichedMsg];
        });
        scrollToBottom();
      }
    });

    // Xử lý tin nhắn của chính mình (người gửi)
    socket.on("message-sent", (msg) => {
      console.log("✅ My message saved to DB:", msg);
      console.log(
        "Current matchId:",
        matchId,
        "Message match_id:",
        msg.match_id
      );

      if (msg.match_id == matchId || msg.match_id === Number(matchId)) {
        const enrichedMsg = {
          ...msg,
          sender: { first_name: "You" },
        };
        console.log("✅ Adding my sent message to state:", enrichedMsg);
        setMessages((prev) => {
          // Kiểm tra duplicate
          const isDuplicate = prev.some(
            (existingMsg) =>
              existingMsg.id === msg.id && existingMsg.sent_at === msg.sent_at
          );
          if (isDuplicate) {
            console.log("⚠️ Duplicate sent message detected, skipping");
            return prev;
          }
          return [...prev, enrichedMsg];
        });
        scrollToBottom();
      }
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    socket.on("error", (err) => {
      console.error("❌ Socket server error:", err);
    });

    return () => {
      console.log("ChatScreen unmounted at:", new Date().toISOString());
      socket.off("receive-message");
      socket.off("connect");
      socket.off("connect_error");
      socket.off("error");
      socket.disconnect();
      socketRef.current = null;
      console.log("🔌 Socket disconnected");
    };
  }, [currentUserId, process.env.EXPO_PUBLIC_SOCKET_URL]);

  const handleSend = async () => {
    if (!messageText.trim() || !currentUserId || !matchId || !socketRef.current)
      return;

    const newMessage = {
      match_id: Number(matchId),
      sender_id: currentUserId,
      content: messageText,
      message_type: "text",
    };

    setMessageText("");
    scrollToBottom();

    try {
      console.log("🚀 Sending message:", newMessage);
      // Chỉ emit tin nhắn, việc hiển thị sẽ được xử lý trong useEffect khi nhận message-sent
      socketRef.current.emit("send-message", newMessage);
    } catch (err) {
      console.error("❌ Failed to send:", err);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  return (
    <>
      <ChatHeader
        name={otherUser?.first_name || "User Name"}
        isOnline={otherUser?.is_online || false}
        lastSeen={otherUser?.last_seen}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <MessageBubble
            content={item.content}
            senderName={
              item.sender?.first_name ||
              (item.sender_id === currentUserId
                ? "You"
                : otherUser?.first_name || "User")
            }
            time={
              item.sent_at
                ? new Date(item.sent_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""
            }
            isOwnMessage={item.sender_id === currentUserId}
          />
        )}
        keyExtractor={(item) => `${item.id}_${item.sent_at}`}
        contentContainerStyle={{ padding: 8 }}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
        style={{
          backgroundColor: "#fff",
        }}
      />

      {typingUsers.length > 0 && (
        <TypingIndicator name={otherUser?.first_name || "User"} />
      )}

      <ChatInput
        value={messageText}
        onChangeText={setMessageText}
        onSend={handleSend}
      />
    </>
  );
}
