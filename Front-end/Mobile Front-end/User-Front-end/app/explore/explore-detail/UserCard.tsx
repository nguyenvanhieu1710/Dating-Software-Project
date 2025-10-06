import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  photo: string;
  name: string;
  age: number;
  bio: string;
  distance: string;
  onPressDetail: () => void;
};

export default function UserCard({ photo, name, age, bio, distance, onPressDetail }: Props) {
  return (
    <View style={{ borderRadius: 20, overflow: "hidden", position: "relative" }}>
      <Image
        source={{ uri: photo }}
        style={{ width: "100%", height: 500 }}
      />

      {/* Overlay thông tin */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Ionicons name="location" size={14} color="#fff" />
          <Text style={{ color: "#fff", marginLeft: 6 }}>{distance}</Text>
        </View>

        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
          {name}, {age}
        </Text>
        <Text style={{ color: "#fff", fontSize: 14 }} numberOfLines={2}>
          {bio}
        </Text>
      </View>

      <TouchableOpacity
        style={{
          position: "absolute",
          right: 16,
          bottom: 80,
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: 25,
          padding: 10,
        }}
        onPress={onPressDetail}
      >
        <Ionicons name="information-circle" size={28} color="#8B5CF6" />
      </TouchableOpacity>
    </View>
  );
}
