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
import { getOtherUserProfile } from "@/services/userApi";

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

  useEffect(() => {
    const loadCurrentUser = async () => {
      const userJson = await AsyncStorage.getItem("user_data");
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
      const profile = await getOtherUserProfile(6); // fake id for now
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

  const handleSend = async () => {
    if (!messageText.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        match_id: Number(matchId),
        sender_id: currentUserId || 0,
        content: messageText,
        message_type: "text",
        message_direction: "sent",
        sent_at: new Date().toISOString(),
        read_at: null,
        deleted_at: null,
        first_name: "You",
        dob: "",
        gender: "",
      },
    ]);
    setMessageText("");
    scrollToBottom();
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
            senderName={item.sender?.first_name}
            time={new Date(item.sent_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            isOwnMessage={item.sender_id === currentUserId}
          />
        )}
        keyExtractor={(item) => `${item.id}_${item.sent_at}`}
        contentContainerStyle={{ padding: 8 }}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
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
