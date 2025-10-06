import React, { useState } from "react";
import { View } from "react-native";
import {
  Portal,
  Dialog,
  Button,
  Text,
  TextInput,
  Checkbox,
  useTheme,
} from "react-native-paper";
import { IModerationReport } from "@/types/moderation-report";

type ActionKey = "dismiss" | "warn" | "suspend" | "ban" | "delete_content";

interface Props {
  visible: boolean;
  report: IModerationReport | null;
  action: ActionKey | null;
  onClose: () => void;
  onConfirm: (
    report: IModerationReport,
    action: ActionKey,
    details?: { notes?: string; duration?: number; permanent?: boolean }
  ) => void;
}

export const ConfirmActionDialog: React.FC<Props> = ({
  visible,
  report,
  action,
  onClose,
  onConfirm,
}) => {
  const theme = useTheme();
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState(""); // for suspend
  const [permanent, setPermanent] = useState(false); // for ban

  if (!report || !action) return null;

  const handleConfirm = () => {
    onConfirm(report, action, {
      notes,
      duration: duration ? Number(duration) : undefined,
      permanent,
    });
    setNotes("");
    setDuration("");
    setPermanent(false);
    onClose();
  };

  const renderExtraFields = () => {
    if (action === "suspend") {
      return (
        <TextInput
          label="Suspend duration (days)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          style={{
            marginTop: 12,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        />
      );
    }
    if (action === "ban") {
      return (
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}
        >
          <Checkbox
            status={permanent ? "checked" : "unchecked"}
            onPress={() => setPermanent(!permanent)}
          />
          <Text style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
            Permanent ban
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose}>
        <Dialog.Title style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
          Confirm Action
        </Dialog.Title>
        <Dialog.Content>
          <Text style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
            You are about to perform "{action}" on user #
            {report.reported_user_id}.
          </Text>
          {renderExtraFields()}
          <TextInput
            label="Admin notes (optional)"
            value={notes}
            onChangeText={setNotes}
            multiline
            style={{
              marginTop: 12,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={onClose}
            labelStyle={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleConfirm}
            labelStyle={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
          >
            Confirm
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
