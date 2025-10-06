import * as React from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useTheme, RadioButton } from "react-native-paper";
import TextField from "@/components/inputs/TextField";
import { IModerationReport, CreateReportRequest } from "@/types/moderation-report";
import { adminModerationService } from "@/services/admin-moderation.service";
import CollapsibleSection from "../../components/collapsible/CollapsibleSection";
import PrimaryButton from "@/components/buttons/PrimaryButton";

const useModerationForm = (initialData: IModerationReport | null) => {
  const [reporterId, setReporterId] = React.useState(initialData?.reporter_id?.toString() ?? "");
  const [reportedUserId, setReportedUserId] = React.useState(initialData?.reported_user_id?.toString() ?? "");
  const [reportedContentId, setReportedContentId] = React.useState(initialData?.reported_content_id?.toString() ?? "");
  const [contentType, setContentType] = React.useState(initialData?.content_type ?? "");
  const [reason, setReason] = React.useState(initialData?.reason ?? "");
  const [description, setDescription] = React.useState(initialData?.description ?? "");
  const [status, setStatus] = React.useState(initialData?.status ?? "");
  const [priority, setPriority] = React.useState(initialData?.priority ?? "");
  const [adminNotes, setAdminNotes] = React.useState(initialData?.admin_notes ?? "");
  const [resolvedBy, setResolvedBy] = React.useState(initialData?.resolved_by?.toString() ?? "");

  const validateForm = (): string[] => {
    const reportData: CreateReportRequest = {
      reporter_id: Number(reporterId) || 0,
      reported_user_id: Number(reportedUserId) || 0,
      reported_content_id: Number(reportedContentId),
      content_type: contentType,
      reason,
      description,
    };
    return adminModerationService.validateReportData(reportData);
  };

  const getFormData = (): any => ({
    reporter_id: Number(reporterId) || 0,
    reported_user_id: Number(reportedUserId) || 0,
    reported_content_id: Number(reportedContentId),
    content_type: contentType,
    reason,
    description,
    status,
    priority,
    admin_notes: adminNotes,
    resolved_by: Number(resolvedBy),
  });

  return {
    formState: { reporterId, reportedUserId, reportedContentId, contentType, reason, description, status, priority, adminNotes, resolvedBy },
    setters: { setReporterId, setReportedUserId, setReportedContentId, setContentType, setReason, setDescription, setStatus, setPriority, setAdminNotes, setResolvedBy },
    validateForm,
    getFormData,
  };
};

type Props = {
  initialData: IModerationReport | null;
  onSubmit: (report: any) => void;
  onCancel: () => void;
};

export default function ModerationForm({ initialData, onSubmit, onCancel }: Props) {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = React.useState({
    basic: true,
    advanced: false,
  });

  const { formState, setters, validateForm, getFormData } = useModerationForm(initialData);

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
    const reportData = getFormData();
    onSubmit(reportData);
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
    radioContainer: {
      paddingVertical: 8,
    },
    radioLabel: {
      fontSize: 16,
      color: theme.colors.onSurface,
      marginBottom: 8,
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
          title="Basic Information"
          subtitle="Reporter, reported user, content type, reason"
          isExpanded={expandedSections.basic}
          onToggle={() => toggleSection("basic")}
          requiredFields
        >
          <TextField
            label="Reporter ID"
            value={formState.reporterId}
            onChangeText={setters.setReporterId}
            placeholder="Enter Reporter ID"
            keyboardType="numeric"
          />
          <TextField
            label="Reported User ID"
            value={formState.reportedUserId}
            onChangeText={setters.setReportedUserId}
            placeholder="Enter Reported User ID"
            keyboardType="numeric"
          />
          <TextField
            label="Reported Content ID (optional)"
            value={formState.reportedContentId}
            onChangeText={setters.setReportedContentId}
            placeholder="Enter Reported Content ID"
            keyboardType="numeric"
          />
          <TextField
            label="Content Type"
            value={formState.contentType}
            onChangeText={setters.setContentType}
            placeholder="Enter content type (e.g., post, comment)"
          />
          <TextField
            label="Reason"
            value={formState.reason}
            onChangeText={setters.setReason}
            placeholder="Enter reason"
          />
          <TextField
            label="Description"
            value={formState.description}
            onChangeText={setters.setDescription}
            placeholder="Enter description (optional)"
            multiline
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Advanced Information"
          subtitle="Status, priority, admin notes, resolved by"
          isExpanded={expandedSections.advanced}
          onToggle={() => toggleSection("advanced")}
        >
          <View style={styles.radioContainer}>
            <Text style={styles.radioLabel}>Status</Text>
            <RadioButton.Group onValueChange={setters.setStatus} value={formState.status}>
              <RadioButton.Item label="Pending" value="pending" />
              <RadioButton.Item label="In Review" value="in_review" />
              <RadioButton.Item label="Resolved" value="resolved" />
            </RadioButton.Group>
          </View>
          <View style={styles.radioContainer}>
            <Text style={styles.radioLabel}>Priority</Text>
            <RadioButton.Group onValueChange={setters.setPriority} value={formState.priority}>
              <RadioButton.Item label="Low" value="low" />
              <RadioButton.Item label="Medium" value="medium" />
              <RadioButton.Item label="High" value="high" />
            </RadioButton.Group>
          </View>
          <TextField
            label="Admin Notes"
            value={formState.adminNotes}
            onChangeText={setters.setAdminNotes}
            placeholder="Enter admin notes (optional)"
            multiline
          />
          <TextField
            label="Resolved By (User ID)"
            value={formState.resolvedBy}
            onChangeText={setters.setResolvedBy}
            placeholder="Enter resolved by user ID (optional)"
            keyboardType="numeric"
          />
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