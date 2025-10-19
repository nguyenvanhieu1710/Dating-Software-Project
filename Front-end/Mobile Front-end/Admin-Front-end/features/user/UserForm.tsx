import * as React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Button,
} from "react-native";
import { useTheme, Switch } from "react-native-paper";
import DateTimeField from "@/components/inputs/DatePickerField";
import TextField from "@/components/inputs/TextField";
import SelectField from "@/components/inputs/SelectField";
import { IUser } from "@/types/user";
import { IProfile } from "@/types/profile";
import CollapsibleSection from "../../components/collapsible/CollapsibleSection";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import {
  getCurrentLocation,
  requestLocationPermission,
} from "@/utils/geolocation/geolocation.shared";

type Props = {
  initialData: (IUser & { profile?: IProfile }) | null;
  onSubmit: (user: IUser & { profile?: IProfile }) => void;
  onCancel: () => void;
};

// Interface cho state form
interface FormState {
  email: string;
  phoneNumber: string;
  password: string;
  password_hash: string;
  status: string;
  created_at: string;
  updated_at: string;
  firstName: string;
  dob: Date;
  gender: "male" | "female" | "other";
  bio: string;
  jobTitle: string;
  company: string;
  school: string;
  education: string;
  heightCm: string;
  relationshipGoals: string;
  location: string;
  popularityScore: number;
  messageCount: number;
  lastActiveAt: string;
  lastSeen: string;
  isVerified: boolean;
  isOnline: boolean;
}

// Reducer cho state management
type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: any }
  | { type: "RESET"; initialData: Props["initialData"] };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return {
        email: action.initialData?.email ?? "",
        phoneNumber: action.initialData?.phone_number ?? "",
        status: action.initialData?.status ?? "active",
        password: "12345678",
        password_hash: action.initialData?.password_hash ?? "",
        created_at: action.initialData?.created_at ?? "",
        updated_at: action.initialData?.updated_at ?? "",
        popularityScore: action.initialData?.profile?.popularity_score ?? 0,
        messageCount: action.initialData?.profile?.message_count ?? 0,
        lastActiveAt: action.initialData?.profile?.last_active_at ?? "",
        lastSeen: action.initialData?.profile?.last_seen ?? "",
        firstName: action.initialData?.profile?.first_name ?? "",
        dob: action.initialData?.profile?.dob
          ? new Date(action.initialData.profile.dob)
          : new Date(),
        gender: action.initialData?.profile?.gender ?? "other",
        bio: action.initialData?.profile?.bio ?? "",
        jobTitle: action.initialData?.profile?.job_title ?? "",
        company: action.initialData?.profile?.company ?? "",
        school: action.initialData?.profile?.school ?? "",
        education: action.initialData?.profile?.education ?? "",
        heightCm: action.initialData?.profile?.height_cm?.toString() ?? "",
        relationshipGoals:
          action.initialData?.profile?.relationship_goals ?? "",
        location: action.initialData?.profile?.location ?? "",
        isVerified: action.initialData?.profile?.is_verified ?? false,
        isOnline: action.initialData?.profile?.is_online ?? false,
      };
    default:
      return state;
  }
};

