import * as React from "react";
import { View, Text } from "react-native";
import { useTheme } from "react-native-paper";

type Props = {
  date?: string;
  canResetToday: boolean;
  showResetIndicator?: boolean;
};

const ResetDateDisplay = React.memo(
  ({ date, canResetToday, showResetIndicator = true }: Props) => {
    const theme = useTheme();

    const formatDate = React.useMemo(() => {
      if (!date) return "Never reset";

      const resetDate = new Date(date);
      const now = new Date();
      const diffDays = Math.floor(
        (now.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      return resetDate.toLocaleDateString();
    }, [date]);

    if (!date) {
      return (
        <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 14 }}>
          Never reset
        </Text>
      );
    }

    return (
      <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <Text
          style={{
            fontSize: 14,
            color: theme.colors.onSurface,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          {formatDate}
        </Text>
        {showResetIndicator && canResetToday && (
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.primary,
              fontWeight: "500",
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            Can reset
          </Text>
        )}
      </View>
    );
  }
);

ResetDateDisplay.displayName = "ResetDateDisplay";

export default ResetDateDisplay;
