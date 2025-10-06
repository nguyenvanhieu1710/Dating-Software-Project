import * as React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import TextField from "@/components/inputs/TextField";
import { IGoal } from "@/types/goal";
import { adminGoalService } from "@/services/admin-goal.service";
import CollapsibleSection from "../../components/collapsible/CollapsibleSection";
import PrimaryButton from "@/components/buttons/PrimaryButton";

// Custom hook for form state management
const useGoalForm = (initialData: IGoal | null) => {
  const [name, setName] = React.useState(initialData?.name ?? "");
  const [category, setCategory] = React.useState(initialData?.category ?? "");

  const validateForm = (): string[] => {
    const errors: string[] = [];
    const goalData = { name, category };
    const validationErrors = adminGoalService.validateGoalData(goalData);
    return validationErrors;
  };

  const getFormData = (): IGoal => ({
    id: initialData?.id ?? 0,
    name,
    category,
    created_at: initialData?.created_at,
    updated_at: initialData?.updated_at,
  });

  return {
    formState: { name, category },
    setters: { setName, setCategory },
    validateForm,
    getFormData,
  };
};

type Props = {
  initialData: IGoal | null;
  onSubmit: (goal: IGoal) => void;
  onCancel: () => void;
};

export default function GoalForm({ initialData, onSubmit, onCancel }: Props) {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = React.useState({
    basic: true,
  });

  const { formState, setters, validateForm, getFormData } =
    useGoalForm(initialData);

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

    const goalData = getFormData();
    onSubmit(goalData);
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CollapsibleSection
          title="Basic Information"
          subtitle="Goal name and category"
          isExpanded={expandedSections.basic}
          onToggle={() => toggleSection("basic")}
          requiredFields
        >
          <TextField
            label="Goal Name"
            value={formState.name}
            onChangeText={setters.setName}
            placeholder="Enter goal name"
          />
          <TextField
            label="Category"
            value={formState.category}
            onChangeText={setters.setCategory}
            placeholder="Enter category (optional)"
          />
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
