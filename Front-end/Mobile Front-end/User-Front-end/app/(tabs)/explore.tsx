import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

export default function ExploreScreen() {
  const router = useRouter();
  const navigateToExploreDetail = (title: string) => {
    router.push({
      pathname: "/explore-detail",
      params: {
        title: title,
      },
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.light.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="compass" size={24} color="#8B5CF6" />
          <Text style={styles.logoText}>Explore</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Explore</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
        >
          {/* Short-term fun */}
          <View style={styles.shortTermFeature}>
            <Text style={styles.countLabel}>4K</Text>
            <TouchableOpacity
              onPress={() =>
                navigateToExploreDetail("Short-term relationships")
              }
            >
              <Text style={styles.tileTitle}>Short-term relationships</Text>
              <Text style={styles.tileSubtitle}>
                Find people looking for short-term fun
              </Text>
            </TouchableOpacity>
          </View>
          {/* Goal-driven dating */}
          <View style={styles.goalDrivenDating}>
            <Text style={styles.tileTitle}>Goal-driven dating</Text>
            <Text style={styles.tileSubtitle}>
              Find people with similar relationship goals
            </Text>
            {/* Long-term relationships */}
            <View style={styles.longTermRelationships}>
              <TouchableOpacity
                onPress={() =>
                  navigateToExploreDetail("Long-term relationships")
                }
              >
                <Text style={styles.countLabel}>23.4K</Text>
                <Text style={styles.tileTitle}>Long-term relationships</Text>
                <Text style={styles.tileSubtitle}>
                  Find people looking for something lasting
                </Text>
              </TouchableOpacity>
            </View>
            {/* Serious Daters */}
            <View style={styles.seriousDaters}>
              <TouchableOpacity
                onPress={() => navigateToExploreDetail("Serious Daters")}
              >
                <Text style={styles.countLabel}>23.4K</Text>
                <Text style={styles.tileTitle}>Serious Daters</Text>
                <Text style={styles.tileSubtitle}>
                  Find people who are ready to commit
                </Text>
              </TouchableOpacity>
            </View>
            {/* Free Tonight */}
            <View style={styles.freeTonight}>
              <TouchableOpacity
                onPress={() => navigateToExploreDetail("Free Tonight")}
              >
                <Text style={styles.countLabel}>23.4K</Text>
                <Text style={styles.tileTitle}>Free Tonight</Text>
                <Text style={styles.tileSubtitle}>
                  Find people available to hang out tonight
                </Text>
              </TouchableOpacity>
            </View>
            {/* New friends */}
            <View style={styles.newFriends}>
              <TouchableOpacity
                onPress={() => navigateToExploreDetail("New friends")}
              >
                <Text style={styles.countLabel}>23.4K</Text>
                <Text style={styles.tileTitle}>New friends</Text>
                <Text style={styles.tileSubtitle}>
                  Find people who want to make new friends
                </Text>
              </TouchableOpacity>
            </View>
            {/* Get photo Verified */}
            <View style={styles.getPhotoVerified}>
              <TouchableOpacity
                onPress={() => navigateToExploreDetail("Get photo Verified")}
              >
                <Text style={styles.countLabel}>23.4K</Text>
                <Text style={styles.tileTitle}>Get photo Verified</Text>
                <Text style={styles.tileSubtitle}>
                  Meet people with verified profiles
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Similar plans and lifestyles */}
          <View style={styles.similarPlansAndLifestyles}>
            <Text style={styles.tileTitle}>Similar plans and lifestyles</Text>
            <Text style={styles.tileSubtitle}>
              Find people with similar life goals
            </Text>
            {/* Wants Kids */}
            <View style={styles.wantsKids}>
              <TouchableOpacity
                onPress={() => navigateToExploreDetail("Wants Kids")}
              >
                <Text style={styles.countLabel}>23.4K</Text>
                <Text style={styles.tileTitle}>Wants Kids</Text>
                <Text style={styles.tileSubtitle}>Find people who want kids</Text>
              </TouchableOpacity>
            </View>
            {/* Child-free */}
            <View style={styles.childFree}>
              <TouchableOpacity
                onPress={() => navigateToExploreDetail("Child-free")}
              >
                <Text style={styles.countLabel}>23.4K</Text>
                <Text style={styles.tileTitle}>Child-free</Text>
                <Text style={styles.tileSubtitle}>
                  Find people who don't want kids
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Shared interests or hobbies */}
          <View style={styles.sharedInterestsOrHobbies}>
            <Text style={styles.tileTitle}>Shared interests or hobbies</Text>
            <Text style={styles.tileSubtitle}>
              Find people with similar interests or hobbies
            </Text>
            {/* Travel */}
            <View style={styles.travel}>
              <TouchableOpacity
                onPress={() => navigateToExploreDetail("Travel")}
              >
                <Text style={styles.countLabel}>23.4K</Text>
                <Text style={styles.tileTitle}>Travel</Text>
                <Text style={styles.tileSubtitle}>
                  Find people who love travel
                </Text>
              </TouchableOpacity>
            </View>
            {/* Binge Watchers */}
            <View style={styles.bingeWatchers}>
              <TouchableOpacity
                onPress={() => navigateToExploreDetail("Binge Watchers")}
              >
                <Text style={styles.countLabel}>23.4K</Text>
                <Text style={styles.tileTitle}>Binge Watchers</Text>
                <Text style={styles.tileSubtitle}>
                  Find people who enjoy the same TV shows
                </Text>
              </TouchableOpacity>
            </View>
            {/* Sporty */}
            <View style={styles.sporty}>
              <TouchableOpacity
                onPress={() => navigateToExploreDetail("Sporty")}
              >
                <Text style={styles.countLabel}>23.4K</Text>
                <Text style={styles.tileTitle}>Sporty</Text>
                <Text style={styles.tileSubtitle}>
                  Find people who love sports
                </Text>
              </TouchableOpacity>
            </View>
            {/* Self-care */}
            <View style={styles.selfCare}>
              <TouchableOpacity
                onPress={() => navigateToExploreDetail("Self-care")}
              >
                <Text style={styles.countLabel}>23.4K</Text>
                <Text style={styles.tileTitle}>Self-care</Text>
                <Text style={styles.tileSubtitle}>
                  Find people who enjoy the same self-care activities
                </Text>
              </TouchableOpacity>
            </View>
            {/* Add an Anthem */}
            <View style={styles.addAnAnthem}>
              <TouchableOpacity
                onPress={() => navigateToExploreDetail("Add an Anthem")}
              >
                <Text style={styles.countLabel}>23.4K</Text>
                <Text style={styles.tileTitle}>Add an Anthem</Text>
                <Text style={styles.tileSubtitle}>
                  Find people who love the same music
                </Text>
              </TouchableOpacity>
            </View>
            {/* Coffee Date */}
            <View style={styles.coffeeDate}>
              <TouchableOpacity
                onPress={() => navigateToExploreDetail("Coffee Date")}
              >
                <Text style={styles.countLabel}>23.4K</Text>
                <Text style={styles.tileTitle}>Coffee Date</Text>
                <Text style={styles.tileSubtitle}>
                  Find people who love coffee
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop:
      Platform.OS === "ios" ? 44 : (StatusBar.currentHeight || 0) + 15,
    backgroundColor: Colors.light.background,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginBottom: 12,
  },
  gridContainer: {
    paddingBottom: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.primary,
    marginBottom: 6,
  },
  tileSubtitle: {
    fontSize: 12,
    color: Colors.light.text,
    opacity: 0.8,
    lineHeight: 16,
  },

  shortTermFeature: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  countLabel: {
    position: "absolute",
    top: 8,
    right: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardBase: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 12,
    position: "relative",
  },
  goalDrivenDating: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  longTermRelationships: {
    marginTop: 8,
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    padding: 10,
  },
  seriousDaters: {
    marginTop: 8,
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    padding: 10,
  },
  freeTonight: {
    marginTop: 8,
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    padding: 10,
  },
  newFriends: {
    marginTop: 8,
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    padding: 10,
  },
  getPhotoVerified: {
    marginTop: 8,
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    padding: 10,
  },
  similarPlansAndLifestyles: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  wantsKids: {
    marginTop: 8,
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    padding: 10,
  },
  childFree: {
    marginTop: 8,
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    padding: 10,
  },
  sharedInterestsOrHobbies: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  travel: {
    marginTop: 8,
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    padding: 10,
  },
  bingeWatchers: {
    marginTop: 8,
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    padding: 10,
  },
  sporty: {
    marginTop: 8,
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    padding: 10,
  },
  selfCare: {
    marginTop: 8,
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    padding: 10,
  },
  addAnAnthem: {
    marginTop: 8,
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    padding: 10,
  },
  coffeeDate: {
    marginTop: 8,
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    padding: 10,
  },
});
