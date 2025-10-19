import React from "react";
import { PieChart } from "react-native-gifted-charts";
import { useTheme } from "react-native-paper";
import ChartCard from "./ChartCard";

export default function UsersChart({ users }: { users: any }) {
  const theme = useTheme();

  const data = [
    { value: users.filter((user: any) => user.status === "active").length, color: theme.colors.primary, text: "Active" },
    { value: users.filter((user: any) => user.status === "banned").length, color: theme.colors.error, text: "Banned" },
    { value: users.filter((user: any) => user.status === "unverified").length, color: theme.colors.secondary, text: "Unverified" },
    { value: users.filter((user: any) => user.status === "deleted").length, color: theme.colors.outline, text: "Deleted" },
  ];

  return (
    <ChartCard title="User Status">
      <PieChart
        data={data}
        showText
        textColor={theme.colors.onSurface}
        radius={100}
        innerRadius={50}
      />
    </ChartCard>
  );
}
