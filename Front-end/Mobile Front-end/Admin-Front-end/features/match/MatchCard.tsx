import React from "react";
import {
  Card,
  Title,
  Paragraph,
  Caption,
  Chip,
  Button,
  Divider,
  useTheme,
  Text
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { FlatUserProfile } from "@/types/user";
import { IMatch } from "@/types/matche";

interface MatchCardProps {
  match: IMatch;
  users: FlatUserProfile[];
  onView: (match: IMatch) => void;
  onEdit: (match: IMatch) => void;
  onDelete: (match: IMatch) => void;
  hasPermission: (action: string) => boolean;
  getStatusColor: (status: IMatch["status"]) => string;
  getStatusIcon: (status: IMatch["status"]) => string;
  getStatusLabel: (status: IMatch["status"]) => string;
  formatDate: (dateString: string | Date, locale?: "vi-VN" | "en-US") => string;
  getUserAge: (userId: number) => number | null;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  users,
  onView,
  onEdit,
  onDelete,
  hasPermission,
  getStatusColor,
  getStatusIcon,
  getStatusLabel,
  formatDate,
  getUserAge,
}) => {
  const theme = useTheme();
  const fontStyle = { fontFamily: theme.fonts.bodyLarge.fontFamily };
  const getUserById = (userId: number) =>
    users.find((user) => user.id === userId || user.user_id === userId);
  const user1 = getUserById(match.user1_id);
  const user2 = getUserById(match.user2_id);

  return (
    <Card elevation={2} style={{ marginVertical: 8, marginHorizontal: 8 }}>
      <Card.Title
        titleStyle={fontStyle}
        title={`Match #${match.id}`}
        right={() => (
          <Chip
            icon={getStatusIcon(match.status)}
            style={{ backgroundColor: getStatusColor(match.status), marginHorizontal: 8 }}
            textStyle={{ color: "white", fontWeight: "500", fontFamily: theme.fonts.bodyLarge.fontFamily }}
          >
            {getStatusLabel(match.status)}
          </Chip>
        )}
      />
      <Divider style={{ marginVertical: 8 }} />
      <Card.Content
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Card.Content style={{ flex: 1, marginRight: 8 }}>
          <Text style={fontStyle}>{user1?.first_name || `User ${match.user1_id}`}</Text>
          {user1?.gender && <Text style={fontStyle}>{user1.gender}</Text>}
          {getUserAge(match.user1_id) && (
            <Text style={fontStyle}>{getUserAge(match.user1_id)} years old</Text>
          )}
          {user1?.job_title && <Text style={fontStyle}>{user1.job_title}</Text>}
        </Card.Content>
        <Ionicons name="heart" size={20} color="#EF4444" />
        <Card.Content style={{ flex: 1, marginLeft: 8 }}>
          <Text style={fontStyle}>{user2?.first_name || `User ${match.user2_id}`}</Text>
          {user2?.gender && <Text style={fontStyle}>{user2.gender}</Text>}
          {getUserAge(match.user2_id) && (
            <Text style={fontStyle}>{getUserAge(match.user2_id)} years old</Text>
          )}
          {user2?.job_title && <Text style={fontStyle}>{user2.job_title}</Text>}
        </Card.Content>
      </Card.Content>
      <Divider style={{ marginVertical: 8 }} />
      <Card.Content style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {/* <Chip icon="chatbubbles" style={{ marginRight: 8, marginBottom: 8 }}>
          {match.message_count || 0} messages
        </Chip> */}
        <Chip icon="send-outline" style={{ marginRight: 8, marginBottom: 8 }} textStyle={fontStyle}>
          Created {formatDate(match.created_at)}
        </Chip>
        {/* {match.last_message_at && (
          <Chip icon="send-outline" style={{ marginRight: 8, marginBottom: 8 }} textStyle={fontStyle}>
            Last message {formatDate(match.last_message_at)}
          </Chip>
        )} */}
        {/* {match.report_count && match.report_count > 0 && (
          <Chip icon="warning" style={{ backgroundColor: "#EF4444", marginBottom: 8 }}>
            {match.report_count} reports
          </Chip>
        )} */}
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => onView(match)} labelStyle={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>View</Button>
        {hasPermission("edit") && (
          <Button onPress={() => onEdit(match)} labelStyle={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>Edit</Button>
        )}
        {hasPermission("delete") && (
          <Button textColor="#fff" onPress={() => onDelete(match)} labelStyle={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
            Delete
          </Button>
        )}
      </Card.Actions>
    </Card>
  );
};

export default MatchCard;
