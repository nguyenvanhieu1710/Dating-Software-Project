import React, { useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import ChatHeader from "./chat/ChatHeader";
import MessageBubble from "./chat/MessageBubble";
import TypingIndicator from "./chat/TypingIndicator";
import SuggestionPopup from "./chat/SuggestionPopup";
import ChatInput from "./chat/ChatInput";
import ChatMenuPopup from "./chat/ChatMenuPopup";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { messageService } from "@/services/message.service";
import { IMessage } from "@/types/message";
import { userService } from "@/services/user.service";
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

  const [messages, setMessages] = useState<IMessage[]>([]);
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
  const [inputFocused, setInputFocused] = useState(false);
  const [suggestionVisible, setSuggestionVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false); // remember user dismissed in this session
  const prevMessageRef = useRef("");
  const [menuVisible, setMenuVisible] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

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
      // console.log("matchId", matchId);
      const response = await messageService.getMessagesByMatchId(
        Number(matchId),
        {
          limit: 50,
          offset: 0,
        }
      );
      console.log("Response of getMessages:", response);
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

    // Xử lý sự kiện người khác đang gõ
    socket.on("user-typing", (payload) => {
      // payload: { match_id, user_id, is_typing }
      try {
        if (!payload) return;
        const { match_id, user_id, is_typing } = payload;
        // only care about current match
        if (String(match_id) !== String(matchId)) return;

        setTypingUsers((prev) => {
          // don't include current user
          if (user_id === currentUserId) return prev;
          if (is_typing) {
            if (prev.includes(user_id)) return prev;
            return [...prev, user_id];
          } else {
            return prev.filter((id) => id !== user_id);
          }
        });
      } catch (err) {
        console.warn("user-typing handler error", err);
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

  const handleVideoPress = () => {
    if (!otherUser || !currentUserId) return;
    router.push({
      pathname: "/video-call",
      params: {
        roomID: `room_${matchId}`,
        userID: currentUserId,
        userName: `User_${currentUserId}`,
      },
    });
  };

  const emitTyping = (isTyping: boolean) => {
    if (!socketRef.current) return;
    try {
      socketRef.current.emit("typing", {
        match_id: Number(matchId),
        is_typing: !!isTyping,
      });
    } catch (err) {
      console.warn("emitTyping error:", err);
    }
  };

  const generateSuggestionsFromMessages = (
    msgs: IMessage[],
    currentUserIdLocal: number | null
  ): string[] => {
    if (!msgs || msgs.length === 0) return [];

    // Lấy các message "received" gần nhất (không phải của tôi)
    const received = msgs.filter(
      (m) =>
        m.sender_id !== currentUserIdLocal &&
        (m as any).message_direction !== "sent"
    );
    const last =
      received[received.length - 1] ||
      received[received.length - 2] ||
      msgs[msgs.length - 1];

    const content = last?.content?.trim() || "";

    // helper
    const short = (s: string, n = 40) =>
      s.length > n ? s.slice(0, n).trim() + "..." : s;

    const lower = content.toLowerCase();
    const suggestionsOut: string[] = [];

    // If question-like content
    if (
      /[?¿]$/.test(content) ||
      /\b(what|where|how|why|when|do you|are you|can you)\b/.test(lower)
    ) {
      suggestionsOut.push("I'm good, thanks! You?");
      suggestionsOut.push("Yes, sure — tell me more.");
      suggestionsOut.push("I'll get back to you soon.");
    } else if (/\b(hi|hello|hey|yo)\b/.test(lower)) {
      suggestionsOut.push("Hey! How are you?");
      suggestionsOut.push("Hello! Nice to meet you 😊");
      suggestionsOut.push("Hi — what's up?");
    } else {
      // fallback uses parts of last message + generic replies
      const snippet = short(content, 30) || "Sounds good";
      suggestionsOut.push(`Got it — ${snippet}`);
      suggestionsOut.push("Sounds good!");
      suggestionsOut.push("Tell me more.");
    }

    // Deduplicate and limit to 3
    const unique = Array.from(new Set(suggestionsOut)).slice(0, 3);
    return unique;
  };

  useEffect(() => {
    // if (!currentUserId || suggestionVisible || suggestionDismissed) return;

    let timer: number | null = null;
    const lastMsg = messages[messages.length - 1];

    // 1️⃣ Nếu có tin nhắn mới từ người khác → chờ 6s rồi gợi ý
    if (lastMsg && lastMsg.sender_id !== currentUserId) {
      timer = setTimeout(() => {
        if (!messageText.trim() && !inputFocused) {
          const s = generateSuggestionsFromMessages(messages, currentUserId);
          setSuggestions(s);
          setSuggestionVisible(true);
        }
      }, 6000);
    }

    // 2️⃣ Nếu người dùng không gõ gì sau 10s từ khi mở chat → gợi ý
    else if (!messageText.trim() && messages.length > 0) {
      timer = setTimeout(() => {
        if (!messageText.trim() && !inputFocused) {
          const s = generateSuggestionsFromMessages(messages, currentUserId);
          setSuggestions(s);
          setSuggestionVisible(true);
        }
      }, 10000);
    }

    // 3️⃣ Nếu người dùng gõ rồi xóa hết → gợi ý sau 1s
    else if (prevMessageRef.current && !messageText.trim()) {
      timer = setTimeout(() => {
        if (!messageText.trim() && !inputFocused) {
          const s = generateSuggestionsFromMessages(messages, currentUserId);
          setSuggestions(s);
          setSuggestionVisible(true);
        }
      }, 1000);
    }

    prevMessageRef.current = messageText;
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [
    messages,
    messageText,
    inputFocused,
    currentUserId,
    suggestionVisible,
    suggestionDismissed,
  ]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", position: "relative" }}>
      <ChatHeader
        name={otherUser?.first_name || "User Name"}
        isOnline={otherUser?.is_online || false}
        lastSeen={otherUser?.last_seen}
        onVideoPress={handleVideoPress}
        onMenuPress={() => setMenuVisible(true)}
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
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 8, paddingBottom: 80 }}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      />

      {typingUsers.length > 0 && (
        <TypingIndicator name={otherUser?.first_name || "User"} />
      )}

      <SuggestionPopup
        visible={suggestionVisible && !suggestionDismissed}
        suggestions={suggestions}
        onSelect={(text) => {
          setMessageText(text);
          setSuggestionVisible(false);
        }}
        onClose={() => {
          setSuggestionVisible(false);
          setSuggestionDismissed(true);
        }}
      />

      <ChatMenuPopup
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onUnmatch={() => {
          setMenuVisible(false);
          console.log("Unmatch pressed");
        }}
        onReport={() => {
          setMenuVisible(false);
          console.log("Report pressed");
        }}
        onBlock={async () => {
          setMenuVisible(false);
          console.log("Block pressed");
          if (!currentUserId || !otherUser?.id) {
            console.error("Missing currentUserId or otherUser.id");
            return;
          }
          try {
            const result = await userService.blockUser({
              blocker_id: currentUserId, // Current user is the blocker
              blocked_id: otherUser.id, // Other user is the blocked
            });
            console.log("Block successful:", result);
            // Optionally: Show a success message or redirect
            // e.g., router.push("/matches") to go back to matches screen
          } catch (error) {
            console.error("Failed to block user:", error);
            // Optionally: Show an error message to the user
          }
        }}
      />

      <ChatInput
        value={messageText}
        onChangeText={(text) => {
          // update local text
          setMessageText(text);

          // typing logic: if not already typing, emit true
          if (!isTypingRef.current) {
            isTypingRef.current = true;
            emitTyping(true);
          }

          // reset debounce to emit false after 1500ms of inactivity
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            isTypingRef.current = false;
            emitTyping(false);
            typingTimeoutRef.current = null;
          }, 1500);
        }}
        onSend={handleSend}
        onFocus={() => setInputFocused(true)}
        onBlur={() => {
          setInputFocused(false);
          // ensure we clear typing state and emit false
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
          }
          if (isTypingRef.current) {
            isTypingRef.current = false;
            emitTyping(false);
          }
        }}
      />
    </View>
  );
}
