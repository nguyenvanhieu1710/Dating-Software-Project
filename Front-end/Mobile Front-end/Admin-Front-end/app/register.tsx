import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  TextInput,
  Button,
  Text,
  useTheme,
  HelperText,
  Surface,
} from "react-native-paper";
import { router } from "expo-router";
import { adminAuthService } from "@/services/admin-auth.service";
import { IRegisterRequest } from "@/types/auth";

export default function RegisterScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate bằng service
    const registerData: IRegisterRequest = {
      email,
      password,
      phone_number: phoneNumber,
    };
    const validationErrors = adminAuthService.validateRegisterData(registerData);

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        if (error.includes("Email")) {
          newErrors.email = error;
        } else if (error.includes("Password")) {
          newErrors.password = error;
        } else if (error.includes("Phone")) {
          newErrors.phoneNumber = error;
        }
      });
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const registerData: IRegisterRequest = {
        email,
        password,
        phone_number: phoneNumber,
      };

      const response = await adminAuthService.register(registerData);

      if (response.success) {
        await adminAuthService.handleRegisterSuccess(response);

        Alert.alert(
          "Registration Successful",
          "Your account has been created successfully!",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(drawers)"),
            },
          ]
        );
      } else {
        Alert.alert("Registration Failed", response.message || "An error occurred");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      Alert.alert(
        "Registration Error",
        error.response?.data?.message ||
          error.message ||
          "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 24,
      justifyContent: "center",
    },
    card: {
      padding: 24,
      borderRadius: 16,
      elevation: 2,
    },
    header: {
      alignItems: "center",
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 8,
      color: theme.colors.onSurface,
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      textAlign: "center",
      fontFamily: theme.fonts.bodyLarge.fontFamily,
    },
    form: {
      gap: 16,
    },
    input: {
      backgroundColor: theme.colors.surface,
    },
    button: {
      marginTop: 8,
      paddingVertical: 6,
    },
    buttonLabel: {
      fontSize: 16,
      fontWeight: "600",
    },
    backButton: {
      marginTop: 16,
    },
    backButtonLabel: {
      fontSize: 15,
    },
    footer: {
      marginTop: 24,
      alignItems: "center",
    },
    footerText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      textAlign: "center",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Surface style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Sign up to get started with Admin Panel
              </Text>
            </View>

            <View style={styles.form}>
              {/* Email Input */}
              <View>
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) {
                      setErrors({ ...errors, email: "" });
                    }
                  }}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  left={<TextInput.Icon icon="email" />}
                  error={!!errors.email}
                  disabled={isLoading}
                  style={styles.input}
                />
                {errors.email && (
                  <HelperText type="error" visible={!!errors.email}>
                    {errors.email}
                  </HelperText>
                )}
              </View>

              {/* Phone Number Input */}
              <View>
                <TextInput
                  label="Phone Number"
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    if (errors.phoneNumber) {
                      setErrors({ ...errors, phoneNumber: "" });
                    }
                  }}
                  mode="outlined"
                  keyboardType="phone-pad"
                  left={<TextInput.Icon icon="phone" />}
                  error={!!errors.phoneNumber}
                  disabled={isLoading}
                  style={styles.input}
                  placeholder="0123456789"
                />
                {errors.phoneNumber && (
                  <HelperText type="error" visible={!!errors.phoneNumber}>
                    {errors.phoneNumber}
                  </HelperText>
                )}
              </View>

              {/* Password Input */}
              <View>
                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors({ ...errors, password: "" });
                    }
                  }}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                  error={!!errors.password}
                  disabled={isLoading}
                  style={styles.input}
                />
                {errors.password && (
                  <HelperText type="error" visible={!!errors.password}>
                    {errors.password}
                  </HelperText>
                )}
              </View>

              {/* Confirm Password Input */}
              <View>
                <TextInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: "" });
                    }
                  }}
                  mode="outlined"
                  secureTextEntry={!showConfirmPassword}
                  left={<TextInput.Icon icon="lock-check" />}
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? "eye-off" : "eye"}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  }
                  error={!!errors.confirmPassword}
                  disabled={isLoading}
                  style={styles.input}
                />
                {errors.confirmPassword && (
                  <HelperText type="error" visible={!!errors.confirmPassword}>
                    {errors.confirmPassword}
                  </HelperText>
                )}
              </View>

              {/* Register Button */}
              <Button
                mode="contained"
                onPress={handleRegister}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
                contentStyle={{ paddingVertical: 6 }}
                labelStyle={styles.buttonLabel}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              {/* Back to Login Button */}
              <Button
                mode="text"
                onPress={handleBackToLogin}
                disabled={isLoading}
                style={styles.backButton}
                labelStyle={styles.backButtonLabel}
              >
                Already have an account? Sign In
              </Button>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By signing up, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}