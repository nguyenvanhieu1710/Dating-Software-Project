import React from "react";
import { FlatList, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, Badge, Card, List, Text, useTheme } from "react-native-paper";
import { IMatch } from "@/types/matche";
import { matchService } from "@/services/match.service";

export default function ConversationList({
  conversations,
  isLoading,
  onPressConversation,
}: {
  conversations: IMatch[];
  isLoading: boolean;
  onPressConversation: (id: number) => void;
}) {
  const theme = useTheme();
  return (
    <Card style={{ marginHorizontal: 12, flex: 1 }}>
      <Card.Title title="Messages" titleStyle={{ fontWeight: "bold" }} />
      <Card.Content style={{ flex: 1 }}>
        {isLoading ? (
          <Text
            style={{
              color: theme.colors.primary,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            Loading conversations...
          </Text>
        ) : conversations.length > 0 ? (
          <FlatList
            data={conversations}
            keyExtractor={(item) =>
              `${Math.min(item.user1_id, item.user2_id)}-${Math.max(
                item.user1_id,
                item.user2_id
              )}`
            }
            renderItem={({ item }) => (
              <List.Item
                title={item.first_name}
                description={
                  item.message_count > 0
                    ? "Tap to view conversation"
                    : "Start a conversation"
                }
                titleStyle={{
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                }}
                descriptionStyle={{
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                }}
                left={() => (
                  <Avatar.Image
                    size={48}
                    source={{
                      uri: item.photo_url,
                    }}
                  />
                )}
                right={() => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: theme.colors.primary,
                        fontSize: 12,
                        fontFamily: theme.fonts.bodyLarge.fontFamily,
                        marginRight: 24,
                      }}
                    >
                      {matchService.formatRelativeTime(item.last_message_at)}
                    </Text>
                    {item.message_count > 0 && (
                      <Badge
                        style={{
                          backgroundColor: theme.colors.primary,
                          fontFamily: theme.fonts.bodyLarge.fontFamily,
                          position: "absolute",
                          top: 14,
                          right: 0,
                        }}
                      >
                        {item.message_count}
                      </Badge>
                    )}
                  </View>
                )}
                onPress={() => onPressConversation(item.id)}
              />
            )}
          />
        ) : (
          <List.Item
            title="No conversations yet"
            description="Start matching to begin conversations!"
            titleStyle={{
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
            descriptionStyle={{
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
            left={() => (
              <Ionicons name="chatbubbles-outline" size={32} color="#9CA3AF" />
            )}
          />
        )}
      </Card.Content>
    </Card>
  );
}