export default function UserForm({ initialData, onSubmit, onCancel }: Props) {
  const theme = useTheme();

  // Quản lý state bằng useReducer
  const [formState, dispatch] = React.useReducer(formReducer, {
    email: initialData?.email ?? "",
    phoneNumber: initialData?.phone_number ?? "",
    status: initialData?.status ?? "active",
    password: "12345678",
    password_hash: initialData?.password_hash ?? "",
    created_at: initialData?.created_at ?? "",
    updated_at: initialData?.updated_at ?? "",
    popularityScore: initialData?.profile?.popularity_score ?? 0,
    messageCount: initialData?.profile?.message_count ?? 0,
    lastActiveAt: initialData?.profile?.last_active_at ?? "",
    lastSeen: initialData?.profile?.last_seen ?? "",
    firstName: initialData?.profile?.first_name ?? "",
    dob: initialData?.profile?.dob
      ? new Date(initialData.profile.dob)
      : new Date(),
    gender: initialData?.profile?.gender ?? "other",
    bio: initialData?.profile?.bio ?? "",
    jobTitle: initialData?.profile?.job_title ?? "",
    company: initialData?.profile?.company ?? "",
    school: initialData?.profile?.school ?? "",
    education: initialData?.profile?.education ?? "",
    heightCm: initialData?.profile?.height_cm?.toString() ?? "",
    relationshipGoals: initialData?.profile?.relationship_goals ?? "",
    location: initialData?.profile?.location ?? "",
    isVerified: initialData?.profile?.is_verified ?? false,
    isOnline: initialData?.profile?.is_online ?? false,
  });

  // Quản lý collapse state
  const [expandedSections, setExpandedSections] = React.useState({
    account: true,
    personal: true,
    career: false,
    physical: false,
    preferences: false,
    status: false,
  });

  // Lưu các field không chỉnh sửa
  const nonEditableProfile = {
    popularity_score: initialData?.profile?.popularity_score ?? 0,
    message_count: initialData?.profile?.message_count ?? 0,
    last_active_at:
      initialData?.profile?.last_active_at ?? new Date().toISOString(),
    last_seen: initialData?.profile?.last_seen ?? null,
    created_at: initialData?.profile?.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Xử lý toggle section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleGetLocation = async () => {
    const granted = await requestLocationPermission();
    if (!granted) {
      console.warn("Location permission denied");
      return;
    }

    try {
      const loc = await getCurrentLocation();
      const locationStr = `${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(
        6
      )}`;
      dispatch({ type: "SET_FIELD", field: "location", value: locationStr });
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  // Xử lý lưu form
  const handleSave = () => {
    // Validation cơ bản
    if (!formState.email || !formState.phoneNumber || !formState.firstName) {
      console.error("Required fields: email, phone_number, first_name");
      return;
    }

    const newUser: IUser & { profile?: IProfile } = {
      id: initialData?.id ?? 0,
      email: formState.email,
      phone_number: formState.phoneNumber,
      password_hash: initialData?.password_hash ?? "",
      status: formState.status,
      created_at: initialData?.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profile: {
        user_id: initialData?.id ?? 0,
        first_name: formState.firstName,
        dob: formState.dob.toISOString(),
        gender: formState.gender,
        bio: formState.bio,
        job_title: formState.jobTitle,
        company: formState.company,
        school: formState.school,
        education: formState.education,
        height_cm: parseInt(formState.heightCm, 10) || 0,
        relationship_goals: formState.relationshipGoals,
        location: formState.location,
        is_verified: formState.isVerified,
        is_online: formState.isOnline,
        ...nonEditableProfile,
      },
    };
    onSubmit(newUser);
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Account Information */}
        <CollapsibleSection
          title="Account Information"
          subtitle="Basic login and contact details"
          isExpanded={expandedSections.account}
          onToggle={() => toggleSection("account")}
          requiredFields
        >
          <TextField
            key="email-field"
            label="Email"
            value={formState.email}
            onChangeText={(text) =>
              dispatch({ type: "SET_FIELD", field: "email", value: text })
            }
            keyboardType="email-address"
          />
          <TextField
            key="phone-field"
            label="Phone Number"
            value={formState.phoneNumber}
            onChangeText={(text) =>
              dispatch({ type: "SET_FIELD", field: "phoneNumber", value: text })
            }
            keyboardType="phone-pad"
          />
          <SelectField
            key="status-field"
            label="Account Status"
            selectedValue={formState.status}
            onValueChange={(value) =>
              dispatch({ type: "SET_FIELD", field: "status", value })
            }
            options={[
              { label: "Active", value: "active" },
              { label: "Banned", value: "banned" },
              { label: "Unverified", value: "unverified" },
              { label: "Deleted", value: "deleted" },
            ]}
          />
        </CollapsibleSection>

        {/* Personal Information */}
        <CollapsibleSection
          title="Personal Information"
          subtitle="Basic personal details"
          isExpanded={expandedSections.personal}
          onToggle={() => toggleSection("personal")}
          requiredFields
        >
          <TextField
            key="firstName-field"
            label="First Name"
            value={formState.firstName}
            onChangeText={(text) =>
              dispatch({ type: "SET_FIELD", field: "firstName", value: text })
            }
          />
          <DateTimeField
            key="dob-field"
            label="Date of Birth"
            value={formState.dob}
            onChange={(date) =>
              dispatch({ type: "SET_FIELD", field: "dob", value: date })
            }
          />
          <SelectField
            key="gender-field"
            label="Gender"
            selectedValue={formState.gender}
            onValueChange={(value) =>
              dispatch({ type: "SET_FIELD", field: "gender", value })
            }
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
          />
          <TextField
            key="bio-field"
            label="Bio"
            value={formState.bio}
            onChangeText={(text) =>
              dispatch({ type: "SET_FIELD", field: "bio", value: text })
            }
            multiline
            numberOfLines={3}
          />
          <TextField
            key="location-field"
            label="Location"
            value={formState.location}
            onChangeText={(text) =>
              dispatch({ type: "SET_FIELD", field: "location", value: text })
            }
            editable={false}
          />
          <PrimaryButton
            title="Get Current Location"
            mode="contained"            
            onPress={handleGetLocation}
          />
        </CollapsibleSection>

        {/* Career & Education */}
        <CollapsibleSection
          title="Career & Education"
          subtitle="Professional and educational background"
          isExpanded={expandedSections.career}
          onToggle={() => toggleSection("career")}
        >
          <TextField
            key="jobTitle-field"
            label="Job Title"
            value={formState.jobTitle}
            onChangeText={(text) =>
              dispatch({ type: "SET_FIELD", field: "jobTitle", value: text })
            }
          />
          <TextField
            key="company-field"
            label="Company"
            value={formState.company}
            onChangeText={(text) =>
              dispatch({ type: "SET_FIELD", field: "company", value: text })
            }
          />
          <TextField
            key="school-field"
            label="School"
            value={formState.school}
            onChangeText={(text) =>
              dispatch({ type: "SET_FIELD", field: "school", value: text })
            }
          />
          <TextField
            key="education-field"
            label="Education Level"
            value={formState.education}
            onChangeText={(text) =>
              dispatch({ type: "SET_FIELD", field: "education", value: text })
            }
          />
        </CollapsibleSection>

        {/* Physical Attributes */}
        <CollapsibleSection
          title="Physical Attributes"
          subtitle="Physical characteristics"
          isExpanded={expandedSections.physical}
          onToggle={() => toggleSection("physical")}
        >
          <TextField
            key="heightCm-field"
            label="Height (cm)"
            value={formState.heightCm}
            onChangeText={(text) =>
              dispatch({ type: "SET_FIELD", field: "heightCm", value: text })
            }
            keyboardType="numeric"
          />
        </CollapsibleSection>

        {/* Preferences */}
        <CollapsibleSection
          title="Relationship Preferences"
          subtitle="Dating goals and preferences"
          isExpanded={expandedSections.preferences}
          onToggle={() => toggleSection("preferences")}
        >
          <TextField
            key="relationshipGoals-field"
            label="Relationship Goals"
            value={formState.relationshipGoals}
            onChangeText={(text) =>
              dispatch({
                type: "SET_FIELD",
                field: "relationshipGoals",
                value: text,
              })
            }
            multiline
            numberOfLines={2}
          />
        </CollapsibleSection>

        {/* Status & Verification */}
        <CollapsibleSection
          title="Status & Verification"
          subtitle="Account verification and online status"
          isExpanded={expandedSections.status}
          onToggle={() => toggleSection("status")}
        >
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Verified Account</Text>
            <Switch
              value={formState.isVerified}
              onValueChange={(value) =>
                dispatch({ type: "SET_FIELD", field: "isVerified", value })
              }
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Currently Online</Text>
            <Switch
              value={formState.isOnline}
              onValueChange={(value) =>
                dispatch({ type: "SET_FIELD", field: "isOnline", value })
              }
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
    </KeyboardAvoidingView>
  );
}
