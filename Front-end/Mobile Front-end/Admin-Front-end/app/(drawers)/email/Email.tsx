import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  Snackbar,
  Text,
  useTheme,
} from "react-native-paper";
import { emailService } from "@/services/email.service";

const AdminEmailScreen = () => {
  const theme = useTheme();
  const [allUsersSubject, setAllUsersSubject] = useState("");
  const [allUsersMessage, setAllUsersMessage] = useState("");
  const [specificEmail, setSpecificEmail] = useState("");
  const [specificSubject, setSpecificSubject] = useState("");
  const [specificMessage, setSpecificMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarError, setSnackbarError] = useState(false);

  const onToggleSnackBar = (message: string, isError: boolean = false) => {
    setSnackbarMessage(message);
    setSnackbarError(isError);
    setVisible(true);
  };
  const onDismissSnackBar = () => setVisible(false);

  const handleSendToAllUsers = async () => {
    const emailData = {
      subject: allUsersSubject,
      htmlContent: `<p>${allUsersMessage}</p>`,
    };

    const errors = emailService.validateEmailData(emailData);
    if (errors.length > 0) {
      onToggleSnackBar(errors.join(", "), true);
      return;
    }

    try {
      const response = await emailService.sendEmailToAllUsers(emailData);
    //   console.log("Response of sendEmailToAllUsers: ", response);
      if (response.success) {
        onToggleSnackBar(
          `Email sent to ${response.success} users, ${response.error} failed`
        );
        setAllUsersSubject("");
        setAllUsersMessage("");
      } else {
        onToggleSnackBar(response.message || "Failed to send emails", true);
      }
    } catch (error) {
      console.error("Error sending email to all users:", error);
      onToggleSnackBar("An error occurred while sending emails", true);
    }
  };

  const handleSendToSpecificUser = async () => {
    const emailData = {
      email: specificEmail,
      subject: specificSubject,
      htmlContent: `<p>${specificMessage}</p>`,
    };

    const errors = emailService.validateEmailData(emailData);
    if (errors.length > 0) {
      onToggleSnackBar(errors.join(", "), true);
      return;
    }

    try {
      const response = await emailService.sendEmailToSpecificUsers(emailData);
      if (response.success) {
        onToggleSnackBar("Email sent successfully");
        setSpecificEmail("");
        setSpecificSubject("");
        setSpecificMessage("");
      } else {
        onToggleSnackBar(response.message || "Failed to send email", true);
      }
    } catch (error) {
      console.error("Error sending email to specific user:", error);
      onToggleSnackBar("An error occurred while sending email", true);
    }
  };

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          padding: 16,
        }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Text
          variant="headlineMedium"
          style={{
            color: theme.colors.primary,
            textAlign: "center",
            marginBottom: 24,
            fontWeight: "bold",
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Send Email to Users
        </Text>

        {/* Section for sending email to all users */}
        <Text
          variant="titleMedium"
          style={{
            color: theme.colors.onBackground,
            marginBottom: 16,
            fontWeight: "bold",
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Send to All Users
        </Text>
        <TextInput
          label="Subject"
          value={allUsersSubject}
          onChangeText={setAllUsersSubject}
          mode="outlined"
          style={{
            marginBottom: 16,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
          theme={{ colors: { primary: theme.colors.primary } }}
        />
        <TextInput
          label="Message"
          value={allUsersMessage}
          onChangeText={setAllUsersMessage}
          mode="outlined"
          multiline
          numberOfLines={5}
          style={{ marginBottom: 24 }}
          theme={{ colors: { primary: theme.colors.primary } }}
        />
        <Button
          mode="contained"
          onPress={handleSendToAllUsers}
          disabled={!allUsersSubject || !allUsersMessage}
          style={{
            borderRadius: 8,
            paddingVertical: 8,
            backgroundColor: theme.colors.primary,
            marginBottom: 32,
          }}
          labelStyle={{
            color: theme.colors.onPrimary,
            fontWeight: "bold",
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Send to All Users
        </Button>

        {/* Section for sending email to specific user */}
        <Text
          variant="titleMedium"
          style={{
            color: theme.colors.onBackground,
            marginBottom: 16,
            fontWeight: "bold",
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Send to Specific User
        </Text>
        <TextInput
          label="Recipient Email"
          value={specificEmail}
          onChangeText={setSpecificEmail}
          mode="outlined"
          keyboardType="email-address"
          style={{ marginBottom: 16 }}
          theme={{ colors: { primary: theme.colors.primary } }}
        />
        <TextInput
          label="Subject"
          value={specificSubject}
          onChangeText={setSpecificSubject}
          mode="outlined"
          style={{
            marginBottom: 16,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
          theme={{ colors: { primary: theme.colors.primary } }}
        />
        <TextInput
          label="Message"
          value={specificMessage}
          onChangeText={setSpecificMessage}
          mode="outlined"
          multiline
          numberOfLines={5}
          style={{ marginBottom: 24 }}
          theme={{ colors: { primary: theme.colors.primary } }}
        />
        <Button
          mode="contained"
          onPress={handleSendToSpecificUser}
          disabled={!specificEmail || !specificSubject || !specificMessage}
          style={{
            borderRadius: 8,
            paddingVertical: 8,
            backgroundColor: theme.colors.primary,
          }}
          labelStyle={{
            color: theme.colors.onPrimary,
            fontWeight: "bold",
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Send to Specific User
        </Button>

        {/* Snackbar for feedback */}
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          duration={3000}
          style={{
            backgroundColor: snackbarError
              ? theme.colors.error
              : theme.colors.primary,
          }}
          action={{
            label: "OK",
            onPress: onDismissSnackBar,
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </ScrollView>
    </>
  );
};

export default AdminEmailScreen;