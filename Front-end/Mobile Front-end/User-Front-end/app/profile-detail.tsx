import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Surface, Chip, ActivityIndicator } from "react-native-paper";
import { useTheme } from "react-native-paper";
import { ProfileDetailHeader } from "./profile/profile-detail/ProfileDetailHeader";
import { ProfilePhoto } from "./profile/profile-detail/ProfilePhoto";
import { ProfileInfoSection } from "./profile/profile-detail/ProfileInfoSection";
import { ProfileActionButtons } from "./profile/profile-detail/ProfileActionButtons";
import { ProfileFooter } from "./profile/profile-detail/ProfileFooter";
import { userService } from "@/services/user.service";
import { photoService } from "@/services/photo.service";
import { IPhoto } from "@/types/photo";
import { IUserProfile } from "@/types/user";
import { useLocalSearchParams } from "expo-router";

export default function ProfileDetailScreen() {
  const theme = useTheme();
  const { userId } = useLocalSearchParams();
  const [users, setUsers] = useState<IUserProfile | null>(null);
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // console.log("User ID: ", userId);
      const userWithProfile = await userService.getUserById(userId as any);
      // console.log("User With Profile: ", userWithProfile);
      const photos = await photoService.getPhotosByUserId(userId as any);
      // console.log("Photos: ", photos);
      setPhotos(photos.data as IPhoto[]);
      setUsers(userWithProfile.data as IUserProfile);
    } catch (err: any) {
      setError("Failed to load profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator animating={true} color={theme.colors.primary} />
        <Text
          style={{
            marginTop: 12,
            color: theme.colors.primary,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !users) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <Text
          style={{
            color: theme.colors.error,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          {error || "No user data available."}
        </Text>
      </SafeAreaView>
    );
  }

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <ProfileDetailHeader name={users.first_name} age={calculateAge(users.dob)} />
        <ProfilePhoto photos={photos} />

        <Surface
          style={{ padding: 20, margin: 16, borderRadius: 20, elevation: 3 }}
        >
          {/* About me */}
          <ProfileInfoSection title="About me">
            <Text
              style={{
                color: theme.colors.onSurfaceVariant,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              {users.bio || "No bio available"}
            </Text>
          </ProfileInfoSection>

          {/* Hobbies */}
          {/* <ProfileInfoSection title="Hobbies">
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {(users.hobbies || []).map((hobby, index) => (
                <Chip
                  key={index}
                  style={{ margin: 4 }}
                  textStyle={{
                    color: theme.colors.primary,
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  {hobby}
                </Chip>
              ))}
              {(!users.hobbies || users.hobbies.length === 0) && (
                <Text
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  No hobbies listed
                </Text>
              )}
            </View>
          </ProfileInfoSection> */}

          {/* Details */}
          <ProfileInfoSection title="Details">
            {[
              { label: "Age", value: calculateAge(users.dob) },
              { label: "Name", value: users.first_name },
              { label: "Job", value: users.job_title || "Not specified" },
              { label: "Company", value: users.company || "Not specified" },
              { label: "Education", value: users.education || "Not specified" },
              {
                label: "Height",
                value: users.height_cm
                  ? `${users.height_cm} cm`
                  : "Not specified",
              },
              {
                label: "Relationship Goals",
                value: users.relationship_goals || "Not specified",
              },
            ].map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    width: "40%",
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  {item.label}
                </Text>
                <Text
                  style={{
                    color: theme.colors.onSurface,
                    width: "55%",
                    textAlign: "right",
                    fontWeight: "500",
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </ProfileInfoSection>
        </Surface>

        <ProfileFooter userId={users.id.toString()} />
      </ScrollView>
      <ProfileActionButtons userId={users.id.toString()} />
    </SafeAreaView>
  );
}
