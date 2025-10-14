import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ChatMenuPopupProps = {
  visible: boolean;
  onClose: () => void;
  onUnmatch?: () => void;
  onReport?: () => void;
  onBlock?: () => void;
};

export default function ChatMenuPopup({
  visible,
  onClose,
  onUnmatch,
  onReport,
  onBlock,
}: ChatMenuPopupProps) {
  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "85%",
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            elevation: 5,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 6,
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: "absolute",
              right: 8,
              top: 8,
              padding: 16,
              width: 48,
              height: 48,
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            accessibilityLabel="Close menu"
            accessibilityRole="button"
            activeOpacity={0.6}
          >
            <Ionicons
              name="close"
              size={28}
              color="#666"
              style={{ pointerEvents: "none" }}
            />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              textAlign: "center",
              marginBottom: 16,
              color: "#111",
            }}
          >
            Options
          </Text>

          <TouchableOpacity
            onPress={onUnmatch}
            style={{ marginBottom: 16 }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#e11d48" }}>
              Unmatch
            </Text>
            <Text style={{ fontSize: 13, color: "#555", marginTop: 2 }}>
              No longer interested? Remove them from your matches.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onReport}
            style={{ marginBottom: 16 }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#eab308" }}>
              Report
            </Text>
            <Text style={{ fontSize: 13, color: "#555", marginTop: 2 }}>
              Dont't worry -- we won't tell them.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onBlock} activeOpacity={0.7}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#8b5cf6" }}>
              Block
            </Text>
            <Text style={{ fontSize: 13, color: "#555", marginTop: 2 }}>
              You won't see them, and they won't see you.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
