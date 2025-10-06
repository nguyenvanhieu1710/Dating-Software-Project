import * as React from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useTheme, RadioButton } from "react-native-paper";
import TextField from "@/components/inputs/TextField";
import { ISwipe, CreateSwipeRequest } from "@/types/swipe";
import { adminSwipeService } from "@/services/admin-swipe.service";
import CollapsibleSection from "../../components/collapsible/CollapsibleSection";
import PrimaryButton from "@/components/buttons/PrimaryButton";

const useSwipeForm = (initialData: ISwipe | null) => {
  const [swiperUserId, setSwiperUserId] = React.useState(
    initialData?.swiper_user_id?.toString() ?? ""
  );
  const [swipedUserId, setSwipedUserId] = React.useState(
    initialData?.swiped_user_id?.toString() ?? ""
  );
  const [action, setAction] = React.useState<"like" | "pass" | "superlike">(
    initialData?.action ?? "like"
  );

  const validateForm = (): string[] => {
    const swipeData: CreateSwipeRequest = {
      swiper_user_id: Number(swiperUserId) || 0,
      swiped_user_id: Number(swipedUserId) || 0,
      action: action || "like",
    };
    return adminSwipeService.validateSwipeData(swipeData);
  };

  const getFormData = (): CreateSwipeRequest => ({
    swiper_user_id: Number(swiperUserId) || 0,
    swiped_user_id: Number(swipedUserId) || 0,
    action: action || "like",
  });

  return {
    formState: { swiperUserId, swipedUserId, action },
    setters: { setSwiperUserId, setSwipedUserId, setAction },
    validateForm,
    getFormData,
  };
};

type Props = {
  initialData: ISwipe | null;
  onSubmit: (swipe: CreateSwipeRequest) => void;
  onCancel: () => void;
};

export default function SwipeForm({ initialData, onSubmit, onCancel }: Props) {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = React.useState({
    basic: true,
  });

  const { formState, setters, validateForm, getFormData } = useSwipeForm(initialData);

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
    const swipeData = getFormData();
    onSubmit(swipeData);
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
          title="Swipe Information"
          subtitle="Details of the swipe action"
          isExpanded={expandedSections.basic}
          onToggle={() => toggleSection("basic")}
          requiredFields
        >
          <TextField
            label="Swiper User ID"
            value={formState.swiperUserId}
            onChangeText={setters.setSwiperUserId}
            placeholder="Enter Swiper User ID"
            keyboardType="numeric"
          />
          <TextField
            label="Swiped User ID"
            value={formState.swipedUserId}
            onChangeText={setters.setSwipedUserId}
            placeholder="Enter Swiped User ID"
            keyboardType="numeric"
          />
          <View style={styles.radioContainer}>
            <Text style={styles.radioLabel}>Action</Text>
            <RadioButton.Group
              onValueChange={(value) =>
                setters.setAction(value as "like" | "pass" | "superlike")
              }
              value={formState.action}
            >
              <RadioButton.Item label="Like" value="like" />
              <RadioButton.Item label="Pass" value="pass" />
              <RadioButton.Item label="Superlike" value="superlike" />
            </RadioButton.Group>
          </View>
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