import React, { useState } from "react";
import {
  View,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Button,
  Text,
  TextInput,
  useTheme,
  Appbar,
  Card,
  Divider,
} from "react-native-paper";
import { authService } from "../services/auth.service";
import { ILoginRequest } from "../types/auth.d";
import { setCurrentUserId } from "../services/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const router = useRouter();
  const { method } = useLocalSearchParams<{ method?: string }>();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const handleLogin = async () => {
    if (method === "phone") {
      if (!phone) return Alert.alert("Error", "Please enter your phone number");
    } else {
      if (!email || !password) {
        return Alert.alert("Error", "Please enter email and password");
      }

      try {
        setIsLoading(true);
        const credentials: ILoginRequest = { email, password };

        const errors = authService.validateLoginData(credentials);
        if (errors.length > 0) {
          throw new Error(errors.join(", "));
        }

        const authResponse = await authService.login(credentials);
        // console.log("Login response: ", authResponse);

        await authService.handleLoginSuccess(authResponse);

        const token = await authService.getToken();
        // console.log("Stored token exists:", !!token);

        if (authResponse.data && authResponse.data.user) {
          await setCurrentUserId(authResponse.data.user.id);
          // console.log("User ID: ", authResponse.data.user.id);
          await AsyncStorage.setItem(
            "user_data",
            JSON.stringify(authResponse.data.user)
          );
        } else {
          console.log("No user data in response");
        }

        router.replace("/(tabs)");
      } catch (error: any) {
        console.error("Login error:", error);
        Alert.alert(
          "Login Error",
          error.message || "Login failed. Please check your credentials."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <View style={{ alignItems: "center", paddingVertical: 24 }}>
          <Ionicons name="heart" size={60} color={theme.colors.primary} />
          <Text
            variant="headlineMedium"
            style={{
              color: theme.colors.onBackground,
              fontWeight: "bold",
              marginTop: 8,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            Welcome Back!
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.onBackground,
              opacity: 0.8,
              textAlign: "center",
              marginTop: 8,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            Sign in to continue your journey to find love
          </Text>
        </View>

        <Card
          style={{
            marginTop: 16,
            padding: 16,
            backgroundColor: theme.colors.surface,
          }}
        >
          <Text
            variant="titleLarge"
            style={{
              textAlign: "center",
              marginBottom: 24,
              color: theme.colors.onSurface,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            Sign In
          </Text>

          {method === "phone" ? (
            <TextInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              mode="outlined"
              left={<TextInput.Icon icon="phone" />}
              style={{
                marginBottom: 16,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
              theme={{
                colors: { background: theme.colors.surface },
                fonts: {
                  bodyLarge: { fontFamily: theme.fonts.bodyLarge.fontFamily },
                },
              }}
            />
          ) : (
            <View>
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
                  fonts: {
                    bodyLarge: { fontFamily: theme.fonts.bodyLarge.fontFamily },
                  },
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
                  fonts: {
                    bodyLarge: { fontFamily: theme.fonts.bodyLarge.fontFamily },
                  },
                }}
              />
              <Button
                mode="text"
                onPress={() => {}}
                style={{ alignSelf: "flex-end" }}
                textColor={theme.colors.primary}
                theme={{
                  fonts: {
                    labelLarge: {
                      fontFamily: theme.fonts.bodyLarge.fontFamily,
                    },
                  },
                }}
              >
                Forgot Password?
              </Button>
            </View>
          )}

          <Button
            mode="contained"
            onPress={handleLogin}
            disabled={isLoading}
            loading={isLoading}
            style={{ marginTop: 16, borderRadius: 12 }}
            contentStyle={{ height: 56 }}
            theme={{
              fonts: {
                labelLarge: {
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                },
              },
            }}
          >
            {method === "phone" ? "Get OTP Code" : "Sign In"}
          </Button>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 24,
            }}
          >
            <Divider style={{ flex: 1 }} />
            <Text
              variant="bodyMedium"
              style={{
                marginHorizontal: 16,
                color: theme.colors.onSurfaceVariant,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              or
            </Text>
            <Divider style={{ flex: 1 }} />
          </View>

          <Button
            mode="outlined"
            onPress={() => {}}
            style={{ marginBottom: 16, borderRadius: 12 }}
            contentStyle={{ height: 56 }}
            icon="google"
            theme={{
              fonts: {
                labelLarge: {
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                },
              },
            }}
          >
            Sign in with Google
          </Button>

          <Button
            mode="text"
            onPress={() => router.push("/register")}
            style={{ marginTop: 16 }}
            theme={{
              fonts: {
                bodyLarge: {
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                },
              },
            }}
          >
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurface,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              Don't have an account?{" "}
              <Text
                style={{
                  color: theme.colors.primary,
                  fontWeight: "bold",
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                }}
              >
                Sign up now
              </Text>
            </Text>
          </Button>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
