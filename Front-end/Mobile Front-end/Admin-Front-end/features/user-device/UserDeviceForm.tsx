import * as React from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useTheme } from "react-native-paper";
import TextField from "@/components/inputs/TextField";
import { IUserDevice } from "@/types/user-device";
import CollapsibleSection from "@/components/collapsible/CollapsibleSection";
import PrimaryButton from "@/components/buttons/PrimaryButton";

const useDeviceForm = (initialData: IUserDevice | null) => {
  const [user_id, setUserId] = React.useState(initialData?.user_id?.toString() ?? "");
  const [platform, setPlatform] = React.useState(initialData?.platform ?? "");
  const [device_model, setDeviceModel] = React.useState(initialData?.device_model ?? "");
  const [app_version, setAppVersion] = React.useState(initialData?.app_version ?? "");
  const [last_ip, setLastIp] = React.useState(initialData?.last_ip ?? "");

  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!user_id || isNaN(parseInt(user_id))) {
      errors.push("User ID phải là một số hợp lệ");
    }
    if (!platform) {
      errors.push("Platform là bắt buộc");
    }
    if (!device_model) {
      errors.push("Device Model là bắt buộc");
    }
    if (!app_version) {
      errors.push("App Version là bắt buộc");
    }
    if (!last_ip) {
      errors.push("Last IP là bắt buộc");
    }
    return errors;
  };

  const getFormData = (): IUserDevice => ({
    id: initialData?.id ?? 0,
    user_id: parseInt(user_id),
    platform,
    device_model,
    app_version,
    last_ip,
    last_active_at: initialData?.last_active_at ?? new Date().toISOString(),
    created_at: initialData?.created_at ?? new Date().toISOString(),
    updated_at: initialData?.updated_at ?? new Date().toISOString(),
  });

  return {
    formState: { user_id, platform, device_model, app_version, last_ip },
    setters: { setUserId, setPlatform, setDeviceModel, setAppVersion, setLastIp },
    validateForm,
    getFormData,
  };
};

type Props = {
  initialData: IUserDevice | null;
  onSubmit: (device: IUserDevice) => void;
  onCancel: () => void;
};

export default function UserDeviceForm({ initialData, onSubmit, onCancel }: Props) {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = React.useState({ basic: true });

  const { formState, setters, validateForm, getFormData } = useDeviceForm(initialData);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSave = () => {
    const errors = validateForm();
    if (errors.length > 0) {
      console.error("Validation errors:", errors);
      return;
    }
    const deviceData = getFormData();
    onSubmit(deviceData);
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
          title="Thông tin thiết bị"
          subtitle="User ID, Platform, Device Model, App Version, Last IP"
          isExpanded={expandedSections.basic}
          onToggle={() => toggleSection("basic")}
          requiredFields
        >
          <TextField
            label="User ID"
            value={formState.user_id}
            onChangeText={setters.setUserId}
            placeholder="Nhập User ID"
            keyboardType="numeric"
          />
          <TextField
            label="Platform"
            value={formState.platform}
            onChangeText={setters.setPlatform}
            placeholder="Nhập Platform (iOS, Android, ...)"
          />
          <TextField
            label="Device Model"
            value={formState.device_model}
            onChangeText={setters.setDeviceModel}
            placeholder="Nhập Device Model"
          />
          <TextField
            label="App Version"
            value={formState.app_version}
            onChangeText={setters.setAppVersion}
            placeholder="Nhập App Version"
          />
          <TextField
            label="Last IP"
            value={formState.last_ip}
            onChangeText={setters.setLastIp}
            placeholder="Nhập Last IP"
          />
        </CollapsibleSection>
      </ScrollView>
      <View>
        <PrimaryButton title="Lưu" mode="contained" onPress={handleSave} />
        <View style={{ height: 8 }} />
        <PrimaryButton title="Hủy" mode="outlined" onPress={onCancel} />
      </View>
    </View>
  );
}