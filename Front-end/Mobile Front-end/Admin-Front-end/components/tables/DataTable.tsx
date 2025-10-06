import * as React from "react";
import {
  DataTable as PaperTable,
  useTheme,
} from "react-native-paper";
import { View, StyleSheet } from "react-native";

type Column<T> = {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  renderActions?: (item: T) => React.ReactNode;
};

function deepGet(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export default function DataTable<T extends { id: number }>({
  columns,
  data,
  renderActions,
}: Props<T>) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      overflow: "hidden",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
    header: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    headerTitle: {
      color: theme.colors.onSurfaceVariant,
      fontWeight: "600",
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
    row: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline + "33", // 20% opacity
    },
    cellText: {
      color: theme.colors.onSurface,
      fontSize: 14,
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
    actionCell: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
  });

  return (
    <View style={styles.container}>
      <PaperTable>
        {/* Header */}
        <PaperTable.Header style={styles.header}>
          {columns.map((col) => (
            <PaperTable.Title
              key={col.key}
              textStyle={styles.headerTitle}
            >
              {col.label}
            </PaperTable.Title>
          ))}
          {renderActions && (
            <PaperTable.Title
              numeric
              textStyle={styles.headerTitle}
            >
              Actions
            </PaperTable.Title>
          )}
        </PaperTable.Header>

        {/* Rows */}
        {data.map((item, index) => (
          <PaperTable.Row
            key={item.id}
            style={{
              ...styles.row,
              backgroundColor:
                index % 2 === 0
                  ? theme.colors.surface
                  : theme.colors.surfaceVariant + "20",
            }}
            theme={{
              fonts: {
                labelLarge: {
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                },
              },
            }}
          >
            {columns.map((col) => (
              <PaperTable.Cell key={col.key}>
                {col.render ? (
                  col.render(item)
                ) : (
                  <React.Fragment>
                    <PaperTable.Cell
                      textStyle={styles.cellText}
                      theme={{
                        fonts: {
                          labelLarge: {
                            fontFamily: theme.fonts.bodyLarge.fontFamily,
                          },
                        },
                      }}
                    >
                      {String(deepGet(item, col.key) ?? "-")}
                    </PaperTable.Cell>
                  </React.Fragment>
                )}
              </PaperTable.Cell>
            ))}
            {renderActions && (
              <PaperTable.Cell numeric>
                <View style={styles.actionCell}>
                  {renderActions(item)}
                </View>
              </PaperTable.Cell>
            )}
          </PaperTable.Row>
        ))}
      </PaperTable>
    </View>
  );
}
