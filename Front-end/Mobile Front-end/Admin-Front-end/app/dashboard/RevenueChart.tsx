// components/RevenueChart.tsx
import React from "react";
import { BarChart } from "react-native-gifted-charts";
import { useTheme } from "react-native-paper";
import ChartCard from "./ChartCard";

export default function RevenueChart() {
  const theme = useTheme();

  const data = [
    { value: 5000, label: "Jan" },
    { value: 6500, label: "Feb" },
    { value: 7200, label: "Mar" },
    { value: 8800, label: "Apr" },
    { value: 10200, label: "May" },
    { value: 9400, label: "Jun" },
  ];

  return (
    <ChartCard title="Revenue (6 months)">
      <BarChart
        data={data}
        barWidth={32}
        barBorderRadius={6}
        frontColor={theme.colors.primary}
        // yAxisLabel="$"
      />
    </ChartCard>
  );
}
