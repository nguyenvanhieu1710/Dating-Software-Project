import React from "react";
import { View, Image } from "react-native";
import { Card, Text, Chip, useTheme } from "react-native-paper";

interface PhotoItem {
  id: number;
  url: string;
}

interface PreviewContentProps {
  formData: any;
  photos: PhotoItem[];
  selectedInterests: string[];
  selectedGoals: string[];
  userData: any;
}

const PreviewContent: React.FC<PreviewContentProps> = ({
  formData,
  photos,
  selectedInterests,
  selectedGoals,
  userData,
}) => {
  const theme = useTheme();
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "";
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age.toString();
    } catch {
      return "";
    }
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        variant="headlineMedium"
        style={{ fontWeight: "700", marginBottom: 20, color: "#333", fontFamily: theme.fonts.bodyLarge.fontFamily }}
      >
        Profile Preview
      </Text>

      {/* Basic Info Preview */}
      <Card style={{ marginBottom: 12, backgroundColor: "#FFFFFF" }} mode="elevated">
        <Card.Content>
          <Text
            variant="titleMedium"
            style={{ fontWeight: "600", marginBottom: 8, color: "#666", fontFamily: theme.fonts.bodyLarge.fontFamily }}
          >
            Basic Information
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: "#333", lineHeight: 22, marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}
          >
            Name: {formData.first_name || "Not specified"}
          </Text>
          {formData.dob && (
            <Text
              variant="bodyMedium"
              style={{ color: "#333", lineHeight: 22, marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              Age: {calculateAge(formData.dob)} years old
            </Text>
          )}
          <Text
            variant="bodyMedium"
            style={{ color: "#333", lineHeight: 22, marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}
          >
            Gender: {formData.gender || "Not specified"}
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: "#333", lineHeight: 22, marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}
          >
            Email: {formData.email || "Not specified"}
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: "#333", lineHeight: 22, marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}
          >
            Phone: {formData.phone_number || "Not specified"}
          </Text>
        </Card.Content>
      </Card>

      {/* Photos Preview */}
      {photos.length > 0 && (
        <Card style={{ marginBottom: 12, backgroundColor: "#FFFFFF" }} mode="elevated">
          <Card.Content>
            <Text
              variant="titleMedium"
              style={{ fontWeight: "600", marginBottom: 8, color: "#666", fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              Photos ({photos.length})
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {photos.slice(0, 3).map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: photo.url }}
                  style={{ width: 60, height: 60, borderRadius: 8, backgroundColor: "#F0F0F0" }}
                />
              ))}
              {photos.length > 3 && (
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    backgroundColor: "#F3F4F6",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    variant="bodySmall"
                    style={{ color: "#6B7280", fontWeight: "500", fontFamily: theme.fonts.bodyLarge.fontFamily }}
                  >
                    +{photos.length - 3} more
                  </Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Bio Preview */}
      {formData.bio && (
        <Card style={{ marginBottom: 12, backgroundColor: "#FFFFFF" }} mode="elevated">
          <Card.Content>
            <Text
              variant="titleMedium"
              style={{ fontWeight: "600", marginBottom: 8, color: "#666", fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              About Me
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: "#333", lineHeight: 22, marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              {formData.bio}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Professional Info Preview */}
      {(formData.job_title || formData.company || formData.school) && (
        <Card style={{ marginBottom: 12, backgroundColor: "#FFFFFF" }} mode="elevated">
          <Card.Content>
            <Text
              variant="titleMedium"
              style={{ fontWeight: "600", marginBottom: 8, color: "#666", fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              Professional Information
            </Text>
            {formData.job_title && (
              <Text
                variant="bodyMedium"
                style={{ color: "#333", lineHeight: 22, marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}
              >
                Job: {formData.job_title}
              </Text>
            )}
            {formData.company && (
              <Text
                variant="bodyMedium"
                style={{ color: "#333", lineHeight: 22, marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}
              >
                Company: {formData.company}
              </Text>
            )}
            {formData.school && (
              <Text
                variant="bodyMedium"
                style={{ color: "#333", lineHeight: 22, marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}
              >
                School: {formData.school}
              </Text>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Interests Preview */}
      {selectedInterests.length > 0 && (
        <Card style={{ marginBottom: 12, backgroundColor: "#FFFFFF" }} mode="elevated">
          <Card.Content>
            <Text
              variant="titleMedium"
              style={{ fontWeight: "600", marginBottom: 8, color: "#666", fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              Interests
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {selectedInterests.map((interest) => (
                <Chip
                  key={interest}
                  style={{ marginRight: 8, marginBottom: 8 }}
                  mode="outlined"
                >
                  {interest}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Goals Preview */}
      {selectedGoals.length > 0 && (
        <Card style={{ marginBottom: 12, backgroundColor: "#FFFFFF" }} mode="elevated">
          <Card.Content>
            <Text
              variant="titleMedium"
              style={{ fontWeight: "600", marginBottom: 8, color: "#666", fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              Relationship Goals
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {selectedGoals.map((goal) => (
                <Chip
                  key={goal}
                  style={{ marginRight: 8, marginBottom: 8 }}
                  mode="outlined"
                >
                  {goal}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Account Status Preview */}
      {userData && (
        <Card style={{ marginBottom: 12, backgroundColor: "#FFFFFF" }} mode="elevated">
          <Card.Content>
            <Text
              variant="titleMedium"
              style={{ fontWeight: "600", marginBottom: 8, color: "#666", fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              Account Status
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: "#333", lineHeight: 22, marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              Status: {userData.user_status || "Unknown"}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: "#333", lineHeight: 22, marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              Verified: {userData.is_verified ? "Yes" : "No"}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: "#333", lineHeight: 22, marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              Popularity Score: {userData.popularity_score || 0}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: "#333", lineHeight: 22, marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              Member Since: {formatDate(userData.created_at || "")}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Privacy Settings Preview */}
      {(formData.hideAge || formData.hideDistance) && (
        <Card style={{ marginBottom: 12, backgroundColor: "#FFFFFF" }} mode="elevated">
          <Card.Content>
            <Text
              variant="titleMedium"
              style={{ fontWeight: "600", marginBottom: 8, color: "#666", fontFamily: theme.fonts.bodyLarge.fontFamily }}
            >
              Privacy Settings
            </Text>
            {formData.hideAge && (
              <Text
                variant="bodyMedium"
                style={{ color: "#333", lineHeight: 22, marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}
              >
                Hide My Age: Yes
              </Text>
            )}
            {formData.hideDistance && (
              <Text
                variant="bodyMedium"
                style={{ color: "#333", lineHeight: 22, marginBottom: 4, fontFamily: theme.fonts.bodyLarge.fontFamily }}
              >
                Hide My Distance: Yes
              </Text>
            )}
          </Card.Content>
        </Card>
      )}

      <Card style={{ marginTop: 20, borderColor: "#eee" }} mode="outlined">
        <Card.Content>
          <Text
            variant="bodySmall"
            style={{ color: "#888", textAlign: "center", lineHeight: 18, fontFamily: theme.fonts.bodyLarge.fontFamily }}
          >
            Review your profile information before saving. Changes will be
            visible to other users after saving.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

export default PreviewContent;