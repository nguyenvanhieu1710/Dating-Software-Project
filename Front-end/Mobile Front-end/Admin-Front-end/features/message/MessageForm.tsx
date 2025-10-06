import * as React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
} from "react-native";
import { useTheme, Chip } from "react-native-paper";
import TextField from "@/components/inputs/TextField";
import { IMessage } from "@/types/message";
import { adminMessageService } from "@/services/admin-message.service";
import CollapsibleSection from "../../components/collapsible/CollapsibleSection";
import PrimaryButton from "@/components/buttons/PrimaryButton";

// Custom hook for form state management
const useMessageForm = (initialData: IMessage | null) => {
  const [matchId, setMatchId] = React.useState(
    initialData?.match_id?.toString() ?? ""
  );
  const [senderId, setSenderId] = React.useState(
    initialData?.sender_id?.toString() ?? ""
  );
  const [content, setContent] = React.useState(initialData?.content ?? "");
  const [messageType, setMessageType] = React.useState<
    "text" | "image" | "video" | "audio" | "file"
  >((initialData?.message_type as any) ?? "text");
  const [replyToMessageId, setReplyToMessageId] = React.useState(
    initialData?.reply_to_message_id?.toString() ?? ""
  );
  const [isPinned, setIsPinned] = React.useState(
    initialData?.is_pinned ?? false
  );

  const validateForm = (): string[] => {
    return adminMessageService.validateMessageData(getFormData());
  };

  const getFormData = (): IMessage => ({
    id: initialData?.id ?? 0,
    match_id: Number(matchId),
    sender_id: Number(senderId),
    content: content,
    message_type: messageType,
    reply_to_message_id: replyToMessageId ? Number(replyToMessageId) : 0,
    is_pinned: isPinned,
    sent_at: initialData?.sent_at ?? new Date().toISOString(),
    read_at: initialData?.read_at ?? "",
    deleted_at: initialData?.deleted_at ?? "",
    pinned_at: initialData?.pinned_at ?? "",
    edited_at: initialData?.edited_at ?? "",
  });

  return {
    formState: {
      matchId,
      senderId,
      content,
      messageType,
      replyToMessageId,
      isPinned,
    },
    setters: {
      setMatchId,
      setSenderId,
      setContent,
      setMessageType,
      setReplyToMessageId,
      setIsPinned,
    },
    validateForm,
    getFormData,
  };
};

type Props = {
  initialData: IMessage | null;
  onSubmit: (message: IMessage) => void;
  onCancel: () => void;
};

export default function MessageForm({
  initialData,
  onSubmit,
  onCancel,
}: Props) {
  const theme = useTheme();
  const { formState, setters, validateForm, getFormData } =
    useMessageForm(initialData);

  const [expandedSections, setExpandedSections] = React.useState({
    basic: true,
    content: true,
    options: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSave = () => {
    const errors = validateForm();
    if (errors.length > 0) {
      console.error("Validation errors:", errors);
      return;
    }
    onSubmit(getFormData());
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 120,
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
    },
    switchLabel: {
      fontSize: 16,
      color: theme.colors.onSurface,
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
    chipContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 8,
    },
    label: {
      fontSize: 16,
      color: theme.colors.onSurface,
      marginBottom: 8,
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: "top",
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Information */}
        <CollapsibleSection
          title="Basic Information"
          subtitle="Match ID and Sender ID"
          isExpanded={expandedSections.basic}
          onToggle={() => toggleSection("basic")}
          requiredFields
        >
          <TextField
            label="Match ID"
            value={formState.matchId}
            onChangeText={setters.setMatchId}
            keyboardType="numeric"
            placeholder="Enter match ID"
          />
          <TextField
            label="Sender ID"
            value={formState.senderId}
            onChangeText={setters.setSenderId}
            keyboardType="numeric"
            placeholder="Enter sender ID"
          />
        </CollapsibleSection>

        {/* Message Content */}
        <CollapsibleSection
          title="Message Content"
          subtitle="Content and message type"
          isExpanded={expandedSections.content}
          onToggle={() => toggleSection("content")}
          requiredFields
        >
          <TextField
            label="Content"
            value={formState.content}
            onChangeText={setters.setContent}
            placeholder="Enter message content"
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <Text style={styles.label}>Message Type</Text>
          <View style={styles.chipContainer}>
            <Chip
              selected={formState.messageType === "text"}
              onPress={() => setters.setMessageType("text")}
            >
              Text
            </Chip>
            <Chip
              selected={formState.messageType === "image"}
              onPress={() => setters.setMessageType("image")}
            >
              Image
            </Chip>
            <Chip
              selected={formState.messageType === "video"}
              onPress={() => setters.setMessageType("video")}
            >
              Video
            </Chip>
            <Chip
              selected={formState.messageType === "audio"}
              onPress={() => setters.setMessageType("audio")}
            >
              Audio
            </Chip>
            <Chip
              selected={formState.messageType === "file"}
              onPress={() => setters.setMessageType("file")}
            >
              File
            </Chip>
          </View>
        </CollapsibleSection>

        {/* Options */}
        <CollapsibleSection
          title="Options"
          subtitle="Reply and pinned options"
          isExpanded={expandedSections.options}
          onToggle={() => toggleSection("options")}
        >
          <TextField
            label="Reply To Message ID"
            value={formState.replyToMessageId}
            onChangeText={setters.setReplyToMessageId}
            keyboardType="numeric"
            placeholder="Leave empty if not a reply"
          />

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Pinned Message</Text>
            <Switch
              value={formState.isPinned}
              onValueChange={setters.setIsPinned}
            />
          </View>
        </CollapsibleSection>
      </ScrollView>

      <View>
        <PrimaryButton
          title="Save Changes"
          mode="contained"
          onPress={handleSave}
        />
        <br />
        <PrimaryButton title="Cancel" mode="outlined" onPress={onCancel} />
      </View>
    </View>
  );
}
