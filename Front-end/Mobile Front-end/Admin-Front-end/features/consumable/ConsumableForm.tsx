import * as React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useTheme } from "react-native-paper";
import DateTimeField from "@/components/inputs/DatePickerField";
import TextField from "@/components/inputs/TextField";
import { IConsumable } from "@/types/consumable";
import CollapsibleSection from "../../components/collapsible/CollapsibleSection";
import PrimaryButton from "@/components/buttons/PrimaryButton";

// Custom hook cho form state management
const useConsumableForm = (initialData: IConsumable | null) => {
  const [userId, setUserId] = React.useState(
    initialData?.user_id?.toString() ?? ""
  );
  const [superLikesBalance, setSuperLikesBalance] = React.useState(
    initialData?.super_likes_balance?.toString() ?? "0"
  );
  const [boostsBalance, setBoostsBalance] = React.useState(
    initialData?.boosts_balance?.toString() ?? "0"
  );
  const [lastSuperLikeReset, setLastSuperLikeReset] = React.useState(
    initialData?.last_super_like_reset
      ? new Date(initialData.last_super_like_reset)
      : new Date()
  );

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!userId || isNaN(Number(userId)) || Number(userId) <= 0) {
      errors.push("User ID is required and must be a positive number");
    }

    const superLikes = Number(superLikesBalance);
    if (isNaN(superLikes) || superLikes < 0) {
      errors.push("Super likes balance must be a non-negative number");
    }

    const boosts = Number(boostsBalance);
    if (isNaN(boosts) || boosts < 0) {
      errors.push("Boosts balance must be a non-negative number");
    }

    return errors;
  };

  const getFormData = (): IConsumable => ({
    user_id: Number(userId),
    super_likes_balance: Number(superLikesBalance),
    boosts_balance: Number(boostsBalance),
    last_super_like_reset: lastSuperLikeReset.toISOString(),
    updated_at: new Date().toISOString(),
  });

  return {
    formState: {
      userId,
      superLikesBalance,
      boostsBalance,
      lastSuperLikeReset,
    },
    setters: {
      setUserId,
      setSuperLikesBalance,
      setBoostsBalance,
      setLastSuperLikeReset,
    },
    validateForm,
    getFormData,
  };
};

type Props = {
  initialData: IConsumable | null;
  onSubmit: (consumable: IConsumable) => void;
  onCancel: () => void;
};

export default function ConsumableForm({
  initialData,
  onSubmit,
  onCancel,
}: Props) {
  const theme = useTheme();
  const { formState, setters, validateForm, getFormData } =
    useConsumableForm(initialData);

  // Collapse states - tách riêng để dễ quản lý
  const [expandedSections, setExpandedSections] = React.useState({
    basic: true,
    balances: true,
    reset: false,
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
      // Có thể show toast/alert ở đây
      return;
    }

    const consumableData = getFormData();
    onSubmit(consumableData);
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
        {/* Basic Information */}
        <CollapsibleSection
          title="Basic Information"
          subtitle="User ID and consumable details"
          isExpanded={expandedSections.basic}
          onToggle={() => toggleSection("basic")}
          requiredFields
        >
          <TextField
            label="User ID"
            value={formState.userId}
            onChangeText={setters.setUserId}
            keyboardType="numeric"
            placeholder="Enter user ID"
          />
        </CollapsibleSection>

        {/* Consumable Balances */}
        <CollapsibleSection
          title="Consumable Balances"
          subtitle="Current super likes and boosts balance"
          isExpanded={expandedSections.balances}
          onToggle={() => toggleSection("balances")}
        >
          <TextField
            label="Super Likes Balance"
            value={formState.superLikesBalance}
            onChangeText={setters.setSuperLikesBalance}
            keyboardType="numeric"
            placeholder="0"
          />
          <TextField
            label="Boosts Balance"
            value={formState.boostsBalance}
            onChangeText={setters.setBoostsBalance}
            keyboardType="numeric"
            placeholder="0"
          />
        </CollapsibleSection>

        {/* Reset Information */}
        <CollapsibleSection
          title="Reset Information"
          subtitle="Last super like reset date"
          isExpanded={expandedSections.reset}
          onToggle={() => toggleSection("reset")}
        >
          <DateTimeField
            label="Last Super Like Reset"
            value={formState.lastSuperLikeReset}
            onChange={setters.setLastSuperLikeReset}
            mode="datetime"
          />
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
