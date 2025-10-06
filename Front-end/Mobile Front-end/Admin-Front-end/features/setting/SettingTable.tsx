import * as React from "react";
import { Text, StyleSheet, View } from "react-native";
import { useTheme, Chip } from "react-native-paper";
import DataTable from "@/components/tables/DataTable";
import { ISetting } from "@/types/setting";
import SettingActions from "./SettingActions";
import { adminSettingService } from "@/services/admin-setting.service";

type Props = {
  settings: ISetting[];
  onEdit: (setting: ISetting) => void;
  onReset: (setting: ISetting) => void;
};

export default function SettingTable({ settings, onEdit, onReset }: Props) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    cellText: {
      fontSize: 14,
      color: theme.colors.onSurface,
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
    idText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.primary,
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
    chipContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      fontSize: 12,
    },
    verifiedBadge: {
      backgroundColor: theme.colors.primary + "20",
      color: theme.colors.primary,
    },
    pendingBadge: {
      backgroundColor: theme.colors.tertiary + "20",
      color: theme.colors.tertiary,
    },
    rejectedBadge: {
      backgroundColor: theme.colors.error + "20",
      color: theme.colors.error,
    },
  });

  // Transform settings data to match DataTable requirements
  const tableData = React.useMemo(
    () =>
      settings.map((setting, index) => ({
        ...setting,
        id: setting.user_id || index, // Use user_id as primary key
      })),
    [settings]
  );

  const getVerificationBadgeStyle = (status: string) => {
    switch (status) {
      case "verified":
        return styles.verifiedBadge;
      case "rejected":
        return styles.rejectedBadge;
      default:
        return styles.pendingBadge;
    }
  };

  const columns = [
    {
      key: "user_id",
      label: "User ID",
      render: (item: ISetting & { id: number }) => (
        <Text style={styles.idText}>#{item.user_id}</Text>
      ),
    },
    {
      key: "age_range",
      label: "Age Range",
      render: (item: ISetting & { id: number }) => (
        <Text style={styles.cellText}>
          {item.min_age} - {item.max_age}
        </Text>
      ),
    },
    {
      key: "max_distance_km",
      label: "Distance",
      render: (item: ISetting & { id: number }) => (
        <Text style={styles.cellText}>{item.max_distance_km} km</Text>
      ),
    },
    {
      key: "language",
      label: "Language",
      render: (item: ISetting & { id: number }) => (
        <Text style={styles.cellText}>
          {adminSettingService.getLanguageDisplayName(item.language)}
        </Text>
      ),
    },
    {
      key: "theme",
      label: "Theme",
      render: (item: ISetting & { id: number }) => (
        <Text style={styles.cellText}>
          {adminSettingService.getThemeDisplayName(item.theme)}
        </Text>
      ),
    },
    {
      key: "account_type",
      label: "Account Type",
      render: (item: ISetting & { id: number }) => (
        <Chip
          mode="flat"
          textStyle={{ fontSize: 12 }}
          style={{ height: 28 }}
          theme={{
            fonts: {
              labelLarge: {
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              },
            },
          }}
        >
          {adminSettingService.getAccountTypeDisplayName(item.account_type)}
        </Chip>
      ),
    },
    {
      key: "verification_status",
      label: "Verification",
      render: (item: ISetting & { id: number }) => (
        <View
          style={[
            styles.badge,
            getVerificationBadgeStyle(item.verification_status),
          ]}
        >
          <Text style={[styles.cellText, { fontSize: 12 }]}>
            {adminSettingService.getVerificationStatusDisplayName(
              item.verification_status
            )}
          </Text>
        </View>
      ),
    },
    {
      key: "notifications",
      label: "Notifications",
      render: (item: ISetting & { id: number }) => {
        const notificationCount = [
          item.new_matches_notification,
          item.new_messages_notification,
          item.message_likes_notification,
          item.message_super_likes_notification,
          item.profile_views_notification,
          item.email_notifications,
          item.push_notifications,
        ].filter(Boolean).length;
        return <Text style={styles.cellText}>{notificationCount}/7</Text>;
      },
    },
  ];

  const renderActions = (setting: ISetting & { id: number }) => {
    // Convert back to original ISetting type for callbacks
    const originalSetting: ISetting = {
      user_id: setting.user_id,
      preferred_gender: setting.preferred_gender,
      min_age: setting.min_age,
      max_age: setting.max_age,
      max_distance_km: setting.max_distance_km,
      show_me: setting.show_me,
      is_discoverable: setting.is_discoverable,
      hide_age: setting.hide_age,
      hide_distance: setting.hide_distance,
      show_last_active: setting.show_last_active,
      show_online_status: setting.show_online_status,
      block_messages_from_strangers: setting.block_messages_from_strangers,
      new_matches_notification: setting.new_matches_notification,
      new_messages_notification: setting.new_messages_notification,
      message_likes_notification: setting.message_likes_notification,
      message_super_likes_notification: setting.message_super_likes_notification,
      profile_views_notification: setting.profile_views_notification,
      email_notifications: setting.email_notifications,
      push_notifications: setting.push_notifications,
      promotional_emails: setting.promotional_emails,
      language: setting.language,
      theme: setting.theme,
      account_type: setting.account_type,
      verification_status: setting.verification_status,
      preferences: setting.preferences,
      created_at: setting.created_at,
      updated_at: setting.updated_at,
    };

    return (
      <SettingActions
        setting={originalSetting}
        onEdit={onEdit}
        onReset={onReset}
      />
    );
  };

  return (
    <DataTable
      columns={columns}
      data={tableData}
      renderActions={renderActions}
    />
  );
}