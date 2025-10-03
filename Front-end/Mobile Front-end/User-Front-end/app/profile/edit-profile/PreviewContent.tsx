import React from "react";
import { View, Image, StyleSheet } from "react-native";
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

export const PreviewContent: React.FC<PreviewContentProps> = ({
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
    <View style={styles.container}>
      <Text
        variant="headlineMedium"
        style={[styles.title, { fontFamily: theme.fonts.bodyLarge.fontFamily }]}
      >
        Profile Preview
      </Text>

      {/* Basic Info Preview */}
      <Card style={styles.section} mode="elevated">
        <Card.Content>
          <Text
            variant="titleMedium"
            style={[
              styles.sectionTitle,
              { fontFamily: theme.fonts.bodyLarge.fontFamily },
            ]}
          >
            Basic Information
          </Text>
          <Text variant="bodyMedium" style={[styles.text, { fontFamily: theme.fonts.bodyLarge.fontFamily }]}>
            Name: {formData.first_name || "Not specified"}
          </Text>
          {formData.dob && (
            <Text variant="bodyMedium" style={[styles.text, { fontFamily: theme.fonts.bodyLarge.fontFamily }]}>
              Age: {calculateAge(formData.dob)} years old
            </Text>
          )}
          <Text variant="bodyMedium" style={[styles.text, { fontFamily: theme.fonts.bodyLarge.fontFamily }]}>
            Gender: {formData.gender || "Not specified"}
          </Text>
          <Text variant="bodyMedium" style={[styles.text, { fontFamily: theme.fonts.bodyLarge.fontFamily }]}>
            Email: {formData.email || "Not specified"}
          </Text>
          <Text variant="bodyMedium" style={[styles.text, { fontFamily: theme.fonts.bodyLarge.fontFamily }]}>
            Phone: {formData.phone_number || "Not specified"}
          </Text>
        </Card.Content>
      </Card>

      {/* Photos Preview */}
      {photos.length > 0 && (
        <Card style={styles.section} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { fontFamily: theme.fonts.bodyLarge.fontFamily }]}>
              Photos ({photos.length})
            </Text>
            <View style={styles.photosContainer}>
              {photos.slice(0, 3).map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: photo.url }}
                  style={styles.photo}
                />
              ))}
              {photos.length > 3 && (
                <View style={styles.photoMore}>
                  <Text variant="bodySmall" style={[styles.photoMoreText, { fontFamily: theme.fonts.bodyLarge.fontFamily }]}>
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
        <Card style={styles.section} mode="elevated">
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[
                styles.sectionTitle,
                { fontFamily: theme.fonts.bodyLarge.fontFamily },
              ]}
            >
              About Me
            </Text>
            <Text variant="bodyMedium" style={[styles.text, { fontFamily: theme.fonts.bodyLarge.fontFamily }]}>
              {formData.bio}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Professional Info Preview */}
      {(formData.job_title || formData.company || formData.school) && (
        <Card style={styles.section} mode="elevated">
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[
                styles.sectionTitle,
                { fontFamily: theme.fonts.bodyLarge.fontFamily },
              ]}
            >
              Professional Information
            </Text>
            {formData.job_title && (
              <Text variant="bodyMedium" style={[styles.text, { fontFamily: theme.fonts.bodyLarge.fontFamily }]}>
                Job: {formData.job_title}
              </Text>
            )}
            {formData.company && (
              <Text variant="bodyMedium" style={[styles.text, { fontFamily: theme.fonts.bodyLarge.fontFamily }]}>
                Company: {formData.company}
              </Text>
            )}
            {formData.school && (
              <Text variant="bodyMedium" style={[styles.text, { fontFamily: theme.fonts.bodyLarge.fontFamily }]}>
                School: {formData.school}
              </Text>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Interests Preview */}
      {selectedInterests.length > 0 && (
        <Card style={styles.section} mode="elevated">
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[
                styles.sectionTitle,
                { fontFamily: theme.fonts.bodyLarge.fontFamily },
              ]}
            >
              Interests
            </Text>
            <View style={styles.chipsContainer}>
              {selectedInterests.map((interest) => (
                <Chip key={interest} style={styles.chip} mode="outlined">
                  {interest}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Goals Preview */}
      {selectedGoals.length > 0 && (
        <Card style={styles.section} mode="elevated">
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[
                styles.sectionTitle,
                { fontFamily: theme.fonts.bodyLarge.fontFamily },
              ]}
            >
              Relationship Goals
            </Text>
            <View style={styles.chipsContainer}>
              {selectedGoals.map((goal) => (
                <Chip key={goal} style={styles.chip} mode="outlined">
                  {goal}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Account Status Preview */}
      {userData && (
        <Card style={styles.section} mode="elevated">
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[
                styles.sectionTitle,
                { fontFamily: theme.fonts.bodyLarge.fontFamily },
              ]}
            >
              Account Status
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.text,
                { fontFamily: theme.fonts.bodyLarge.fontFamily },
              ]}
            >
              Status: {userData.user_status || "Unknown"}
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.text,
                { fontFamily: theme.fonts.bodyLarge.fontFamily },
              ]}
            >
              Verified: {userData.is_verified ? "Yes" : "No"}
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.text,
                { fontFamily: theme.fonts.bodyLarge.fontFamily },
              ]}
            >
              Popularity Score: {userData.popularity_score || 0}
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.text,
                { fontFamily: theme.fonts.bodyLarge.fontFamily },
              ]}
            >
              Member Since: {formatDate(userData.created_at || "")}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Privacy Settings Preview */}
      {(formData.hideAge || formData.hideDistance) && (
        <Card style={styles.section} mode="elevated">
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[
                styles.sectionTitle,
                { fontFamily: theme.fonts.bodyLarge.fontFamily },
              ]}
            >
              Privacy Settings
            </Text>
            {formData.hideAge && (
              <Text
                variant="bodyMedium"
                style={[
                  styles.text,
                  { fontFamily: theme.fonts.bodyLarge.fontFamily },
                ]}
              >
                Hide My Age: Yes
              </Text>
            )}
            {formData.hideDistance && (
              <Text
                variant="bodyMedium"
                style={[
                  styles.text,
                  { fontFamily: theme.fonts.bodyLarge.fontFamily },
                ]}
              >
                Hide My Distance: Yes
              </Text>
            )}
          </Card.Content>
        </Card>
      )}

      <Card style={styles.footer} mode="outlined">
        <Card.Content>
          <Text
            variant="bodySmall"
            style={[
              styles.footerText,
              { fontFamily: theme.fonts.bodyLarge.fontFamily },
            ]}
          >
            Review your profile information before saving. Changes will be
            visible to other users after saving.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
  },
  section: {
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 8,
    color: "#666",
  },
  text: {
    color: "#333",
    lineHeight: 22,
    marginBottom: 4,
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  photoMore: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  photoMoreText: {
    color: "#6B7280",
    fontWeight: "500",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  footer: {
    marginTop: 20,
    borderColor: "#eee",
  },
  footerText: {
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
  },
});
