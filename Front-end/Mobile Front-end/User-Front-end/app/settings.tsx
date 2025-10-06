import React from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Snackbar, Text, TouchableRipple } from "react-native-paper";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { SettingSection } from "./user-setting/UserSettingSection";
import { SettingItem } from "./user-setting/UserSettingItem";
import { authService } from "../services/auth.service";
import { userSettingService } from "@/services/user-setting.service";
import Header from "@/components/header/Header";
import { useEffect, useState } from "react";
import { ISetting, UpdateSettingRequest } from "@/types/setting";

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [settings, setSettings] = React.useState<ISetting | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showProfile, setShowProfile] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showAge, setShowAge] = useState(true);
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const getUserSetting = async () => {
    setLoading(true);
    try {
      const user = await authService.getUser();
      // console.log(user);
      if (user) {
        const response = await userSettingService.getSettingsByUserId(user.id);
        // console.log(response);
        if (response.success && response.data) {
          console.log("get setting success: ", response.data);
          const s = response.data;
          setSettings(s);
          setDarkMode(s.theme === "dark");
          setNotifications(s.push_notifications);
          setShowProfile(s.is_discoverable);
          setShowDistance(!s.hide_distance);
          setShowAge(!s.hide_age);
        } else {
          throw new Error(response.message || "Failed to fetch settings");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    const patch: UpdateSettingRequest = {
      theme: darkMode ? "dark" : "light",
      push_notifications: notifications,
      is_discoverable: showProfile,
      hide_distance: !showDistance,
      hide_age: !showAge,

      // các field bắt buộc nhưng UI không có
      preferred_gender: settings.preferred_gender || "other",
      min_age: settings.min_age || 18,
      max_age: settings.max_age || 50,
      max_distance_km: settings.max_distance_km || 50,
      show_me: settings.show_me || ["male", "female"],
      language: settings.language || "en",
      account_type: settings.account_type || "free",
      verification_status: settings.verification_status || "pending",
      preferences: settings.preferences || {},
    };

    try {
      console.log("Update setting: ", patch);
      const res = await userSettingService.updateSetting(
        settings.user_id,
        patch
      );
      if (res.success) {
        setSettings(res.data);
      }
    } catch (err) {
      console.error("Update failed", err);
    } finally {
    }
  };

  useEffect(() => {
    getUserSetting();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={theme.colors.background}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator
            animating
            size="large"
            color={theme.colors.primary}
          />
          <Text
            variant="bodyLarge"
            style={{
              marginTop: 12,
              color: theme.colors.onSurface,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            Loading settings...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />

      {/* Header */}
      <Header title="Settings" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <SettingSection title="Account">
          <SettingItem
            label="Edit Profile"
            icon="person-outline"
            onPress={() => {
              router.push("/edit-profile");
            }}
          />
          <SettingItem
            label="Delete Account"
            icon="trash-outline"
            onPress={() => {
              onToggleSnackBar();
            }}
            isDanger
          />
        </SettingSection>

        {/* Preferences Section */}
        <SettingSection title="Preferences">
          <SettingItem
            label="Dark Mode"
            icon="moon-outline"
            hasSwitch
            switchValue={darkMode}
            onSwitchChange={(v) => {
              setDarkMode(v);
              handleSave();
            }}
          />
          <SettingItem
            label="Push Notifications"
            icon="notifications-outline"
            hasSwitch
            switchValue={notifications}
            onSwitchChange={(v) => {
              setNotifications(v);
              handleSave();
            }}
          />
        </SettingSection>

        {/* Discovery Section */}
        <SettingSection title="Discovery Settings">
          <SettingItem
            label="Show My Distance"
            icon="navigate-outline"
            hasSwitch
            switchValue={showDistance}
            onSwitchChange={(v) => {
              setShowDistance(v);
              handleSave();
            }}
          />
          <SettingItem
            label="Show My Age"
            icon="calendar-outline"
            hasSwitch
            switchValue={showAge}
            onSwitchChange={(v) => {
              setShowAge(v);
              handleSave();
            }}
          />
        </SettingSection>

        {/* Support Section */}
        <SettingSection title="Support">
          <SettingItem
            label="Help Center"
            icon="help-circle-outline"
            onPress={() => {
              router.push("/safety-center");
            }}
          />
          <SettingItem
            label="Contact Us"
            icon="chatbubbles-outline"
            onPress={() => { router.push("/contact-us") }}
          />
          <SettingItem
            label="Privacy Policy"
            icon="shield-checkmark-outline"
            onPress={() => {
              router.push("/safety-center");
            }}
          />
          <SettingItem
            label="Terms of Service"
            icon="document-text-outline"
            onPress={() => {
              router.push("/safety-center");
            }}
          />
        </SettingSection>

        {/* Logout Button */}
        <TouchableRipple
          onPress={async () => {
            try {
              await authService.logout();
              router.replace("/login");
            } catch (error) {
              console.error("Logout error:", error);
            }
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 16,
            padding: 16,
            borderRadius: 12,
            marginTop: 8,
            marginBottom: 24,
            backgroundColor: theme.colors.errorContainer,
          }}
          rippleColor={theme.colors.primary}
        >
          <>
            <Ionicons
              name="log-out-outline"
              size={20}
              color={theme.colors.error}
              style={{ marginRight: 8 }}
            />
            <Text
              variant="bodyLarge"
              style={{
                color: theme.colors.error,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Log Out
            </Text>
          </>
        </TouchableRipple>

        <Text
          variant="bodySmall"
          style={{
            color: theme.colors.onSurfaceVariant,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
            textAlign: "center",
            fontSize: 14,
            marginTop: 8,
          }}
        >
          App Version 1.0.0
        </Text>
      </ScrollView>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => {
            onDismissSnackBar();
          },
        }}
      >
        Can not delete account now!
      </Snackbar>
    </SafeAreaView>
  );
}
