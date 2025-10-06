import React from "react";
import { FlatList, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, Button, Card, List, Text, useTheme } from "react-native-paper";
import { Match } from "@/services/matchApi";

export default function MatchList({
  matches,
  isLoading,
  onPressMatch,
}: {
  matches: Match[];
  isLoading: boolean;
  onPressMatch: (id: number) => void;
}) {
  const theme = useTheme();
  return (
    <Card style={{ marginHorizontal: 12, marginBottom: 16 }}>
      <Card.Title title="New Matches" titleStyle={{ fontWeight: "bold" }} />
      <Card.Content>
        {isLoading ? (
          <Text
            style={{
              color: theme.colors.primary,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            Loading matches...
          </Text>
        ) : matches.length > 0 ? (
          <FlatList
            data={matches}
            horizontal
            keyExtractor={(item) =>
              `${Math.min(item.user1_id, item.user2_id)}-${Math.max(
                item.user1_id,
                item.user2_id
              )}`
            }
            renderItem={({ item }) => (
              <Button
                onPress={() => onPressMatch(item.id)}
                style={{
                  marginRight: 12,
                  padding: 0,
                }}
                contentStyle={{
                  flexDirection: "column",
                  alignItems: "center",
                  paddingVertical: 8,
                }}
                mode="text"
              >
                <View style={{ alignItems: "center" }}>
                  <Avatar.Image
                    size={70}
                    source={{
                      uri: item.avatar,
                    }}
                  />
                  <Text
                    style={{
                      marginTop: 8,
                      fontFamily: theme.fonts.bodyLarge.fontFamily,
                      textAlign: "center",
                      color: theme.colors.primary,
                    }}
                    numberOfLines={1}
                  >
                    {item.name || "Unknown"}
                  </Text>
                </View>
              </Button>
            )}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <List.Item
            title="No new matches yet"
            description="Keep swiping to find new connections!"
            left={(props) => (
              <Ionicons name="heart-outline" size={32} color="#9CA3AF" />
            )}
          />
        )}
      </Card.Content>
    </Card>
  );
}
