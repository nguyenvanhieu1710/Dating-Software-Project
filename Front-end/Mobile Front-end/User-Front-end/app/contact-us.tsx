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

const ContactUsScreen = () => {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const handleSubmit = () => {
    if (name && email && message) {
      onToggleSnackBar();
      setName("");
      setEmail("");
      setMessage("");
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
          label="Tin nhắn"
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
          style={{ backgroundColor: theme.colors.primary }}
          action={{
            label: "OK",
            onPress: onDismissSnackBar,
          }}
        >
          Thank you! Your message has been sent.
        </Snackbar>
      </ScrollView>
    </>
  );
};

export default ContactUsScreen;
