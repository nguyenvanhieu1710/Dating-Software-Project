import * as React from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useTheme } from "react-native-paper";
import TextField from "@/components/inputs/TextField";
import { IUserBlock, CreateBlockRequest } from "@/types/user-block";
import { adminUserService } from "@/services/admin-user.service";
import CollapsibleSection from "@/components/collapsible/CollapsibleSection";
import PrimaryButton from "@/components/buttons/PrimaryButton";

const useBlockForm = (initialData: IUserBlock | null) => {
  const [blockerId, setBlockerId] = React.useState(initialData?.blocker_id?.toString() ?? "");
  const [blockedId, setBlockedId] = React.useState(initialData?.blocked_id?.toString() ?? "");

  const validateForm = (): string[] => {
    const blockData: CreateBlockRequest = {
      blocker_id: parseInt(blockerId),
      blocked_id: parseInt(blockedId),
    };
    return adminUserService.validateBlockData(blockData);
  };

  const getFormData = (): CreateBlockRequest => ({
    blocker_id: parseInt(blockerId),
    blocked_id: parseInt(blockedId),
  });

  return {
    formState: { blockerId, blockedId },
    setters: { setBlockerId, setBlockedId },
    validateForm,
    getFormData,
  };
};

type Props = {
  initialData: IUserBlock | null;
  onSubmit: (block: CreateBlockRequest) => void;
  onCancel: () => void;
};

export default function UserBlockForm({ initialData, onSubmit, onCancel }: Props) {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = React.useState({ basic: true });
  const { formState, setters, validateForm, getFormData } = useBlockForm(initialData);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
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
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <CollapsibleSection
          title="Block Information"
          subtitle="Blocker and blocked user IDs"
          isExpanded={expandedSections.basic}
          onToggle={() => toggleSection("basic")}
          requiredFields
        >
          <TextField
            label="Blocker ID"
            value={formState.blockerId}
            onChangeText={setters.setBlockerId}
            placeholder="Enter blocker user ID"
            keyboardType="numeric"
          />
          <TextField
            label="Blocked ID"
            value={formState.blockedId}
            onChangeText={setters.setBlockedId}
            placeholder="Enter blocked user ID"
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