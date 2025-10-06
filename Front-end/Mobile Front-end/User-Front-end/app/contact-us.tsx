import Header from "@/components/header/Header";
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

const ContactUsScreen = () => {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarError, setSnackbarError] = useState(false);

  const onToggleSnackBar = (message: string, isError: boolean = false) => {
    setSnackbarMessage(message);
    setSnackbarError(isError);
    setVisible(true);
  };
  const onDismissSnackBar = () => setVisible(false);

  const handleSubmit = async () => {
    // Validate inputs
    const emailData = {
      email,
      subject: `Contact Us Message from ${name}`,
      htmlContent: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    };

    const errors = emailService.validateEmailData(emailData);
    if (errors.length > 0) {
      onToggleSnackBar(errors.join(", "), true);
      return;
    }

    try {
      const response = await emailService.sendEmailToSpecificUsers(emailData);
      // console.log("Response of sendEmailToSpecificUsers: ", response);
      if (response.success) {
        onToggleSnackBar("Thank you! Your message has been sent.");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        onToggleSnackBar(response.message || "Failed to send message", true);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      onToggleSnackBar("An error occurred while sending your message", true);
    }
  };

  return (
    <>
      <Header title="Contact Us" />
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
          Contact us
        </Text>
        <Text
          variant="bodyMedium"
          style={{
            color: theme.colors.onBackground,
            textAlign: "center",
            marginBottom: 32,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          You have questions or need support with your journey to find love?
          Send a message to us!
        </Text>
        <TextInput
          label="Full name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={{
            marginBottom: 16,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
          theme={{ colors: { primary: theme.colors.primary } }}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          style={{ marginBottom: 16 }}
          theme={{ colors: { primary: theme.colors.primary } }}
        />
        <TextInput
          label="Message"
          value={message}
          onChangeText={setMessage}
          mode="outlined"
          multiline
          numberOfLines={5}
          style={{ marginBottom: 24 }}
          theme={{ colors: { primary: theme.colors.primary } }}
        />
        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!name || !email || !message}
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
          Send message
        </Button>
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

export default ContactUsScreen;