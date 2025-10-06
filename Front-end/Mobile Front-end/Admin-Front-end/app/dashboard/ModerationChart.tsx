// components/ModerationChart.tsx
import React from "react";
import { BarChart } from "react-native-gifted-charts";
import { useTheme } from "react-native-paper";
import ChartCard from "./ChartCard";

export default function ModerationChart() {
  const theme = useTheme();

  const data = [
    { value: 120, label: "Pending" },
    { value: 90, label: "Approved" },
    { value: 60, label: "Rejected" },
    { value: 15, label: "Escalated" },
  ];

  return (
    <ChartCard title="Moderation Reports">
      <BarChart
        data={data}
        barWidth={36}
        barBorderRadius={8}
        frontColor={theme.colors.error}
      />
    </ChartCard>
  );
}
