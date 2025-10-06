import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Button,
  Card,
  Divider,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { authService } from "@/services/auth.service";

export default function RegisterScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [phone_number, setPhone_number] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirm || !phone_number) {
      return Alert.alert("Error", "Please fill in all fields");
    }
    if (password !== confirm) {
      return Alert.alert("Error", "Passwords do not match");
    }
    try {
      setIsLoading(true);
      const response = await authService.register({
        email,
        password,
        phone_number
      });
      if (response.success) {
        Alert.alert("Success", "Account created successfully!");        
        router.replace("/login");
      } else {
        Alert.alert("Error", "Failed to create account");
      }
    } catch (error) {
      console.error("Error registering:", error);
      Alert.alert("Error", "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        {/* Title */}
        <Text
          variant="headlineMedium"
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginTop: 24,
            color: theme.colors.onBackground,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Join Us Today
        </Text>

        <Text
          variant="bodyMedium"
          style={{
            textAlign: "center",
            marginBottom: 24,
            marginTop: 8,
            opacity: 0.8,
            color: theme.colors.onBackground,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Create an account to start your journey
        </Text>

        {/* Form */}
        <Card style={{ padding: 16, backgroundColor: theme.colors.surface }}>
          <TextInput
            label="Phone Number"
            value={phone_number}
            onChangeText={setPhone_number}
            mode="outlined"
            left={<TextInput.Icon icon="phone" />}
            style={{ marginBottom: 16 }}
            theme={{
              colors: { background: theme.colors.surface },
            }}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            left={<TextInput.Icon icon="email" />}
            style={{ marginBottom: 16 }}
            theme={{
              colors: { background: theme.colors.surface },
            }}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            mode="outlined"
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye" : "eye-off"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={{ marginBottom: 16 }}
            theme={{
              colors: { background: theme.colors.surface },
            }}
          />

          <TextInput
            label="Confirm Password"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry={!showConfirm}
            mode="outlined"
            left={<TextInput.Icon icon="lock-check" />}
            right={
              <TextInput.Icon
                icon={showConfirm ? "eye" : "eye-off"}
                onPress={() => setShowConfirm(!showConfirm)}
              />
            }
            style={{ marginBottom: 16 }}
            theme={{
              colors: { background: theme.colors.surface },
            }}
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            style={{ marginTop: 8, borderRadius: 12 }}
            contentStyle={{ height: 56 }}
            theme={{
              fonts: {
                labelLarge: {
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                },
              },
            }}
          >
            Register
          </Button>

          <Divider style={{ marginVertical: 24 }} />

          <Button
            mode="text"
            onPress={() => router.replace("/login")}
            style={{ alignSelf: "center" }}
          >
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurface,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              Already have an account?{" "}
              <Text
                style={{
                  color: theme.colors.primary,
                  fontWeight: "bold",
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                }}
              >
                Login
              </Text>
            </Text>
          </Button>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
