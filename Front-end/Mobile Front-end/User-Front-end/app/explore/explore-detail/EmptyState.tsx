import React from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onBack: () => void;
};

export default function EmptyState({ onBack }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Ionicons name="heart-dislike" size={64} color="#9CA3AF" />
      <Text style={{ marginTop: 16, fontSize: 20, fontWeight: "700" }}>
        No people
      </Text>
      <Text style={{ marginTop: 8, fontSize: 14, color: "#6B7280" }}>
        Try adjusting your preferences or check back later
      </Text>
      <Button
        mode="contained"
        style={{ marginTop: 24, borderRadius: 25 }}
        buttonColor="#8B5CF6"
        onPress={onBack}
      >
        Go Back
      </Button>
    </View>
  );
}
