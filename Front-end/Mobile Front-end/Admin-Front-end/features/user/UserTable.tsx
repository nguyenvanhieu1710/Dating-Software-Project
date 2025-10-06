import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "react-native-paper";
import DataTable from "@/components/tables/DataTable";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { IUser } from "@/types/user";
import { IProfile } from "@/types/profile";
import UserActions from "./UserActions";

type Props = {
  users: (IUser & { profile?: IProfile })[];
  onEdit: (user: IUser & { profile?: IProfile }) => void;
  onDelete: (user: IUser & { profile?: IProfile }) => void;
};

export default function UserTable({ users, onEdit, onDelete }: Props) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    actionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 16,
      justifyContent: 'flex-end',
    },
    cellText: {
      fontSize: 14,
      color: theme.colors.onSurface,
      fontFamily: theme.fonts.bodyLarge.fontFamily
    },
  });

  // Map status và gender thành label hiển thị
  const statusLabels: Record<string, string> = {
    active: 'Active',
    inactive: 'Inactive',
    banned: 'Banned',
    suspended: 'Suspended',
  };

  const genderLabels: Record<string, string> = {
    male: 'Male',
    female: 'Female',
    other: 'Other',
  };

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (item: IUser & { profile?: IProfile }) => (
        <Text style={styles.cellText}>{item.id}</Text>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (item: IUser & { profile?: IProfile }) => (
        <Text style={styles.cellText}>{item.email || '-'}</Text>
      ),
    },
    {
      key: "phone_number",
      label: "Phone",
      render: (item: IUser & { profile?: IProfile }) => (
        <Text style={styles.cellText}>{item.phone_number || '-'}</Text>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: IUser & { profile?: IProfile }) => (
        <Text style={styles.cellText}>{statusLabels[item.status] || item.status || '-'}</Text>
      ),
    },
    {
      key: "profile.first_name",
      label: "Name",
      render: (item: IUser & { profile?: IProfile }) => (
        <Text style={styles.cellText}>{item.profile?.first_name || '-'}</Text>
      ),
    },
    {
      key: "profile.gender",
      label: "Gender",
      render: (item: IUser & { profile?: IProfile }) => (
        <Text style={styles.cellText}>{genderLabels[item.profile?.gender || 'other'] || '-'}</Text>
      ),
    },
  ];

  const renderActions = (user: IUser & { profile?: IProfile }) => (
    <UserActions
      user={user}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );

  return (
    <DataTable
      columns={columns}
      data={users}
      renderActions={renderActions}
    />
  );
}