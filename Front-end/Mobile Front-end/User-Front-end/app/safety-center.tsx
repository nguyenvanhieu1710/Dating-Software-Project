import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Alert,
  Linking,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableRipple, Button } from "react-native-paper";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import SafetyCategoryCard from "./safety-center/SafetyCategoryCard";
import SafetyToolCard from "./safety-center/SafetyToolCard";
import SafetyResourceCard from "./safety-center/SafetyResourceCard";
import Header from "@/components/header/Header";

const { width, height } = Dimensions.get("window");

export default function SafetyCenterScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("guide");
  const [completedCategories, setCompletedCategories] = useState(new Set());
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab]);

  const handleCategoryPress = (categoryName: string) => {
    setCompletedCategories((prev) => new Set(prev).add(categoryName));
    Alert.alert(categoryName, `Opening ${categoryName} safety guide...`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Continue",
        onPress: () => console.log(`Navigate to ${categoryName}`),
      },
    ]);
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      "Emergency Contacts",
      "Are you sure you want to call emergency services?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call 911", onPress: () => Linking.openURL("tel:911") },
      ]
    );
  };

  const renderGuideContent = () => (
    <Animated.View
      style={[
        styles.contentSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Hero Section */}
      <LinearGradient
        colors={["#8B5CF6", "#8B5CF6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Ionicons
            name="shield-checkmark"
            size={32}
            color="#fff"
            style={styles.heroIcon}
          />
          <Text
            variant="headlineSmall"
            style={[
              styles.heroTitle,
              {
                color: "#fff",
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              },
            ]}
          >
            Stay Safe While Dating
          </Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.heroSubtitle,
              {
                color: "rgba(255,255,255,0.9)",
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              },
            ]}
          >
            Your safety is our priority. Learn essential tips for a secure
            dating experience.
          </Text>
          <View style={styles.progressContainer}>
            <Text
              variant="bodySmall"
              style={[
                styles.progressText,
                {
                  color: "rgba(255,255,255,0.9)",
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                },
              ]}
            >
              {completedCategories.size}/6 guides completed
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(completedCategories.size / 6) * 100}%` },
                ]}
              />
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        {[
          { number: "99.8%", label: "Safe Matches" },
          { number: "24/7", label: "Support" },
          { number: "2M+", label: "Protected Users" },
        ].map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text
              variant="titleLarge"
              style={[
                styles.statNumber,
                {
                  color: theme.colors.primary,
                  fontFamily: theme.fonts.titleLarge.fontFamily,
                },
              ]}
            >
              {stat.number}
            </Text>
            <Text
              variant="labelMedium"
              style={[
                styles.statLabel,
                {
                  color: theme.colors.onSurfaceVariant,
                  fontFamily: theme.fonts.labelMedium.fontFamily,
                },
              ]}
            >
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Safety Categories */}
      <Text
        variant="titleLarge"
        style={[
          styles.sectionTitle,
          {
            color: theme.colors.onSurface,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          },
        ]}
      >
        Safety Guides
      </Text>

      {[
        {
          icon: "shield-checkmark",
          title: "Basic Safety",
          description: "Essential safety tips for online dating beginners",
          gradient: ["#10B981", "#34D399"] as [string, string],
        },
        {
          icon: "warning",
          title: "Spot Red Flags",
          description: "How to identify and handle suspicious behavior",
          gradient: ["#F59E0B", "#FCD34D"] as [string, string],
        },
        {
          icon: "people",
          title: "Meeting in Person",
          description: "Safe practices for first dates and meetups",
          gradient: ["#8B5CF6", "#A78BFA"] as [string, string],
        },
        {
          icon: "flag",
          title: "Report & Block",
          description: "How to report inappropriate behavior effectively",
          gradient: ["#EF4444", "#F87171"] as [string, string],
        },
        {
          icon: "heart",
          title: "Consent Matters",
          description: "Understanding boundaries and respectful dating",
          gradient: ["#EC4899", "#F472B6"] as [string, string],
        },
        {
          icon: "airplane",
          title: "Travel Safety",
          description: "Dating safely while traveling or with travelers",
          gradient: ["#06B6D4", "#67E8F9"] as [string, string],
        },
      ].map((category) => (
        <SafetyCategoryCard
          key={category.title}
          title={category.title}
          description={category.description}
          icon={category.icon}
          gradient={category.gradient}
          isCompleted={completedCategories.has(category.title)}
          onPress={() => handleCategoryPress(category.title)}
        />
      ))}
    </Animated.View>
  );

  const renderToolsContent = () => (
    <Animated.View
      style={[
        styles.contentSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text
        variant="titleLarge"
        style={[
          styles.sectionTitle,
          {
            color: theme.colors.onSurface,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          },
        ]}
      >
        Safety Tools
      </Text>

      {[
        {
          title: "Report User",
          description: "Quickly report suspicious or inappropriate behavior",
          icon: "flag-outline",
          gradient: ["#8B5CF6", "#8B5CF6"] as [string, string],
          badgeText: "Fast",
          badgeBackgroundColor: theme.colors.primary,
          badgeTextColor: "#fff",
        },
        {
          title: "Privacy Controls",
          description: "Manage who can see your profile and contact you",
          icon: "lock-closed",
          gradient: ["#8B5CF6", "#A78BFA"] as [string, string],
          badgeText: "Essential",
          badgeBackgroundColor: "#E5E7EB",
          badgeTextColor: "#6B7280",
        },
        {
          title: "Share Location",
          description: "Share your date location with trusted contacts",
          icon: "location",
          gradient: ["#10B981", "#34D399"] as [string, string],
          badgeText: "New",
          badgeBackgroundColor: "#DBEAFE",
          badgeTextColor: "#1D4ED8",
        },
        {
          title: "Check-in Timer",
          description: "Set automatic check-ins during dates for peace of mind",
          icon: "time",
          gradient: ["#F59E0B", "#FCD34D"] as [string, string],
          badgeText: "Popular",
          badgeBackgroundColor: "#FEF3C7",
          badgeTextColor: "#92400E",
        },
      ].map((tool) => (
        <SafetyToolCard
          key={tool.title}
          title={tool.title}
          description={tool.description}
          icon={tool.icon}
          gradient={tool.gradient}
          badgeText={tool.badgeText}
          badgeBackgroundColor={tool.badgeBackgroundColor}
          badgeTextColor={tool.badgeTextColor}
          onPress={() => {}}
        />
      ))}
    </Animated.View>
  );

  const renderResourcesContent = () => (
    <Animated.View
      style={[
        styles.contentSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text
        variant="titleLarge"
        style={[
          styles.sectionTitle,
          {
            color: theme.colors.onSurface,
            fontFamily: theme.fonts.titleLarge.fontFamily,
          },
        ]}
      >
        Support & Resources
      </Text>

      <SafetyResourceCard
        title="Safety Hub"
        description="Comprehensive safety guides and community resources"
        icon="globe"
        gradient={["#06B6D4", "#67E8F9"] as [string, string]}
        onPress={() => {}}
      />
      <SafetyResourceCard
        title="24/7 Support Chat"
        description="Get immediate help from our safety experts"
        icon="chatbubbles"
        gradient={["#EC4899", "#F472B6"] as [string, string]}
        isOnline
        onPress={() => {}}
      />

      {/* Emergency Section */}
      <View style={styles.emergencySection}>
        <LinearGradient
          colors={["#8B5CF6", "#8B5CF6"]}
          style={styles.emergencyGradient}
        >
          <View style={styles.emergencyContent}>
            <Ionicons name="warning" size={28} color="#fff" />
            <Text
              variant="titleMedium"
              style={[
                styles.emergencyTitle,
                {
                  color: "#fff",
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                },
              ]}
            >
              Emergency Support
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.emergencyDescription,
                {
                  color: "rgba(255,255,255,0.9)",
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                },
              ]}
            >
              If you're in immediate danger, contact local emergency services
            </Text>
            <Button
              mode="contained"
              onPress={handleEmergencyCall}
              style={styles.emergencyButton}
              contentStyle={{ flexDirection: "row", alignItems: "center" }}
              icon={() => (
                <Ionicons
                  name="call"
                  style={{ marginRight: 14 }}
                  size={20}
                  color={theme.colors.error}
                />
              )}
              labelStyle={{
                fontSize: 14,
                fontWeight: "600",
                color: theme.colors.error,
                marginLeft: 8,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              Call Emergency Services
            </Button>
          </View>
        </LinearGradient>
      </View>

      {/* Crisis Resources */}
      <View style={styles.crisisSection}>
        <Text
          variant="titleMedium"
          style={[
            styles.crisisTitle,
            {
              color: theme.colors.onSurface,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            },
          ]}
        >
          Crisis Resources
        </Text>
        <View style={styles.crisisLinks}>
          {[
            {
              title: "National Sexual Assault Hotline",
              number: "1-800-656-4673",
            },
            {
              title: "National Domestic Violence Hotline",
              number: "1-800-799-7233",
            },
          ].map((link) => (
            <TouchableRipple
              key={link.title}
              onPress={() => Linking.openURL(`tel:${link.number}`)}
              style={styles.crisisLink}
              rippleColor={theme.colors.primary}
            >
              <View style={styles.crisisLinkContent}>
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.crisisLinkText,
                    {
                      color: theme.colors.onSurface,
                      fontFamily: theme.fonts.bodyLarge.fontFamily,
                    },
                  ]}
                >
                  {link.title}
                </Text>
                <Text
                  variant="titleMedium"
                  style={[
                    styles.crisisLinkNumber,
                    {
                      color: theme.colors.onSurface,
                      fontFamily: theme.fonts.bodyLarge.fontFamily,
                    },
                  ]}
                >
                  {link.number}
                </Text>
              </View>
            </TouchableRipple>
          ))}
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />

      {/* Header */}
      <Header title="Safety Center" />

      {/* Modern Tabs */}
      <View
        style={[styles.modernTabs, { backgroundColor: theme.colors.surface }]}
      >
        {[
          { key: "guide", label: "Guide", icon: "book" },
          { key: "tools", label: "Tools", icon: "construct" },
          { key: "resources", label: "Resources", icon: "library" },
        ].map((tab) => (
          <TouchableRipple
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[
              styles.modernTab,
              activeTab === tab.key && styles.modernTabActive,
            ]}
            rippleColor={theme.colors.primary}
          >
            <View style={styles.tabContent}>
              <Ionicons
                name={tab.icon as any}
                size={18}
                color={
                  activeTab === tab.key
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant
                }
              />
              <Text
                variant="labelMedium"
                style={[
                  styles.modernTabText,
                  {
                    color:
                      activeTab === tab.key
                        ? theme.colors.primary
                        : theme.colors.onSurfaceVariant,
                    fontFamily: theme.fonts.labelMedium.fontFamily,
                  },
                ]}
              >
                {tab.label}
              </Text>
              {activeTab === tab.key && (
                <View
                  style={[
                    styles.tabIndicator,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
              )}
            </View>
          </TouchableRipple>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {activeTab === "guide" && renderGuideContent()}
        {activeTab === "tools" && renderToolsContent()}
        {activeTab === "resources" && renderResourcesContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  modernHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop:
      Platform.OS === "ios" ? 50 : (StatusBar.currentHeight || 0) + 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modernBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  modernHeaderTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  modernTabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modernTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  modernTabActive: {
    // Active state handled by indicator
  },
  tabContent: {
    alignItems: "center",
  },
  modernTabText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  tabIndicator: {
    position: "absolute",
    bottom: -1,
    width: "100%",
    height: 3,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  contentSection: {
    paddingBottom: 30,
  },
  heroSection: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  heroContent: {
    padding: 24,
    alignItems: "center",
  },
  heroIcon: {
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 3,
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 16,
  },
  emergencySection: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  emergencyGradient: {
    padding: 20,
  },
  emergencyContent: {
    alignItems: "center",
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 8,
  },
  emergencyDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  crisisSection: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  crisisTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  crisisLinks: {
    gap: 12,
  },
  crisisLink: {
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  crisisLinkContent: {
    flex: 1,
  },
  crisisLinkText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  crisisLinkNumber: {
    fontSize: 16,
    fontWeight: "700",
  },
});
