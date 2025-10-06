// components/UsersChart.tsx
import React from "react";
import { PieChart } from "react-native-gifted-charts";
import { useTheme } from "react-native-paper";
import ChartCard from "./ChartCard";

export default function UsersChart() {
  const theme = useTheme();

  const data = [
    { value: 8500, color: theme.colors.primary, text: "Active" },
    { value: 320, color: theme.colors.error, text: "Banned" },
    { value: 2500, color: theme.colors.secondary, text: "Unverified" },
    { value: 200, color: theme.colors.outline, text: "Deleted" },
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
