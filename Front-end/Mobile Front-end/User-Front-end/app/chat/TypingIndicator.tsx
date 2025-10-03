import React from "react";
import { Text } from "react-native-paper";

type TypingIndicatorProps = {
  name: string;
};

export default function TypingIndicator({ name }: TypingIndicatorProps) {
  return (
    <Text
      variant="bodySmall"
      style={{ paddingHorizontal: 16, paddingVertical: 8, fontStyle: "italic", color: "#666" }}
    >
      {name} is typing...
    </Text>
  );
}
