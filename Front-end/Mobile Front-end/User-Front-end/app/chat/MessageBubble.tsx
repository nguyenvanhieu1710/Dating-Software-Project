import React from "react";
import { Card, Text, Avatar } from "react-native-paper";

type MessageBubbleProps = {
  content: string;
  senderName?: string;
  time: string;
  isOwnMessage: boolean;
  showAvatar?: boolean;
};

export default function MessageBubble({
  content,
  senderName,
  time,
  isOwnMessage,
  showAvatar,
}: MessageBubbleProps) {
  return (
    <Card
      mode="contained"
      style={{
        marginVertical: 4,
        alignSelf: isOwnMessage ? "flex-end" : "flex-start",
        backgroundColor: isOwnMessage ? "#007AFF" : "#F0F0F0",
        maxWidth: "75%",
        borderRadius: 16,
      }}
    >
      <Card.Content>
        {!isOwnMessage && senderName && (
          <Text variant="labelSmall" style={{ color: "#555" }}>
            {senderName}
          </Text>
        )}
        <Text
          style={{
            color: isOwnMessage ? "#fff" : "#000",
            fontSize: 15,
            marginVertical: 2,
          }}
        >
          {content}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: isOwnMessage ? "rgba(255,255,255,0.7)" : "#666",
            textAlign: "right",
          }}
        >
          {time}
        </Text>
      </Card.Content>
    </Card>
  );
}
