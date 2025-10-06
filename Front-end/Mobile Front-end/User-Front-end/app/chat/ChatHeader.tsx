import React from "react";
import { Appbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type ChatHeaderProps = {
  name: string;
  isOnline: boolean;
  lastSeen?: string;
  onCallPress?: () => void;
  onVideoPress?: () => void;
  onMenuPress?: () => void;
};

export default function ChatHeader({
  name,
  isOnline,
  lastSeen,
  onCallPress,
  onVideoPress,
  onMenuPress,
}: ChatHeaderProps) {
  const router = useRouter();

  return (
    <Appbar.Header>
      {/* Back Button */}
      <Appbar.BackAction onPress={() => router.push("/messages")} />

      {/* Title + Subtitle */}
      <Appbar.Content
        title={name}
        titleStyle={{ fontSize: 18, fontWeight: "600" }}
        subtitle={
          isOnline
            ? "Online"
            : lastSeen
            ? `Last seen ${new Date(lastSeen).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : "Offline"
        }
        subtitleStyle={{ fontSize: 13 }}
      />

      {/* Call Button */}
      <Appbar.Action
        icon={() => <Ionicons name="call" size={22} color="#8B5CF6" />}        
        onPress={onCallPress}
      />

      {/* Video Call Button */}
      <Appbar.Action
        icon={() => <Ionicons name="videocam" size={22} color="#8B5CF6" />}
        onPress={onVideoPress}
      />

      {/* More Options */}
      <Appbar.Action
        icon={() => (
          <Ionicons name="ellipsis-vertical" size={22} color="#8B5CF6" />
        )}
        onPress={onMenuPress}
      />
    </Appbar.Header>
  );
}
