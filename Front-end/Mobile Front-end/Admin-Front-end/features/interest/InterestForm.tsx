import * as React from "react";
import { View, ScrollView, StyleSheet, Switch, Text } from "react-native";
import { useTheme } from "react-native-paper";
import TextField from "@/components/inputs/TextField";
import { IInterest } from "@/types/interest";
import { adminInterestService } from "@/services/admin-interest.service";
import CollapsibleSection from "../../components/collapsible/CollapsibleSection";
import PrimaryButton from "@/components/buttons/PrimaryButton";

// Custom hook for form state management
const useInterestForm = (initialData: IInterest | null) => {
  const [name, setName] = React.useState(initialData?.name ?? "");
  const [category, setCategory] = React.useState(initialData?.category ?? "");
  const [isActive, setIsActive] = React.useState(initialData?.is_active ?? true);

  const validateForm = (): string[] => {
    const errors: string[] = [];
    const interestData = { name, category, is_active: isActive };
    const validationErrors = adminInterestService.validateInterestData(interestData);
    return validationErrors;
  };

  const getFormData = (): IInterest => ({
    id: initialData?.id ?? 0,
    name,
    category,
    is_active: isActive,
    created_at: initialData?.created_at ?? "",
    updated_at: initialData?.updated_at ?? "",
  });

  return {
    formState: { name, category, isActive },
    setters: { setName, setCategory, setIsActive },
    validateForm,
    getFormData,
  };
};

type Props = {
  initialData: IInterest | null;
  onSubmit: (interest: IInterest) => void;
  onCancel: () => void;
};

export default function InterestForm({ initialData, onSubmit, onCancel }: Props) {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = React.useState({
    basic: true,
  });

  const { formState, setters, validateForm, getFormData } = useInterestForm(initialData);

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

    const interestData = getFormData();
    onSubmit(interestData);
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
          title="Basic Information"
          subtitle="Interest name, category and status"
          isExpanded={expandedSections.basic}
          onToggle={() => toggleSection("basic")}
          requiredFields
        >
          <TextField
            label="Interest Name"
            value={formState.name}
            onChangeText={setters.setName}
            placeholder="Enter interest name"
          />
          <TextField
            label="Category"
            value={formState.category}
            onChangeText={setters.setCategory}
            placeholder="Enter category (optional)"
          />
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Active</Text>
            <Switch
              value={formState.isActive}
              onValueChange={setters.setIsActive}
            />
          </View>
        </CollapsibleSection>
      </ScrollView>

      <View>
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
    </View>
  );
}