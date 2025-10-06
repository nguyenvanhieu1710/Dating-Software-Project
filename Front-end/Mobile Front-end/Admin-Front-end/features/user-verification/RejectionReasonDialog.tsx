import * as React from "react";
import { View, Text } from "react-native";
import { Dialog, Portal, RadioButton, useTheme } from "react-native-paper";
import TextField from "@/components/inputs/TextField";
import PrimaryButton from "@/components/buttons/PrimaryButton";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason: string, detail: string) => void;
};

export default function RejectionReasonDialog({
  visible,
  onClose,
  onConfirm,
}: Props) {
  const theme = useTheme();
  const [selectedReason, setSelectedReason] = React.useState("invalid_photo");
  const [detail, setDetail] = React.useState("");

  const reasons = [
    { value: "invalid_photo", label: "Invalid photo" },
    { value: "fake_info", label: "Fake information" },
    { value: "violation", label: "Content violation" },
    { value: "underage", label: "Under 18 Years Old" },
    { value: "spam", label: "Spam/Bot" },
    { value: "other", label: "Other reason" },
  ];

  const handleConfirm = () => {
    const reasonLabel =
      reasons.find((r) => r.value === selectedReason)?.label || "";
    onConfirm(reasonLabel, detail);
    setDetail("");
    setSelectedReason("invalid_photo");
  };

  const handleClose = () => {
    setDetail("");
    setSelectedReason("invalid_photo");
    onClose();
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={handleClose}
        style={{ backgroundColor: theme.colors.surface, borderRadius: 20 }}
      >
        <Dialog.Title
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: theme.colors.onSurface,
            textAlign: "center",
          }}
        >
          Reason for rejection
        </Dialog.Title>
        <Dialog.Content style={{ paddingTop: 16 }}>
          <RadioButton.Group
            onValueChange={setSelectedReason}
            value={selectedReason}
          >
            {reasons.map((reason) => (
              <View
                key={reason.value}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <RadioButton value={reason.value} />
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.colors.onSurface,
                    flex: 1,
                  }}
                >
                  {reason.label}
                </Text>
              </View>
            ))}
          </RadioButton.Group>

          <View
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: theme.colors.outline + "30",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: theme.colors.onSurface,
                marginBottom: 8,
              }}
            >
              Detail (optional)
            </Text>
            <TextField
              label="Detail"
              value={detail}
              onChangeText={setDetail}
              placeholder="Enter a detailed description of the reason for rejection..."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={{ marginTop: 16, gap: 8 }}>
            <PrimaryButton
              title="Confirm rejection"
              mode="contained"
              onPress={handleConfirm}
            />
            <PrimaryButton
              title="Cancel"
              mode="outlined"
              onPress={handleClose}
            />
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}
