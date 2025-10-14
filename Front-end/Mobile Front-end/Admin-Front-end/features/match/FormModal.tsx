import React from "react";
import { ScrollView } from "react-native";
import {
  Modal,
  Portal,
  Card,
  Title,
  TextInput,
  Button,
  Chip,
  Caption,
  Text,
  useTheme,
} from "react-native-paper";
import { IMatch } from "@/types/matche";

interface FormModalProps {
  visible: boolean;
  modalType: "create" | "edit";
  formData: Partial<IMatch>;
  formErrors: { [key: string]: string | undefined };
  statusOptions: string[];
  onClose: () => void;
  onSubmit: () => void;
  onInputChange: (field: keyof Partial<IMatch>, value: any) => void;
}

const FormModal: React.FC<FormModalProps> = ({
  visible,
  modalType,
  formData,
  formErrors,
  statusOptions,
  onClose,
  onSubmit,
  onInputChange,
}) => {
  const theme = useTheme();
  const fontStyle = {
    fontFamily: theme.fonts.bodyLarge.fontFamily,
  };
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
            titleStyle={fontStyle}
            title={modalType === "create" ? "Create Match" : "Edit Match"}
            right={() => (
              <Button icon="close" onPress={onClose} labelStyle={fontStyle}>
                Close
              </Button>
            )}
          />
          <ScrollView>
            <Card.Content>
              <Card.Content style={{ marginBottom: 16 }}>
                <Title style={{ fontSize: 16, marginBottom: 8, ...fontStyle }}>
                  User 1 ID
                </Title>
                <TextInput
                  mode="outlined"
                  value={formData.user1_id?.toString() || ""}
                  onChangeText={(text) =>
                    onInputChange("user1_id", parseInt(text) || undefined)
                  }
                  keyboardType="numeric"
                  placeholder="Enter User 1 ID"
                  error={!!formErrors.user1_id}
                />
                {formErrors.user1_id && (
                  <Caption style={{ color: "#EF4444", marginTop: 4 }}>
                    {formErrors.user1_id}
                  </Caption>
                )}
              </Card.Content>
              <Card.Content style={{ marginBottom: 16 }}>
                <Title style={{ fontSize: 16, marginBottom: 8, ...fontStyle }}>
                  User 2 ID
                </Title>
                <TextInput
                  mode="outlined"
                  value={formData.user2_id?.toString() || ""}
                  onChangeText={(text) =>
                    onInputChange("user2_id", parseInt(text) || undefined)
                  }
                  keyboardType="numeric"
                  placeholder="Enter User 2 ID"
                  error={!!formErrors.user2_id}
                />
                {formErrors.user2_id && (
                  <Caption style={{ color: "#EF4444", marginTop: 4 }}>
                    {formErrors.user2_id}
                  </Caption>
                )}
              </Card.Content>
              <Card.Content style={{ marginBottom: 16 }}>
                <Title style={{ fontSize: 16, marginBottom: 8, ...fontStyle }}>
                  Status
                </Title>
                <Card.Content
                  style={{ flexDirection: "row", flexWrap: "wrap" }}
                >
                  {statusOptions.map((option) => (
                    <Chip
                      key={option}
                      selected={formData.status === option}
                      onPress={() => onInputChange("status", option)}
                      style={{ marginRight: 8, marginBottom: 8 }}
                      textStyle={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
                    >
                      {option}
                    </Chip>
                  ))}
                </Card.Content>
                {formErrors.status && (
                  <Text style={{ color: "#EF4444", marginTop: 4, ...fontStyle }}>
                    {formErrors.status}
                  </Text>
                )}
              </Card.Content>
            </Card.Content>
            <Card.Actions>
              <Button onPress={onClose} labelStyle={fontStyle}>
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={onSubmit}
                disabled={
                  !formData.user1_id || !formData.user2_id || !formData.status
                }
                labelStyle={fontStyle}
              >
                {modalType === "create" ? "Create Match" : "Update Match"}
              </Button>
            </Card.Actions>
          </ScrollView>
        </Card>
      </Modal>
    </Portal>
  );
};

export default FormModal;
