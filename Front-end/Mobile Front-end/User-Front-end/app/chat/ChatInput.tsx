import React from "react";
import { View } from "react-native";
import { TextInput, IconButton } from "react-native-paper";

type ChatInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function ChatInput({
  value,
  onChangeText,
  onSend,
  onFocus,
  onBlur,
}: ChatInputProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: "#E5E5E5",
        backgroundColor: "#fff",
      }}
    >
      <TextInput
        mode="outlined"
        placeholder="Type a message..."
        value={value}
        onChangeText={onChangeText}
        style={{ flex: 1, marginRight: 8 }}
        multiline
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <IconButton
        icon="send"
        mode="contained"
        onPress={onSend}
        disabled={!value.trim()}
        iconColor={value.trim() ? "#fff" : "#aaa"}
        containerColor={value.trim() ? "#007AFF" : "#eee"}
      />
    </View>
  );
}
