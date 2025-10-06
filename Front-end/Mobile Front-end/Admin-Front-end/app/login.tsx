import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import { useTheme } from "react-native-paper";
import { adminAuthService } from "@/services/admin-auth.service";
import { ILoginRequest } from "@/types/auth";

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validate input trước khi gửi
    const loginData: ILoginRequest = { email, password };
    const validationErrors = adminAuthService.validateLoginData(loginData);

    if (validationErrors.length > 0) {
      Alert.alert("Validation Error", validationErrors.join("\n"));
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API login
      const response = await adminAuthService.login(loginData);

      if (response.success) {
        // Lưu token và user data
        await adminAuthService.handleLoginSuccess(response);

        // Kiểm tra nếu cần 2FA (có thể thêm flag từ backend)
        // Tạm thời giả lập 2FA cho demo
        setShowTwoFactor(true);
      } else {
        Alert.alert("Login Failed", response.message || "Invalid credentials");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Error",
        error.response?.data?.message || 
        error.message || 
        "An error occurred during login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSubmit = async () => {
    if (!twoFactorCode) {
      Alert.alert("Error", "Please enter the 2FA code");
      return;
    }

    if (twoFactorCode.length !== 6) {
      Alert.alert("Error", "2FA code must be 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Thêm API endpoint cho 2FA verification
      // const response = await adminAuthService.verify2FA({ code: twoFactorCode });

      // Simulate 2FA verification for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate to main app
      router.replace("/(drawers)");
    } catch (error: any) {
      console.error("2FA verification error:", error);
      Alert.alert(
        "Verification Failed",
        error.response?.data?.message || 
        error.message || 
        "Invalid 2FA code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowTwoFactor(false);
    setTwoFactorCode("");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    keyboardView: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: "center",
    },
    header: {
      alignItems: "center",
      marginBottom: 48,
    },
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      fontFamily: theme.fonts.titleLarge.fontFamily,
      marginBottom: 8,
    },
    subtitle: {
      fontFamily: theme.fonts.bodyLarge.fontFamily,
      fontSize: 16,
      textAlign: "center",
    },
    form: {
      marginBottom: 32,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      fontFamily: theme.fonts.bodyLarge.fontFamily,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 12,
      borderWidth: 1,
      gap: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
    loginButton: {
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 8,
    },
    loginButtonText: {
      fontFamily: theme.fonts.bodyLarge.fontFamily,
      color: "white",
      fontSize: 18,
      fontWeight: "600",
    },
    twoFactorInfo: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F3E8FF",
      padding: 16,
      borderRadius: 12,
      marginBottom: 24,
      gap: 12,
    },
    twoFactorText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
    backButton: {
      alignItems: "center",
      marginTop: 16,
    },
    backButtonText: {
      fontFamily: theme.fonts.bodyLarge.fontFamily,
      fontSize: 16,
      fontWeight: "500",
    },
    footer: {
      alignItems: "center",
    },
    footerText: {
      fontFamily: theme.fonts.bodyLarge.fontFamily,
      fontSize: 14,
      textAlign: "center",
    },
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View
              style={[
                styles.logoContainer,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <IconSymbol name="shield.fill" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>
              Admin Panel
            </Text>
            <Text style={[styles.subtitle, { color: colors.icon }]}>
              {showTwoFactor
                ? "Two-Factor Authentication"
                : "Sign in to your account"}
            </Text>
          </View>

          {!showTwoFactor ? (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Email
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <IconSymbol
                    name="envelope.fill"
                    size={20}
                    color={colors.icon}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.icon}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Password
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <IconSymbol name="lock.fill" size={20} color={colors.icon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.icon}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { 
                    backgroundColor: colors.primary,
                    opacity: isLoading ? 0.7 : 1
                  },
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.twoFactorInfo}>
                <IconSymbol name="key.fill" size={24} color={colors.primary} />
                <Text style={[styles.twoFactorText, { color: colors.text }]}>
                  Enter the 6-digit code from your authenticator app
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  2FA Code
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <IconSymbol name="key.fill" size={20} color={colors.icon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="000000"
                    placeholderTextColor={colors.icon}
                    value={twoFactorCode}
                    onChangeText={setTwoFactorCode}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus
                    editable={!isLoading}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { 
                    backgroundColor: colors.primary,
                    opacity: isLoading ? 0.7 : 1
                  },
                ]}
                onPress={handleTwoFactorSubmit}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? "Verifying..." : "Verify & Sign In"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToLogin}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.backButtonText, 
                    { 
                      color: colors.primary,
                      opacity: isLoading ? 0.5 : 1
                    }
                  ]}
                >
                  Back to Login
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.icon }]}>
              Secure admin access for Vibe platform management
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}