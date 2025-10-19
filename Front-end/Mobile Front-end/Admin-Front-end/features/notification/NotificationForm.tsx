import * as React from "react";
import { View, ScrollView, StyleSheet, Switch, Text } from "react-native";
import { useTheme } from "react-native-paper";
import TextField from "@/components/inputs/TextField";
import { INotification, CreateNotificationRequest } from "@/types/notification";
import { adminNotificationService } from "@/services/admin-notification.service";
import CollapsibleSection from "../../components/collapsible/CollapsibleSection";
import PrimaryButton from "@/components/buttons/PrimaryButton";

const useNotificationForm = (initialData: INotification | null) => {
  const [userId, setUserId] = React.useState(initialData?.user_id?.toString() ?? "");
  const [title, setTitle] = React.useState(initialData?.title ?? "");
  const [body, setBody] = React.useState(initialData?.body ?? "");
  const [data, setData] = React.useState(JSON.stringify(initialData?.data ?? {}, null, 2));

  const validateForm = (): string[] => {
    const notificationData: CreateNotificationRequest = {
      user_id: Number(userId) || 0,
      title,
      body,
      data: tryParseJson(data),
    };
    return adminNotificationService.validateNotificationData(notificationData);
  };

  const getFormData = (): CreateNotificationRequest => ({
    user_id: Number(userId) || 0,
    title,
    body,
    data: tryParseJson(data),
  });

  const tryParseJson = (jsonStr: string): Record<string, any> | undefined => {
    try {
      return JSON.parse(jsonStr);
    } catch {
      return undefined;
    }
  };

  return {
    formState: { userId, title, body, data },
    setters: { setUserId, setTitle, setBody, setData },
    validateForm,
    getFormData,
  };
};

type Props = {
  initialData: INotification | null;
  onSubmit: (notification: CreateNotificationRequest) => void;
  onCancel: () => void;
  isGlobal?: boolean;
};

export default function NotificationForm({ initialData, onSubmit, onCancel, isGlobal }: Props) {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = React.useState({
    basic: true,
  });

  const { formState, setters, validateForm, getFormData } = useNotificationForm(initialData);

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
    const notificationData = getFormData();
    onSubmit(notificationData);
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
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CollapsibleSection
          title="Notification Information"
          subtitle="Details of the notification"
          isExpanded={expandedSections.basic}
          onToggle={() => toggleSection("basic")}
          requiredFields
        >
          {!isGlobal && (
            <TextField
              label="User ID"
              value={formState.userId}
              onChangeText={setters.setUserId}
              placeholder="Enter User ID"
              keyboardType="numeric"
            />
          )}
          <TextField
            label="Title"
            value={formState.title}
            onChangeText={setters.setTitle}
            placeholder="Enter notification title"
          />
          <TextField
            label="Body"
            value={formState.body}
            onChangeText={setters.setBody}
            placeholder="Enter notification body"
            multiline
          />
          {/* <TextField
            label="Data (JSON)"
            value={formState.data}
            onChangeText={setters.setData}
            placeholder='Enter data as JSON (e.g., {"type": "match"})'
            multiline
          /> */}
        </CollapsibleSection>
      </ScrollView>

      <View>
        <PrimaryButton title="Save Changes" mode="contained" onPress={handleSave} />
        <br />
        <PrimaryButton title="Cancel" mode="outlined" onPress={onCancel} />
      </View>
    </View>
  );
}