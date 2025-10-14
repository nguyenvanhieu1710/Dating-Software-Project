import React from "react";
import {
  Modal,
  Portal,
  Card,
  Title,
  Paragraph,
  Button,
  useTheme,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { FlatUserProfile } from "@/types/user";
import { IMatch } from "@/types/matche";

interface DeleteModalProps {
  visible: boolean;
  match: IMatch | null;
  users: FlatUserProfile[];
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  match,
  users,
  onClose,
  onConfirm,
}) => {
  const theme = useTheme();
  if (!match) return null;

  const getUserById = (userId: number) =>
    users.find((user) => user.id === userId || user.user_id === userId);
  const user1 = getUserById(match.user1_id);
  const user2 = getUserById(match.user2_id);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={{
          flex: 1,
          backgroundColor: "#fff",
          padding: 16,
          margin: 16,
          borderRadius: 8,
        }}
      >
        <Card elevation={0}>
          <Card.Title
            titleStyle={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
            title="Delete Match"
            right={() => (
              <Button
                icon="close"
                onPress={onClose}
                labelStyle={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
              >
                Close
              </Button>
            )}
          />
          <Card.Content>
            <Card.Content style={{ alignItems: "center", marginBottom: 16 }}>
              <Ionicons name="warning" size={48} color="#EF4444" />
            </Card.Content>
            <Title
              style={{
                fontSize: 18,
                textAlign: "center",
                marginBottom: 8,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              Delete Match
            </Title>
            <Paragraph
              style={{
                textAlign: "center",
                marginBottom: 8,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              Are you sure you want to delete this match?
            </Paragraph>
            <Paragraph
              style={{
                textAlign: "center",
                marginBottom: 8,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              User 1: {user1?.first_name || `User ${match.user1_id}`}
            </Paragraph>
            <Paragraph
              style={{
                textAlign: "center",
                marginBottom: 8,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              User 2: {user2?.first_name || `User ${match.user2_id}`}
            </Paragraph>
            <Paragraph
              style={{
                textAlign: "center",
                color: "#EF4444",
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              This action cannot be undone.
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button
              onPress={onClose}
              labelStyle={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              color="#EF4444"
              onPress={onConfirm}
              labelStyle={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              Delete Match
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};

export default DeleteModal;
