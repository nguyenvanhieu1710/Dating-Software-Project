import React from "react";
import { LineChart } from "react-native-gifted-charts";
import { useTheme } from "react-native-paper";
import ChartCard from "./ChartCard";

export default function ActivityChart({ matches, messages }: { matches: any, messages: any }) {
  const theme = useTheme();

  const swipes = [
    { value: 200, label: "Day1" },
    { value: 500, label: "Day2" },
    { value: 800, label: "Day3" },
    { value: 600, label: "Day4" },
    { value: 100, label: "Day5" },
    { value: 200, label: "Day6" },
    { value: 400, label: "Day7" },
  ];

  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date.toISOString().split("T")[0]); // e.g., "2025-10-13"
    }
    return days;
  };

  const transformMatchesData = (matches: any[]) => {
    const days = getLast7Days();
    const matchCounts: { [key: string]: number } = {};

    // Initialize counts for each day
    days.forEach((day) => {
      matchCounts[day] = 0;
    });

    // Count matches by created_at date
    matches.forEach((match) => {
      const createdDate = match.created_at.split("T")[0];
      if (matchCounts[createdDate] !== undefined) {
        matchCounts[createdDate]++;
      }
    });

    // Convert to chart format
    return days.map((day, index) => ({
      value: matchCounts[day],
      label: `Day${index + 1}`,
    }));
  };

  const transformMessagesData = (matches: any[]) => {
    const days = getLast7Days();
    const messageCounts: { [key: string]: number } = {};

    // Initialize counts for each day
    days.forEach((day) => {
      messageCounts[day] = 0;
    });

    // Sum message_count by last_message_at date
    matches.forEach((match) => {
      const messageDate = match.last_message_at?.split("T")[0];
      if (messageDate && messageCounts[messageDate] !== undefined) {
        messageCounts[messageDate] += parseInt(match.message_count || "0", 10);
      }
    });

    // Convert to chart format
    return days.map((day, index) => ({
      value: messageCounts[day],
      label: `Day${index + 1}`,
    }));
  };

  return (
    <ChartCard title="Activity (7 days)">
      <LineChart
        data={swipes}
        data2={transformMatchesData(matches)}
        data3={transformMessagesData(messages)}
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
