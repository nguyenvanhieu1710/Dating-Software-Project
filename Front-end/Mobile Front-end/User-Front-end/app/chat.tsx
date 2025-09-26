import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useSocket } from "../hooks/useSocket";
import messageService, {
  Message as ApiMessage,
} from "@/services/messageService";
import { getOtherUserProfile } from "@/services/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Match {
  id: number;
  user1_id: number;
  user2_id: number;
  other_user: {
    id: number;
    first_name: string;
    gender: string;
  };
}

const ChatScreen: React.FC = () => {
  const { matchId } = useLocalSearchParams();
  const router = useRouter();

  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<number[]>([]);
  const [messageText, setMessageText] = useState("");
  const [otherUser, setOtherUser] = useState<{
    id: number;
    first_name: string;
    is_online: boolean;
    last_seen?: string;
  } | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Socket hook
  const {
    socket,
    isConnected,
    connect,
    disconnect,
    joinMatch,
    leaveMatch,
    sendMessage: socketSendMessage,
    startTyping,
    stopTyping,
    onNewMessage,
    onUserTyping,
    onUserStopTyping,
  } = useSocket();

  // Initialize socket connection when component mounts
//   useEffect(() => {
//     let isMounted = true;
//     let retryTimeout: ReturnType<typeof setTimeout> | null = null;
//     const initSocket = async () => {
//       try {
//         // Get auth token before connecting
//         const token = await AsyncStorage.getItem("auth_token");
//         console.log(
//           "🔑 Token from AsyncStorage: ",
//           token ? "Found" : "Not found"
//         );

//         if (!token) {
//           console.warn(
//             "❌ No authentication token found. Please log in first."
//           );
//           return;
//         }

//         console.log("🔄 Attempting to connect to WebSocket...");
//         await connect();
//         console.log(
//           "✅ WebSocket connect() called, checking connection status..."
//         );

//         // Log socket connection status
//         if (socket) {
//           console.log(
//             `🔌 Socket connected: ${socket.connected ? "✅ Yes" : "❌ No"}`
//           );
//           console.log(`🔌 Socket ID: ${socket.id || "None"}`);
//           console.log(
//             `🔌 Socket authenticated: ${socket.connected ? "✅ Yes" : "❌ No"}`
//           );
//         } else {
//           console.warn("❌ Socket instance is null after connect()");
//         }
//       } catch (error) {
//         console.error("❌ Failed to connect socket:", error);
//         // Retry after delay
//         if (isMounted) {
//           retryTimeout = setTimeout(initSocket, 5000);
//         }
//       }
//     };

//     initSocket();
//     return () => {
//       isMounted = false;
//       if (retryTimeout) clearTimeout(retryTimeout);
//       if (socket?.connected) {
//         console.log('🧹 Cleaning up WebSocket connection');
//         disconnect();
//       }
//     };
//   }, [connect, disconnect, socket]);

  // Handle WebSocket events for the current match
//   useEffect(() => {
//     if (!socket) {
//       console.warn("❌ Socket is not initialized");
//       return;
//     }

//     if (!matchId) {
//       console.warn("❌ matchId is not set");
//       return;
//     }

//     if (!currentUserId) {
//       console.warn("❌ currentUserId is not set");
//       return;
//     }

//     console.log("🔵 Setting up WebSocket for match:", matchId);
//     const matchIdNum = Number(matchId);

//     // Log socket connection status
//     console.log(
//       `🔌 Socket connected before join: ${
//         socket.connected ? "✅ Yes" : "❌ No"
//       }`
//     );

//     // Join the match room
//     console.log(`🚪 Joining match room: ${matchIdNum}`);
//     joinMatch(matchIdNum);

//     // Log when join is complete
//     socket.on("join_match_ack", (data) => {
//       console.log("✅ Successfully joined match room:", data);
//     });

//     // Handle incoming messages
//     const handleNewMessage = (message: any) => {
//       console.log("📨 Received message:", {
//         messageId: message.id,
//         matchId: message.match_id,
//         senderId: message.sender_id,
//         contentPreview:
//           message.content?.substring(0, 30) +
//           (message.content?.length > 30 ? "..." : ""),
//       });

//       if (message.match_id !== matchIdNum) {
//         console.warn(
//           `⚠️ Ignoring message for different match (expected ${matchIdNum}, got ${message.match_id})`
//         );
//         return;
//       }

//       const newMessage: ApiMessage = {
//         id: message.id,
//         match_id: matchIdNum,
//         sender_id: message.sender_id,
//         content: message.content,
//         message_type: message.message_type || "text",
//         sent_at: message.sent_at || new Date().toISOString(),
//         read_at: message.read_at || null,
//         deleted_at: null,
//         first_name: message.sender?.first_name || "User",
//         dob: "",
//         gender: message.sender?.gender || "other",
//         message_direction:
//           message.sender_id === currentUserId ? "sent" : "received",
//         sender: {
//           id: message.sender_id,
//           first_name: message.sender?.first_name || "User",
//           avatar_url: message.sender?.avatar_url,
//         },
//       };

//       setMessages((prev) => [...prev, newMessage]);
//       scrollToBottom();
//     };

//     // Handle typing indicators
//     const handleUserTyping = (data: { userId: number; matchId: number }) => {
//       if (data.matchId === matchIdNum && data.userId !== currentUserId) {
//         setTypingUsers((prev) =>
//           prev.includes(data.userId) ? prev : [...prev, data.userId]
//         );
//       }
//     };

//     const handleUserStopTyping = (data: {
//       userId: number;
//       matchId: number;
//     }) => {
//       if (data.matchId === matchIdNum) {
//         setTypingUsers((prev) => prev.filter((id) => id !== data.userId));
//       }
//     };

//     // Register event listeners
//     onNewMessage(handleNewMessage);
//     onUserTyping(handleUserTyping);
//     onUserStopTyping(handleUserStopTyping);

//     // Cleanup
//     return () => {
//       console.log("Cleaning up WebSocket for match:", matchId);
//       leaveMatch();
//     };
//   }, [
//     socket,
//     matchId,
//     currentUserId,
//     joinMatch,
//     leaveMatch,
//     onNewMessage,
//     onUserTyping,
//     onUserStopTyping,
//   ]);

  // Load current user ID
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user_data");
        if (userJson) {
          const user = JSON.parse(userJson);
          setCurrentUserId(user.id);
        }
      } catch (error) {
        console.error("Failed to load current user:", error);
      }
    };

    loadCurrentUser();
  }, []);

  // Load initial data
  useEffect(() => {
    if (matchId && currentUserId) {
      loadMessages();
      loadOtherUserProfile();
    }
  }, [matchId, currentUserId]);

  const handleBack = () => {
    router.push("/messages");
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const matchIdNum =
        typeof matchId === "string"
          ? parseInt(matchId.replace("match_", ""), 10)
          : Number(matchId);
      // console.log("matchIdNum: ", matchIdNum);
      const response = await messageService.getMessages(matchIdNum, {
        limit: 50,
        offset: 0,
      });
      console.log("Response of getMessages: ", response);
      // Use the data property from the response which contains the messages array
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to load messages:", error);
      Alert.alert("Error", "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const loadOtherUserProfile = async () => {
    try {
      setLoading(true);
      // Get the other user's ID from the match data or messages
      let otherUserId = match?.other_user?.id;
      console.log("otherUserId: ", otherUserId);

      // If we don't have the other user ID from match, try to get it from messages
      if (!otherUserId && messages.length > 0) {
        const otherUserMessage = messages.find(
          (msg) => msg.sender_id !== currentUserId
        );
        if (otherUserMessage) {
          otherUserId = otherUserMessage.sender_id;
        }
      }

      console.log("otherUserId: ", otherUserId);

      if (otherUserId) {
        const profile = await getOtherUserProfile(otherUserId);
        setOtherUser({
          id: profile.id,
          first_name: profile.first_name || "User",
          is_online: profile.is_online || false,
          last_seen: profile.last_seen,
        });
      }
    } catch (error) {
      console.error("Failed to load other user profile:", error);
      // Set a default user if we can't load the profile
      setOtherUser({
        id: 0,
        first_name: "User",
        is_online: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMessages();
    setRefreshing(false);
  };

  const handleSendMessage = async (
    content: string,
    messageType: "text" | "image" = "text"
  ) => {
    if (!content.trim()) return;

    const matchIdNum =
      typeof matchId === "string"
        ? parseInt(matchId.replace("match_", ""), 10)
        : Number(matchId);
    const newMessage: ApiMessage = {
      id: Date.now(), // Temporary ID, will be replaced by server
      content,
      message_type: messageType,
      message_direction: "sent",
      sender_id: currentUserId || 0,
      match_id: matchIdNum,
      sent_at: new Date().toISOString(),
      read_at: null, // Message is unread initially
      deleted_at: null,
      first_name: "You",
      dob: "",
      gender: "",
    };

    try {
      // Message object already created above

      // Optimistic update
      setMessages((prev) => [...prev, newMessage]);
      setMessageText("");
      scrollToBottom();

      // Send message to server
      if (messageType === "text") {
        await messageService.sendTextMessage(matchIdNum, content);
      } else if (messageType === "image") {
        await messageService.sendImageMessage(matchIdNum, content);
      }

      // Refresh messages to get the actual message from server
      await loadMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
      Alert.alert("Error", "Failed to send message");
      // Remove the optimistic update if there was an error
      setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
    }
  };

  const handleTypingStart = () => {
    startTyping();
    setIsTyping(true);
  };

  const handleTypingStop = () => {
    stopTyping();
    setIsTyping(false);
  };

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleMessageLongPress = (messageId: number) => {
    Alert.alert("Message Options", "What would you like to do?", [
      { text: "Copy", onPress: () => copyMessage(messageId) },
      {
        text: "Delete",
        onPress: () => deleteMessage(messageId),
        style: "destructive",
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const copyMessage = (messageId: number) => {
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      // Implement copy to clipboard
      Alert.alert("Copied", "Message copied to clipboard");
    }
  };

  const deleteMessage = async (messageId: number) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        }
      );

      if (response.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      } else {
        throw new Error("Failed to delete message");
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      Alert.alert("Error", "Failed to delete message");
    }
  };

  const getAuthToken = async () => {
    // Get token from AsyncStorage
    return "your-auth-token";
  };

  const renderMessage = ({ item }: { item: ApiMessage }) => {
    const isOwnMessage = item.sender_id === currentUserId;
    const messageTime = new Date(item.sent_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        {!isOwnMessage && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {match?.other_user.first_name?.charAt(0) || "U"}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownBubble : styles.otherBubble,
          ]}
        >
          {!isOwnMessage && (
            <Text style={styles.senderName}>
              {match?.other_user.first_name || "User"}
            </Text>
          )}
          <Text
            style={[styles.messageText, isOwnMessage && styles.ownMessageText]}
          >
            {item.content}
          </Text>
          <Text
            style={[styles.messageTime, isOwnMessage && styles.ownMessageTime]}
          >
            {messageTime}
          </Text>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (typingUsers.length > 0) {
      return (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>
            {match?.other_user.first_name} is typing...
          </Text>
        </View>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => handleBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            {otherUser?.first_name || match?.other_user.first_name || "User"}
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: otherUser?.is_online ? "#4CAF50" : "#666" },
            ]}
          >
            {otherUser?.is_online
              ? "Online"
              : otherUser?.last_seen
              ? `Last seen ${new Date(
                  otherUser.last_seen
                ).toLocaleTimeString()}`
              : "Offline"}
          </Text>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => `${item.id}_${item.sent_at}`}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      />

      {/* Typing Indicator */}
      {renderTypingIndicator()}

      {/* Chat Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={messageText}
          onChangeText={setMessageText}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !messageText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={() => handleSendMessage(messageText, "text")}
          disabled={!messageText.trim()}
        >
          <Ionicons
            name="send"
            size={24}
            color={messageText.trim() ? "#007AFF" : "#999"}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    backgroundColor: "#fff",
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  moreButton: {
    marginLeft: 12,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: 8,
  },
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  ownMessage: {
    justifyContent: "flex-end",
  },
  otherMessage: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "#666",
    fontWeight: "600",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  ownBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#F0F0F0",
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  ownMessageText: {
    color: "#fff",
  },
  messageTime: {
    fontSize: 10,
    color: "#999",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  ownMessageTime: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatScreen;
