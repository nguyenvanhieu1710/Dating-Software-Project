// components/ActivityChart.tsx
import React from "react";
import { LineChart } from "react-native-gifted-charts";
import { useTheme } from "react-native-paper";
import ChartCard from "./ChartCard";

export default function ActivityChart() {
  const theme = useTheme();

  const swipes = [
    { value: 1200, label: "Day1" },
    { value: 1500, label: "Day2" },
    { value: 1800, label: "Day3" },
    { value: 1600, label: "Day4" },
    { value: 2000, label: "Day5" },
    { value: 2200, label: "Day6" },
    { value: 2400, label: "Day7" },
  ];

  const matches = [
    { value: 300, label: "Day1" },
    { value: 350, label: "Day2" },
    { value: 420, label: "Day3" },
    { value: 390, label: "Day4" },
    { value: 500, label: "Day5" },
    { value: 600, label: "Day6" },
    { value: 700, label: "Day7" },
  ];

  const messages = [
    { value: 2000, label: "Day1" },
    { value: 2500, label: "Day2" },
    { value: 2700, label: "Day3" },
    { value: 2400, label: "Day4" },
    { value: 3100, label: "Day5" },
    { value: 2800, label: "Day6" },
    { value: 3200, label: "Day7" },
  ];

  return (
    <ChartCard title="Activity (7 days)">
      <LineChart
        data={swipes}
        data2={matches}
        data3={messages}
        color1={theme.colors.primary}
        color2={theme.colors.tertiary}
        color3={theme.colors.secondary}
        thickness={3}
        showVerticalLines
        yAxisTextStyle={{ color: theme.colors.onSurface }}
        xAxisLabelTextStyle={{ color: theme.colors.onSurface }}
        height={220}
      />
    </ChartCard>
  );
}
