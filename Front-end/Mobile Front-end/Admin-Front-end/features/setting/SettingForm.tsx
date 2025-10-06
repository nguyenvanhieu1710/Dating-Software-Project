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
import { ISetting } from "@/types/setting";
import { adminSettingService } from "@/services/admin-setting.service";
import CollapsibleSection from "../../components/collapsible/CollapsibleSection";
import PrimaryButton from "@/components/buttons/PrimaryButton";

// Custom hook for form state management
const useSettingForm = (initialData: ISetting | null) => {
  const [userId, setUserId] = React.useState(initialData?.user_id?.toString() ?? "");
  const [preferredGender, setPreferredGender] = React.useState<"male" | "female" | "other" | null>(
    initialData?.preferred_gender ?? null
  );
  const [minAge, setMinAge] = React.useState(initialData?.min_age?.toString() ?? "18");
  const [maxAge, setMaxAge] = React.useState(initialData?.max_age?.toString() ?? "55");
  const [maxDistanceKm, setMaxDistanceKm] = React.useState(initialData?.max_distance_km?.toString() ?? "50");
  const [showMe, setShowMe] = React.useState<("male" | "female" | "other")[]>(
    Array.isArray(initialData?.show_me)
      ? initialData!.show_me
      : ["male", "female", "other"]
  );
  
  // Privacy settings
  const [isDiscoverable, setIsDiscoverable] = React.useState(initialData?.is_discoverable ?? true);
  const [hideAge, setHideAge] = React.useState(initialData?.hide_age ?? false);
  const [hideDistance, setHideDistance] = React.useState(initialData?.hide_distance ?? false);
  const [showLastActive, setShowLastActive] = React.useState(initialData?.show_last_active ?? true);
  const [showOnlineStatus, setShowOnlineStatus] = React.useState(initialData?.show_online_status ?? true);
  const [blockMessagesFromStrangers, setBlockMessagesFromStrangers] = React.useState(
    initialData?.block_messages_from_strangers ?? false
  );

  // Notification settings
  const [newMatchesNotification, setNewMatchesNotification] = React.useState(
    initialData?.new_matches_notification ?? true
  );
  const [newMessagesNotification, setNewMessagesNotification] = React.useState(
    initialData?.new_messages_notification ?? true
  );
  const [messageLikesNotification, setMessageLikesNotification] = React.useState(
    initialData?.message_likes_notification ?? true
  );
  const [messageSuperLikesNotification, setMessageSuperLikesNotification] = React.useState(
    initialData?.message_super_likes_notification ?? true
  );
  const [profileViewsNotification, setProfileViewsNotification] = React.useState(
    initialData?.profile_views_notification ?? true
  );
  const [emailNotifications, setEmailNotifications] = React.useState(initialData?.email_notifications ?? true);
  const [pushNotifications, setPushNotifications] = React.useState(initialData?.push_notifications ?? true);
  const [promotionalEmails, setPromotionalEmails] = React.useState(initialData?.promotional_emails ?? false);

  // Account settings
  const [language, setLanguage] = React.useState<"en" | "vi" | "ja" | "ko" | "zh">(
    initialData?.language ?? "en"
  );
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">(initialData?.theme ?? "system");
  const [accountType, setAccountType] = React.useState<"free" | "premium" | "gold">(
    initialData?.account_type ?? "free"
  );
  const [verificationStatus, setVerificationStatus] = React.useState<"pending" | "verified" | "rejected">(
    initialData?.verification_status ?? "pending"
  );

  const validateForm = (): string[] => {
    return adminSettingService.validateSettingData(getFormData());
  };

  const getFormData = (): ISetting => ({
    user_id: Number(userId),
    preferred_gender: preferredGender,
    min_age: Number(minAge),
    max_age: Number(maxAge),
    max_distance_km: Number(maxDistanceKm),
    show_me: showMe,
    is_discoverable: isDiscoverable,
    hide_age: hideAge,
    hide_distance: hideDistance,
    show_last_active: showLastActive,
    show_online_status: showOnlineStatus,
    block_messages_from_strangers: blockMessagesFromStrangers,
    new_matches_notification: newMatchesNotification,
    new_messages_notification: newMessagesNotification,
    message_likes_notification: messageLikesNotification,
    message_super_likes_notification: messageSuperLikesNotification,
    profile_views_notification: profileViewsNotification,
    email_notifications: emailNotifications,
    push_notifications: pushNotifications,
    promotional_emails: promotionalEmails,
    language: language,
    theme: theme,
    account_type: accountType,
    verification_status: verificationStatus,
    preferences: initialData?.preferences ?? {},
    created_at: initialData?.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return {
    formState: {
      userId,
      preferredGender,
      minAge,
      maxAge,
      maxDistanceKm,
      showMe,
      isDiscoverable,
      hideAge,
      hideDistance,
      showLastActive,
      showOnlineStatus,
      blockMessagesFromStrangers,
      newMatchesNotification,
      newMessagesNotification,
      messageLikesNotification,
      messageSuperLikesNotification,
      profileViewsNotification,
      emailNotifications,
      pushNotifications,
      promotionalEmails,
      language,
      theme,
      accountType,
      verificationStatus,
    },
    setters: {
      setUserId,
      setPreferredGender,
      setMinAge,
      setMaxAge,
      setMaxDistanceKm,
      setShowMe,
      setIsDiscoverable,
      setHideAge,
      setHideDistance,
      setShowLastActive,
      setShowOnlineStatus,
      setBlockMessagesFromStrangers,
      setNewMatchesNotification,
      setNewMessagesNotification,
      setMessageLikesNotification,
      setMessageSuperLikesNotification,
      setProfileViewsNotification,
      setEmailNotifications,
      setPushNotifications,
      setPromotionalEmails,
      setLanguage,
      setTheme,
      setAccountType,
      setVerificationStatus,
    },
    validateForm,
    getFormData,
  };
};

type Props = {
  initialData: ISetting | null;
  onSubmit: (setting: ISetting) => void;
  onCancel: () => void;
};

export default function SettingForm({ initialData, onSubmit, onCancel }: Props) {
  const theme = useTheme();
  const { formState, setters, validateForm, getFormData } = useSettingForm(initialData);

  const [expandedSections, setExpandedSections] = React.useState({
    basic: true,
    discovery: true,
    privacy: false,
    notifications: false,
    account: false,
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

  const toggleShowMe = (gender: "male" | "female" | "other") => {
    setters.setShowMe((prev) => {
      if (prev.includes(gender)) {
        return prev.filter((g) => g !== gender);
      } else {
        return [...prev, gender];
      }
    });
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
          subtitle="User ID and account details"
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

        {/* Discovery Preferences */}
        <CollapsibleSection
          title="Discovery Preferences"
          subtitle="Age range, distance, and gender preferences"
          isExpanded={expandedSections.discovery}
          onToggle={() => toggleSection("discovery")}
        >
          <Text style={styles.label}>Preferred Gender</Text>
          <View style={styles.chipContainer}>
            <Chip
              selected={formState.preferredGender === "male"}
              onPress={() => setters.setPreferredGender("male")}
            >
              Male
            </Chip>
            <Chip
              selected={formState.preferredGender === "female"}
              onPress={() => setters.setPreferredGender("female")}
            >
              Female
            </Chip>
            <Chip
              selected={formState.preferredGender === "other"}
              onPress={() => setters.setPreferredGender("other")}
            >
              Other
            </Chip>
            <Chip
              selected={formState.preferredGender === null}
              onPress={() => setters.setPreferredGender(null)}
            >
              Any
            </Chip>
          </View>

          <TextField
            label="Min Age"
            value={formState.minAge}
            onChangeText={setters.setMinAge}
            keyboardType="numeric"
            placeholder="18"
          />
          <TextField
            label="Max Age"
            value={formState.maxAge}
            onChangeText={setters.setMaxAge}
            keyboardType="numeric"
            placeholder="55"
          />
          <TextField
            label="Max Distance (km)"
            value={formState.maxDistanceKm}
            onChangeText={setters.setMaxDistanceKm}
            keyboardType="numeric"
            placeholder="50"
          />

          <Text style={styles.label}>Show Me</Text>
          <View style={styles.chipContainer}>
            <Chip
              selected={formState.showMe.includes("male")}
              onPress={() => toggleShowMe("male")}
            >
              Male
            </Chip>
            <Chip
              selected={formState.showMe.includes("female")}
              onPress={() => toggleShowMe("female")}
            >
              Female
            </Chip>
            <Chip
              selected={formState.showMe.includes("other")}
              onPress={() => toggleShowMe("other")}
            >
              Other
            </Chip>
          </View>
        </CollapsibleSection>

        {/* Privacy Settings */}
        <CollapsibleSection
          title="Privacy Settings"
          subtitle="Control your visibility and profile information"
          isExpanded={expandedSections.privacy}
          onToggle={() => toggleSection("privacy")}
        >
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Discoverable</Text>
            <Switch
              value={formState.isDiscoverable}
              onValueChange={setters.setIsDiscoverable}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Hide Age</Text>
            <Switch value={formState.hideAge} onValueChange={setters.setHideAge} />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Hide Distance</Text>
            <Switch
              value={formState.hideDistance}
              onValueChange={setters.setHideDistance}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Show Last Active</Text>
            <Switch
              value={formState.showLastActive}
              onValueChange={setters.setShowLastActive}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Show Online Status</Text>
            <Switch
              value={formState.showOnlineStatus}
              onValueChange={setters.setShowOnlineStatus}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Block Messages from Strangers</Text>
            <Switch
              value={formState.blockMessagesFromStrangers}
              onValueChange={setters.setBlockMessagesFromStrangers}
            />
          </View>
        </CollapsibleSection>

        {/* Notifications */}
        <CollapsibleSection
          title="Notifications"
          subtitle="Manage notification preferences"
          isExpanded={expandedSections.notifications}
          onToggle={() => toggleSection("notifications")}
        >
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>New Matches</Text>
            <Switch
              value={formState.newMatchesNotification}
              onValueChange={setters.setNewMatchesNotification}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>New Messages</Text>
            <Switch
              value={formState.newMessagesNotification}
              onValueChange={setters.setNewMessagesNotification}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Message Likes</Text>
            <Switch
              value={formState.messageLikesNotification}
              onValueChange={setters.setMessageLikesNotification}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Message Super Likes</Text>
            <Switch
              value={formState.messageSuperLikesNotification}
              onValueChange={setters.setMessageSuperLikesNotification}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Profile Views</Text>
            <Switch
              value={formState.profileViewsNotification}
              onValueChange={setters.setProfileViewsNotification}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Email Notifications</Text>
            <Switch
              value={formState.emailNotifications}
              onValueChange={setters.setEmailNotifications}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Push Notifications</Text>
            <Switch
              value={formState.pushNotifications}
              onValueChange={setters.setPushNotifications}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Promotional Emails</Text>
            <Switch
              value={formState.promotionalEmails}
              onValueChange={setters.setPromotionalEmails}
            />
          </View>
        </CollapsibleSection>

        {/* Account Settings */}
        <CollapsibleSection
          title="Account Settings"
          subtitle="Language, theme, account type"
          isExpanded={expandedSections.account}
          onToggle={() => toggleSection("account")}
        >
          <Text style={styles.label}>Language</Text>
          <View style={styles.chipContainer}>
            <Chip
              selected={formState.language === "en"}
              onPress={() => setters.setLanguage("en")}
            >
              English
            </Chip>
            <Chip
              selected={formState.language === "vi"}
              onPress={() => setters.setLanguage("vi")}
            >
              Tiếng Việt
            </Chip>
            <Chip
              selected={formState.language === "ja"}
              onPress={() => setters.setLanguage("ja")}
            >
              日本語
            </Chip>
            <Chip
              selected={formState.language === "ko"}
              onPress={() => setters.setLanguage("ko")}
            >
              한국어
            </Chip>
            <Chip
              selected={formState.language === "zh"}
              onPress={() => setters.setLanguage("zh")}
            >
              中文
            </Chip>
          </View>

          <Text style={styles.label}>Theme</Text>
          <View style={styles.chipContainer}>
            <Chip
              selected={formState.theme === "light"}
              onPress={() => setters.setTheme("light")}
            >
              Light
            </Chip>
            <Chip
              selected={formState.theme === "dark"}
              onPress={() => setters.setTheme("dark")}
            >
              Dark
            </Chip>
            <Chip
              selected={formState.theme === "system"}
              onPress={() => setters.setTheme("system")}
            >
              System
            </Chip>
          </View>

          <Text style={styles.label}>Account Type</Text>
          <View style={styles.chipContainer}>
            <Chip
              selected={formState.accountType === "free"}
              onPress={() => setters.setAccountType("free")}
              theme={{
                fonts: {
                  labelLarge: {
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  },
                },
              }}
            >
              Free
            </Chip>
            <Chip
              selected={formState.accountType === "premium"}
              onPress={() => setters.setAccountType("premium")}
              theme={{
                fonts: {
                  labelLarge: {
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  },
                },
              }}
            >
              Premium
            </Chip>
            <Chip
              selected={formState.accountType === "gold"}
              onPress={() => setters.setAccountType("gold")}
              theme={{
                fonts: {
                  labelLarge: {
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  },
                },
              }}
            >
              Gold
            </Chip>
          </View>

          <Text style={styles.label}>Verification Status</Text>
          <View style={styles.chipContainer}>
            <Chip
              selected={formState.verificationStatus === "pending"}
              onPress={() => setters.setVerificationStatus("pending")}
              theme={{
                fonts: {
                  labelLarge: {
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  },
                },
              }}
            >
              Pending
            </Chip>
            <Chip
              selected={formState.verificationStatus === "verified"}
              onPress={() => setters.setVerificationStatus("verified")}
              theme={{
                fonts: {
                  labelLarge: {
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  },
                },
              }}
            >
              Verified
            </Chip>
            <Chip
              selected={formState.verificationStatus === "rejected"}
              onPress={() => setters.setVerificationStatus("rejected")}
              theme={{
                fonts: {
                  labelLarge: {
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  },
                },
              }}
            >
              Rejected
            </Chip>
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