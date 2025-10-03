import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Image } from "react-native";
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { useRouter } from "expo-router";
import Header from "../profile/ProfileHeader";
import StatCard from "../profile/StatCard";
import { UpgradeTier } from "../profile/UpgradeTier";
import { getUserProfile, getCurrentUserId, User } from "../../services/userApi";
import { consumableService } from "../../services/comsumable.service";
import { IConsumable } from "../../types/consumable";

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [consumable, setConsumable] = useState<IConsumable | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profileData = await getUserProfile();
      setUser(profileData as User);
      loadConsumableOfUser();
    } catch (err: any) {
      if (err.message === "USER_NOT_LOGGED_IN")
        setError("Please login to view your profile.");
      else setError("Failed to load profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const loadConsumableOfUser = async () => {
    const userId = await getCurrentUserId();
    if (!userId) return;
    try {
      const response = await consumableService.getConsumablesByUserId(userId);
      console.log("Consumable of user: ", response);
      if (response.success && response.data) {
        setConsumable(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProfile = async () => {
    const userId = await getCurrentUserId();
    // console.log("User ID: ", userId);
    if (!userId) return;
    router.push({
      pathname: "/edit-profile",
      params: { userId: userId.toString() },
    });
  };

  const handleRefresh = () => loadUserProfile();
  const handleLogin = () => router.push("/login");
  const handleSettings = () => router.push("/settings");
  const handleSafetyCenter = () => router.push("/safety-center");
  const handleUpgrade = () => router.push("/subscriptions");
  const handleConsumable = () => router.push("/consumable");

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <Header onSettings={handleSettings} onSafety={handleSafetyCenter} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 60,
          }}
        >
          <ActivityIndicator animating size="large" />
          <Text
            style={{
              marginTop: 16,
              fontSize: 16,
              color: theme.colors.primary,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <Header onSettings={handleSettings} onSafety={handleSafetyCenter} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ fontSize: 48, color: "#EF4444" }}>⚠️</Text>
          <Text
            style={{
              marginTop: 16,
              fontSize: 16,
              color: "#EF4444",
              textAlign: "center",
            }}
          >
            {error}
          </Text>
          {error.includes("login") ? (
            <Button
              mode="contained"
              onPress={handleLogin}
              style={{ marginTop: 20, borderRadius: 12 }}
            >
              Login
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleRefresh}
              style={{ marginTop: 20, borderRadius: 12 }}
            >
              Try Again
            </Button>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header onSettings={handleSettings} onSafety={handleSafetyCenter} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {user ? (
          <>
            <Card
              style={{
                borderRadius: 20,
                elevation: 0,
                backgroundColor: "transparent",
              }}
            >
              <Card.Content style={{ alignItems: "center" }}>
                <Image
                  source={{
                    uri: user.avatar,
                  }}
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 70,
                    borderWidth: 4,
                    borderColor: "#F3E8FF",
                    backgroundColor: "#F3E8FF",
                    marginBottom: 16,
                  }}
                />
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: theme.colors.primary,
                    marginBottom: 8,
                    textAlign: "center",
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  {user.name || "Unknown User"}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#6B7280",
                    marginBottom: 32,
                    textAlign: "center",
                    lineHeight: 24,
                    paddingHorizontal: 20,
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  {user.bio || "No bio available"}
                </Text>
                <Button
                  mode="outlined"
                  onPress={handleEditProfile}
                  style={{
                    borderRadius: 20,
                    borderColor: "#E9D5FF",
                    backgroundColor: theme.colors.background,
                  }}
                  labelStyle={{
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  Chỉnh sửa hồ sơ
                </Button>
              </Card.Content>
            </Card>

            <View style={{ width: "100%", marginTop: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <StatCard
                  label="Super Likes"
                  value={consumable?.super_likes_balance}
                  onPress={handleConsumable}
                />
                <StatCard
                  label="My Boots"
                  value={consumable?.boosts_balance}
                  onPress={handleConsumable}
                />
                <StatCard label="Subscriptions" onPress={handleUpgrade} />
              </View>

              <Card style={{ borderRadius: 20, padding: 20, marginBottom: 16 }}>
                <Card.Content>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#1F2937",
                      textAlign: "center",
                      marginBottom: 16,
                      fontFamily: theme.fonts.bodyLarge.fontFamily,
                    }}
                  >
                    Upgrade Your Experience
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 8 }}
                  >
                    <UpgradeTier
                      tier={{
                        name: "Gold",
                        price: "$9.99",
                        period: "/month",
                        features: [
                          "Unlimited Likes",
                          "See who likes you",
                          "5 Super Likes/week",
                        ],
                        badge: "MOST POPULAR",
                      }}
                      onPress={handleUpgrade}
                    />
                    <UpgradeTier
                      tier={{
                        name: "Platinum",
                        price: "$19.99",
                        period: "/month",
                        features: [
                          "All Gold features",
                          "Message before matching",
                          "Priority likes",
                          "10 Super Likes/week",
                        ],
                        badge: "BEST VALUE",
                      }}
                      onPress={handleUpgrade}
                    />
                    <UpgradeTier
                      tier={{
                        name: "Plus",
                        price: "$4.99",
                        period: "/month",
                        features: [
                          "Unlimited Likes",
                          "Rewind last swipe",
                          "1 Super Like/week",
                        ],
                      }}
                      onPress={handleUpgrade}
                    />
                  </ScrollView>

                  <Button
                    mode="contained"
                    onPress={handleUpgrade}
                    style={{ marginTop: 12, borderRadius: 14 }}
                    labelStyle={{
                      fontFamily: theme.fonts.bodyLarge.fontFamily,
                    }}
                  >
                    Upgrade Now
                  </Button>
                </Card.Content>
              </Card>
            </View>
          </>
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 60,
            }}
          >
            <Text style={{ fontSize: 48, color: "#EF4444" }}>⚠️</Text>
            <Text
              style={{
                marginTop: 16,
                fontSize: 16,
                color: "#EF4444",
                textAlign: "center",
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              No user data available.
            </Text>
            <Button
              mode="contained"
              onPress={handleRefresh}
              style={{ marginTop: 20, borderRadius: 12 }}
              labelStyle={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              Try Again
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
