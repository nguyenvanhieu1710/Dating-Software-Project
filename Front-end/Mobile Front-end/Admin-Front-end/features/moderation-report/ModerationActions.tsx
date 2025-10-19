// ModerationActionButtons.tsx
import React from "react";
import { View } from "react-native";
import { Button, IconButton, useTheme } from "react-native-paper";
import { IModerationReport } from "@/types/moderation-report";

type ActionKey =
  | "dismiss"
  | "warn"
  | "suspend"
  | "ban"
  | "delete_content"
  | "edit"
  | "delete";

type Props = {
  report: IModerationReport;
  onActionSelect?: (report: IModerationReport, action: ActionKey) => void;
  onEdit?: (report: IModerationReport) => void;
  onDelete?: (report: IModerationReport) => void;
  compact?: boolean; // optional layout tweak
};

export default function ModerationActionButtons({
  report,
  onActionSelect,
  onEdit,
  onDelete,
  compact = true,
}: Props) {
  const theme = useTheme();

  // Disable destructive actions if report already resolved or dismissed
  const isImmutable =
    report?.status === "resolved" || report?.status === "dismissed";

  const btnBaseStyle = {
    minWidth: compact ? 56 : 64,
    marginRight: 8,
    borderRadius: 8,
  } as const;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Edit (opens dialog) */}
      <Button
        mode="outlined"
        onPress={() => onEdit?.(report)}
        style={{ ...btnBaseStyle }}
        compact={compact}
        accessibilityLabel={`Edit report ${report.id}`}
      >
        Edit
      </Button>

      {/* Dismiss (soft) */}
      <Button
        mode="text"
        onPress={() => onActionSelect?.(report, "dismiss")}
        disabled={isImmutable}
        style={{ ...btnBaseStyle }}
        compact={compact}
        accessibilityLabel={`Dismiss report ${report.id}`}
      >
        Dismiss
      </Button>

      {/* Warn */}
      <Button
        mode="contained"
        onPress={() => onActionSelect?.(report, "warn")}
        disabled={isImmutable}
        style={{ ...btnBaseStyle }}
        compact={compact}
        accessibilityLabel={`Warn user for report ${report.id}`}
      >
        Warn
      </Button>

      {/* Suspend */}
      <Button
        mode="contained"
        onPress={() => onActionSelect?.(report, "suspend")}
        disabled={isImmutable}
        style={{ ...btnBaseStyle }}
        compact={compact}
        accessibilityLabel={`Suspend user for report ${report.id}`}
      >
        Suspend
      </Button>

      {/* Ban (destructive styling) */}
      <Button
        mode="contained"
        onPress={() => onActionSelect?.(report, "ban")}
        disabled={isImmutable}
        style={{
          ...btnBaseStyle,
          backgroundColor: theme.colors.error,
        }}
        compact={compact}
        accessibilityLabel={`Ban user for report ${report.id}`}
      >
        Ban
      </Button>

      {/* Delete content (if applicable) */}
      <IconButton
        icon="delete"
        onPress={() => onActionSelect?.(report, "delete_content")}
        disabled={isImmutable}
        size={20}
        style={{ marginLeft: 2 }}
        accessibilityLabel={`Delete content for report ${report.id}`}
      />

      {/* Delete report entry (admin cleanup) */}
      {/* <Button
        mode="text"
        onPress={() => onDelete?.(report)}
        contentStyle={{ paddingVertical: 6 }}
        style={{ ...btnBaseStyle }}
        compact={compact}
        accessibilityLabel={`Delete report record ${report.id}`}
      >
        Remove
      </Button> */}
    </View>
  );
}
