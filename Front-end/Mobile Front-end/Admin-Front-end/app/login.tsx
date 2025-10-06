import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button, Surface, useTheme, Icon } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import { adminAuthService } from "@/services/admin-auth.service";
import { ILoginRequest } from "@/types/auth";

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const loginData: ILoginRequest = { email, password };
    const validationErrors = adminAuthService.validateLoginData(loginData);

    if (validationErrors.length > 0) {
      alert(validationErrors.join("\n"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await adminAuthService.login(loginData);

      if (response.success) {
        await adminAuthService.handleLoginSuccess(response);
        router.replace("/(drawers)");
      } else {
        alert(response.message || "Invalid credentials");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "An error occurred during login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "center", padding: 24 }}
      >
        <Surface
          style={{
            padding: 24,
            borderRadius: 16,
            elevation: 4,
            backgroundColor: theme.colors.surface,
          }}
        >
          {/* Logo & Title */}
          <Surface
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginBottom: 16,
              backgroundColor: colors.primary + "20",
            }}
          >
            <Icon source="heart" size={48} color={colors.primary} />
          </Surface>

          <Text
            variant="headlineLarge"
            style={{
              textAlign: "center",
              marginBottom: 8,
              fontFamily: theme.fonts.titleLarge.fontFamily,
            }}
          >
            Admin Panel
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              textAlign: "center",
              marginBottom: 32,
              color: theme.colors.onSurfaceVariant,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            Sign in to your account
          </Text>

          {/* Email */}
          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            disabled={isLoading}
            style={{ marginBottom: 16 }}
          />

          {/* Password */}
          <TextInput
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            disabled={isLoading}
            style={{ marginBottom: 24 }}
          />

          {/* Login Button */}
          <Button
            mode="contained"
            onPress={handleLogin}
            disabled={isLoading}
            loading={isLoading}
            style={{
              borderRadius: 12,
              paddingVertical: 6,
            }}
            labelStyle={{
              fontFamily: theme.fonts.bodyLarge.fontFamily,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </Surface>

        {/* Footer */}
        <Text
          variant="bodySmall"
          style={{
            textAlign: "center",
            marginTop: 24,
            color: theme.colors.onSurfaceVariant,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Secure admin access for Vibe platform management
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
