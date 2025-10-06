import * as React from "react";
import { Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import DataTable from "@/components/tables/DataTable";
import { IModerationReport } from "@/types/moderation-report";
import { adminModerationService } from "@/services/admin-moderation.service";
import ModerationActionButtons from "./ModerationActions";

type Props = {
  reports: IModerationReport[];
  onEdit: (report: IModerationReport) => void;
  onDelete: (report: IModerationReport) => void;
  onActionSelect?: (report: IModerationReport, action: string) => void;
};

export default function ModerationTable({
  reports,
  onEdit,
  onDelete,
  onActionSelect,
}: Props) {
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
    statusText: {
      fontSize: 14,
      fontWeight: "500",
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
  });

  const tableData = React.useMemo(
    () =>
      reports.map((report) => ({
        ...adminModerationService.formatReportForDisplay(report),
        id: report.id,
      })),
    [reports]
  );

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (item: IModerationReport & { id: number }) => (
        <Text style={styles.idText}>#{item.id}</Text>
      ),
    },
    {
      key: "reporter_id",
      label: "Reporter ID",
      render: (item: IModerationReport & { id: number }) => (
        <Text style={styles.cellText}>{item.reporter_id}</Text>
      ),
    },
    {
      key: "reported_user_id",
      label: "Reported User ID",
      render: (item: IModerationReport & { id: number }) => (
        <Text style={styles.cellText}>{item.reported_user_id}</Text>
      ),
    },
    {
      key: "content_type",
      label: "Content Type",
      render: (item: IModerationReport & { id: number }) => (
        <Text style={styles.cellText}>{item.content_type}</Text>
      ),
    },
    {
      key: "reason",
      label: "Reason",
      render: (item: IModerationReport & { id: number }) => (
        <Text style={styles.cellText}>{item.reason}</Text>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (
        item: IModerationReport & { id: number; status_display?: string }
      ) => (
        <Text
          style={[
            styles.statusText,
            // { color: adminModerationService.getStatusColor(item.status) },
          ]}
        >
          {item.status_display || item.status}
        </Text>
      ),
    },
    {
      key: "priority",
      label: "",
      render: (item: IModerationReport & { id: number }) => (
        <Text style={styles.cellText}>{""}</Text>
      ),
    },
  ];

  const renderActions = (report: IModerationReport & { id: number }) => {
    const originalReport: IModerationReport = {
      id: report.id,
      reporter_id: report.reporter_id,
      reported_user_id: report.reported_user_id,
      reported_content_id: report.reported_content_id,
      content_type: report.content_type,
      reason: report.reason,
      description: report.description,
      status: report.status,
      priority: report.priority,
      admin_notes: report.admin_notes,
      resolved_by: report.resolved_by,
      resolved_at: report.resolved_at,
      created_at: report.created_at,
      updated_at: report.updated_at,
    };

    return (
      <ModerationActionButtons
        report={originalReport}
        onEdit={onEdit}
        onDelete={onDelete}
        onActionSelect={(r, action) => {
          onActionSelect?.(r, action);
        }}
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
