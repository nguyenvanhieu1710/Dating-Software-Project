import * as React from "react";
import { Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import DataTable from "@/components/tables/DataTable";
import { IUserDevice } from "@/types/user-device";
import UserDeviceActions from "./UserDeviceActions";

type Props = {
  devices: IUserDevice[];
  onEdit: (device: IUserDevice) => void;
  onDelete: (device: IUserDevice) => void;
};

export default function UserDeviceTable({ devices, onEdit, onDelete }: Props) {
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
  });

  const tableData = React.useMemo(
    () =>
      devices.map((device, index) => ({
        ...device,
        id: device.id || index,
      })),
    [devices]
  );

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (item: IUserDevice & { id: number }) => (
        <Text style={styles.idText}>#{item.id}</Text>
      ),
    },
    {
      key: "user_id",
      label: "User ID",
      render: (item: IUserDevice & { id: number }) => (
        <Text style={styles.cellText}>{item.user_id}</Text>
      ),
    },
    {
      key: "platform",
      label: "Platform",
      render: (item: IUserDevice & { id: number }) => (
        <Text style={styles.cellText}>{item.platform}</Text>
      ),
    },
    {
      key: "device_model",
      label: "Device Model",
      render: (item: IUserDevice & { id: number }) => (
        <Text style={styles.cellText}>{item.device_model}</Text>
      ),
    },
    {
      key: "app_version",
      label: "App Version",
      render: (item: IUserDevice & { id: number }) => (
        <Text style={styles.cellText}>{item.app_version}</Text>
      ),
    },
    {
      key: "last_ip",
      label: "Last IP",
      render: (item: IUserDevice & { id: number }) => (
        <Text style={styles.cellText}>{item.last_ip}</Text>
      ),
    },
    {
      key: "last_active_at",
      label: "Last Active",
      render: (item: IUserDevice & { id: number }) => (
        <Text style={styles.cellText}>
          {item.last_active_at
            ? new Date(item.last_active_at).toLocaleDateString()
            : "-"}
        </Text>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      render: (item: IUserDevice & { id: number }) => (
        <Text style={styles.cellText}>
          {item.created_at
            ? new Date(item.created_at).toLocaleDateString()
            : "-"}
        </Text>
      ),
    },
    {
      key: "updated_at",
      label: "Updated At",
      render: (item: IUserDevice & { id: number }) => (
        <Text style={styles.cellText}>
          {item.updated_at
            ? new Date(item.updated_at).toLocaleDateString()
            : "-"}
        </Text>
      ),
    },
  ];

  const renderActions = (device: IUserDevice & { id: number }) => {
    const originalDevice: IUserDevice = {
      id: device.id,
      user_id: device.user_id,
      platform: device.platform,
      device_model: device.device_model,
      app_version: device.app_version,
      last_ip: device.last_ip,
      last_active_at: device.last_active_at,
      created_at: device.created_at,
      updated_at: device.updated_at,
    };
    return (
      <UserDeviceActions
        device={originalDevice}
        onEdit={onEdit}
        onDelete={onDelete}
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