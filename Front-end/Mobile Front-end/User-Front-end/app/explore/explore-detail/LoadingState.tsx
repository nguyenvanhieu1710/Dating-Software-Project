import React from "react";
import { View } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";

export default function LoadingState() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator animating color="#8B5CF6" size="large" />
      <Text style={{ marginTop: 16 }}>Finding people for you...</Text>
    </View>
  );
}
