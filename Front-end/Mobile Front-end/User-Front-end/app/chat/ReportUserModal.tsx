import React, { useState } from "react";
import { View } from "react-native";
import {
  Modal,
  Portal,
  Button,
  Text,
  TextInput,
  RadioButton,
  useTheme,
} from "react-native-paper";

interface ReportUserModalProps {
  visible: boolean;
  userId: string;
  onClose: () => void;
  onSubmit: (data: { reason: string; description?: string }) => void;
}

const ReportUserModal: React.FC<ReportUserModalProps> = ({
  visible,
  userId,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!reason) {
      alert("Please select a reason");
      return;
    }
    onSubmit({ reason, description });
    onClose();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: "white",
          margin: 20,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <Text
          variant="titleMedium"
          style={{
            marginBottom: 12,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Report User
        </Text>

        <RadioButton.Group
          onValueChange={(value) => setReason(value)}
          value={reason}
        >
          <RadioButton.Item
            label="Harassment or hate speech"
            value="harassment"
          />
          <RadioButton.Item
            label="Inappropriate content"
            value="inappropriate_content"
          />
          <RadioButton.Item label="Spam or ads" value="spam" />
          <RadioButton.Item label="Scam or impersonation" value="scam" />
          <RadioButton.Item label="Other" value="other" />
        </RadioButton.Group>

        <TextInput
          label="Additional details (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
          style={{
            marginTop: 12,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 16,
          }}
        >
          <Button
            onPress={onClose}
            labelStyle={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            labelStyle={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
            style={{ marginLeft: 8 }}
          >
            Submit
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

export default ReportUserModal;