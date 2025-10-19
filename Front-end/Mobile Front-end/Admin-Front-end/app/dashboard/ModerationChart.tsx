import React from "react";
import { BarChart } from "react-native-gifted-charts";
import { useTheme } from "react-native-paper";
import ChartCard from "./ChartCard";
import { IModerationReport } from "@/types/moderation-report";

export default function ModerationChart({
  moderations,
}: {
  moderations: IModerationReport[];
}) {
  const theme = useTheme();

  const transformModerationData = (moderations: IModerationReport[]) => {
    const statusCounts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      escalated: 0,
    };

    // Count occurrences of each status
    moderations.forEach((moderation) => {
      if (moderation.status in statusCounts) {
        statusCounts[moderation.status as keyof typeof statusCounts]++;
      }
    });

    // Convert to chart format
    return [
      { value: statusCounts.pending, label: "Pending" },
      { value: statusCounts.approved, label: "Approved" },
      { value: statusCounts.rejected, label: "Rejected" },
      { value: statusCounts.escalated, label: "Escalated" },
    ];
  };

  const data = transformModerationData(moderations);

  return (
    <ChartCard title="Moderation Reports">
      <BarChart
        data={data}
        barWidth={50}
        barBorderRadius={8}
        frontColor={theme.colors.error}
      />
    </ChartCard>
  );
}
