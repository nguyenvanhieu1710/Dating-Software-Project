import React from "react";
import { ScrollView } from "react-native";
import {
  Modal,
  Portal,
  Card,
  Title,
  Paragraph,
  Caption,
  Chip,
  Divider,
  IconButton,
  useTheme,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { FlatUserProfile } from "@/types/user";
import { IMatch } from "@/types/matche";

interface ViewModalProps {
  visible: boolean;
  match: IMatch | null;
  users: FlatUserProfile[];
  onClose: () => void;
  getStatusColor: (status: IMatch["status"]) => string;
  getStatusIcon: (status: IMatch["status"]) => string;
  getStatusLabel: (status: IMatch["status"]) => string;
  formatDate: (dateString: string | Date, locale?: "vi-VN" | "en-US") => string;
  getUserAge: (userId: number) => number | null;
}

const ViewModal: React.FC<ViewModalProps> = ({
  visible,
  match,
  users,
  onClose,
  getStatusColor,
  getStatusIcon,
  getStatusLabel,
  formatDate,
  getUserAge,
}) => {
  const theme = useTheme();
  if (!match) return null;

  const getUserById = (userId: number) =>
    users.find((user) => user.id === userId || user.user_id === userId);
  const user1 = getUserById(match.user1_id);
  const user2 = getUserById(match.user2_id);

  const renderUserDetails = (
    user: FlatUserProfile | undefined,
    userId: number
  ) => (
    <Card elevation={2} style={{ marginVertical: 8 }}>
      <Card.Title
        titleStyle={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
        title={user?.first_name || `User ${userId}`}
        subtitleStyle={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
        subtitle={user?.email || "unknown@email.com"}
        left={() => (
          <Card.Content
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#D1D5DB",
            }}
          >
            <Paragraph>
              {user?.first_name?.charAt(0)?.toUpperCase() || "U"}
            </Paragraph>
          </Card.Content>
        )}
      />
      {user?.phone_number && (
        <Card.Content>
          <Caption>{user.phone_number}</Caption>
        </Card.Content>
      )}
      <Divider style={{ marginVertical: 8 }} />
      <Card.Content>
        {user?.gender && (
          <Card.Content
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Caption style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
              Gender:
            </Caption>
            <Paragraph style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
              {user.gender}
            </Paragraph>
          </Card.Content>
        )}
        {getUserAge(userId) && (
          <Card.Content
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Caption style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
              Age:
            </Caption>
            <Paragraph style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
              {getUserAge(userId)} years old
            </Paragraph>
          </Card.Content>
        )}
        {user?.job_title && (
          <Card.Content
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Caption style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
              Job:
            </Caption>
            <Paragraph style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
              {user.job_title}
            </Paragraph>
          </Card.Content>
        )}
        {user?.school && (
          <Card.Content
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Caption style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
              School:
            </Caption>
            <Paragraph style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
              {user.school}
            </Paragraph>
          </Card.Content>
        )}
        {user?.bio && (
          <Card.Content
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Caption style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
              Bio:
            </Caption>
            <Paragraph style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
              {user.bio}
            </Paragraph>
          </Card.Content>
        )}
        <Card.Content
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <Caption style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
            Verified:
          </Caption>
          <Card.Content style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name={user?.is_verified ? "checkmark-circle" : "close-circle"}
              size={16}
              color={user?.is_verified ? "#10B981" : "#EF4444"}
            />
            <Paragraph
              style={{
                color: user?.is_verified ? "#10B981" : "#EF4444",
                marginLeft: 4,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              {user?.is_verified ? "Verified" : "Not Verified"}
            </Paragraph>
          </Card.Content>
        </Card.Content>
        <Card.Content
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <Caption style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
            Popularity:
          </Caption>
          <Paragraph style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
            {user?.popularity_score || 0}
          </Paragraph>
        </Card.Content>
        {user?.last_active_at && (
          <Card.Content
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Caption style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
              Last Active:
            </Caption>
            <Paragraph style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
              {formatDate(user.last_active_at)}
            </Paragraph>
          </Card.Content>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={{
          flex: 1,
          backgroundColor: "#fff",
          borderRadius: 12,
          maxHeight: "90%",
          marginHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <Card elevation={0}>
            <Card.Title
              title="Match Details"
              right={() => <IconButton icon="close" onPress={onClose} />}
            />
            <ScrollView>
              <Card.Content>
                <Title
                  style={{
                    fontSize: 18,
                    marginBottom: 16,
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  Match Information
                </Title>
                <Card.Content
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Caption
                    style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
                  >
                    Match ID:
                  </Caption>
                  <Paragraph
                    style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
                  >
                    #{match.id}
                  </Paragraph>
                </Card.Content>
                <Card.Content
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Caption
                    style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
                  >
                    Status:
                  </Caption>
                  <Chip
                    icon={getStatusIcon(match.status)}
                    style={{ backgroundColor: getStatusColor(match.status) }}
                    textStyle={{
                      color: "white",
                      fontWeight: "500",
                      fontFamily: theme.fonts.bodyLarge.fontFamily,
                    }}
                  >
                    {getStatusLabel(match.status)}
                  </Chip>
                </Card.Content>
                <Card.Content
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Caption
                    style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
                  >
                    Created:
                  </Caption>
                  <Paragraph
                    style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
                  >
                    {formatDate(match.created_at)}
                  </Paragraph>
                </Card.Content>
                {/* <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Caption>Messages:</Caption>
                <Paragraph>{match.message_count || 0}</Paragraph>
              </Card.Content> */}
                {match.last_message_at && (
                  <Card.Content
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <Caption
                      style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
                    >
                      Last Message:
                    </Caption>
                    <Paragraph
                      style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
                    >
                      {formatDate(match.last_message_at)}
                    </Paragraph>
                  </Card.Content>
                )}
                {/* {match.report_count && match.report_count > 0 && (
                <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Caption>Reports:</Caption>
                  <Paragraph style={{ color: '#EF4444' }}>{match.report_count}</Paragraph>
                </Card.Content>
              )} */}
                <Divider style={{ marginVertical: 16 }} />
                <Title
                  style={{
                    fontSize: 18,
                    marginBottom: 16,
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  User 1 Details
                </Title>
                {renderUserDetails(user1, match.user1_id)}
                <Divider style={{ marginVertical: 16 }} />
                <Title
                  style={{
                    fontSize: 18,
                    marginBottom: 16,
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  User 2 Details
                </Title>
                {renderUserDetails(user2, match.user2_id)}
              </Card.Content>
            </ScrollView>
          </Card>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

export default ViewModal;
