import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  Platform,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import { User, getDiscoveryUsers, getCurrentUserId } from "@/services/userApi";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const SWIPE_THRESHOLD = screenWidth * 0.25;

export default function ExploreDetailScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedUsers, setLikedUsers] = useState<Set<string>>(new Set());
  const [passedUsers, setPassedUsers] = useState<Set<string>>(new Set());

  const router = useRouter();
  const { title } = useLocalSearchParams();

  const swipeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Fetch filtered users based on category
  useEffect(() => {
    const fetchFilteredUsers = async () => {
      try {
        setIsLoading(true);
        // const currentUserId = await getCurrentUserId();
        // console.log("Current user ID:", currentUserId);
        const data = await getDiscoveryUsers();
        // console.log("List of data:", data);
        // setUsers(data);
        const searchTerm = Array.isArray(title) ? title[0] : title;
        const filteredData = data.filter((user) =>
          user.bio?.toLowerCase().includes(searchTerm.toLowerCase())
        );                
        setUsers(filteredData);
      } catch (err) {
        console.error("Error fetching filtered users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredUsers();
  }, [title]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userId = await getCurrentUserId();
        setCurrentUserId(userId);
      } catch (error) {
        console.error("Failed to fetch current user ID:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: swipeAnim } }],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        const { translationX } = event.nativeEvent;
        // Update rotation based on swipe position
        const rotate = (translationX / screenWidth) * 30;
        rotateAnim.setValue(rotate);

        // Scale down slightly during swipe
        const scale = 1 - (Math.abs(translationX) / screenWidth) * 0.1;
        scaleAnim.setValue(Math.max(scale, 0.9));
      },
    }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      const shouldSwipe =
        Math.abs(translationX) > SWIPE_THRESHOLD || Math.abs(velocityX) > 1000;

      if (shouldSwipe) {
        const direction = translationX > 0 ? "right" : "left";
        handleSwipe(direction);
      } else {
        // Return to center
        Animated.parallel([
          Animated.spring(swipeAnim, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(rotateAnim, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  };

  const handleSwipe = (direction: "left" | "right" | "superlike") => {
    if (!currentUserId) return;

    // Update user preferences
    if (direction === "right" || direction === "superlike") {
      setLikedUsers((prev) => new Set(prev).add(String(currentUserId)));
    } else {
      setPassedUsers((prev) => new Set(prev).add(String(currentUserId)));
    }

    const targetValue =
      direction === "left" ? -screenWidth * 1.5 : screenWidth * 1.5;
    const rotateValue = direction === "left" ? -30 : 30;

    Animated.parallel([
      Animated.timing(swipeAnim, {
        toValue: targetValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: rotateValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset animations and move to next user
      swipeAnim.setValue(0);
      rotateAnim.setValue(0);
      scaleAnim.setValue(1);
      setCurrentPhotoIndex(0);

      if (currentIndex < users.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // No more users - could show "no more users" screen
        setCurrentIndex(0); // Reset for demo
      }
    });
  };

  const handlePhotoNavigation = (direction: "left" | "right") => {
    if (!users[currentIndex]) return;

    if (direction === "left" && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    } else if (
      direction === "right" &&
      currentPhotoIndex < (users[currentIndex].photos?.length || 1) - 1
    ) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const handleRewind = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setCurrentPhotoIndex(0);
    }
  };

  const handleProfileDetail = () => {
    router.push("/profile-detail");
  };

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.light.background}
        />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Finding people for you...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !users.length) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.light.background}
        />
        <View style={styles.centerContent}>
          <Ionicons name="heart-dislike" size={64} color="#9CA3AF" />
          <Text style={styles.noUsersText}>No people</Text>
          <Text style={styles.subText}>
            Try adjusting your preferences or check back later
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleGoBack}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentUserId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.light.background}
        />
        <View style={styles.centerContent}>
          <Ionicons name="checkmark-circle" size={64} color="#8B5CF6" />
          <Text style={styles.noUsersText}>You've seen everyone!</Text>
          <Text style={styles.subText}>Check back later for new people</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleGoBack}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.light.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>
            {currentIndex + 1} of {users.length}
          </Text>
        </View>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="settings" size={20} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <GestureHandlerRootView style={styles.mainContainer}>
        <View style={styles.cardContainer}>
          {/* Next card (background) */}
          {currentIndex < users.length - 1 && (
            <View style={[styles.card, styles.backgroundCard]}>
              <Image
                source={{
                  uri:
                    users[currentIndex + 1]?.photos?.[0] ||
                    "https://via.placeholder.com/300x400?text=No+Image",
                }}
                style={styles.cardImage}
                defaultSource={{
                  uri: "https://via.placeholder.com/300x400?text=Loading...",
                }}
              />
            </View>
          )}

          {/* Current card */}
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View
              style={[
                styles.card,
                styles.frontCard,
                {
                  transform: [
                    { translateX: swipeAnim },
                    {
                      rotate: rotateAnim.interpolate({
                        inputRange: [-30, 0, 30],
                        outputRange: ["-15deg", "0deg", "15deg"],
                      }),
                    },
                    { scale: scaleAnim },
                  ],
                },
              ]}
            >
              <Image
                source={{
                  uri:
                    users[currentIndex]?.photos?.[currentPhotoIndex] ||
                    "https://via.placeholder.com/300x400?text=No+Image",
                }}
                style={styles.cardImage}
                defaultSource={{
                  uri: "https://via.placeholder.com/300x400?text=Loading...",
                }}
              />

              {/* Photo Progress Indicators */}
              {users[currentIndex]?.photos &&
                users[currentIndex].photos.length > 1 && (
                  <View style={styles.photoProgressContainer}>
                    {users[currentIndex]?.photos?.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.photoProgressBar,
                          index === currentPhotoIndex &&
                            styles.photoProgressActive,
                        ]}
                      />
                    ))}
                  </View>
                )}

              {/* Photo Navigation Overlay */}
              <View style={styles.photoNavigation}>
                <TouchableOpacity
                  style={styles.photoNavLeft}
                  onPress={() => handlePhotoNavigation("left")}
                  activeOpacity={1}
                />
                <TouchableOpacity
                  style={styles.photoNavRight}
                  onPress={() => handlePhotoNavigation("right")}
                  activeOpacity={1}
                />
              </View>

              {/* Swipe Indicators */}
              <Animated.View
                style={[
                  styles.swipeIndicator,
                  styles.likeIndicator,
                  {
                    opacity: swipeAnim.interpolate({
                      inputRange: [0, SWIPE_THRESHOLD],
                      outputRange: [0, 1],
                      extrapolate: "clamp",
                    }),
                  },
                ]}
              >
                <Text style={styles.swipeIndicatorText}>LIKE</Text>
              </Animated.View>

              <Animated.View
                style={[
                  styles.swipeIndicator,
                  styles.passIndicator,
                  {
                    opacity: swipeAnim.interpolate({
                      inputRange: [-SWIPE_THRESHOLD, 0],
                      outputRange: [1, 0],
                      extrapolate: "clamp",
                    }),
                  },
                ]}
              >
                <Text style={styles.swipeIndicatorText}>PASS</Text>
              </Animated.View>

              {/* User Info Overlay */}
              <View style={styles.userInfoOverlay}>
                <View style={styles.userInfoLeft}>
                  <View style={styles.locationTag}>
                    <Ionicons name="location" size={12} color="#fff" />
                    <Text style={styles.locationText}>
                      {users[currentIndex]?.distance || "Unknown"} km away
                    </Text>
                  </View>
                  <Text style={styles.userName}>
                    {users[currentIndex]?.name || "User"},{" "}
                    {users[currentIndex]?.age || "?"}
                  </Text>
                  <Text style={styles.userBio} numberOfLines={2}>
                    {users[currentIndex]?.bio || "No bio available"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.detailBtn}
                  onPress={handleProfileDetail}
                >
                  <Ionicons
                    name="information-circle"
                    size={24}
                    color="#8B5CF6"
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </PanGestureHandler>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.rewindBtn]}
            onPress={handleRewind}
            disabled={currentIndex === 0}
          >
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.passBtn]}
            onPress={() => handleSwipe("left")}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.superlikeBtn]}
            onPress={() => handleSwipe("superlike")}
          >
            <Ionicons name="star" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.likeBtn]}
            onPress={() => handleSwipe("right")}
          >
            <Ionicons name="heart" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.boostBtn]}
            onPress={() => router.push("/consumable")}
          >
            <Ionicons name="flash" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120, // Space for action buttons
  },
  card: {
    width: screenWidth - 40,
    height: screenHeight * 0.7,
    borderRadius: 20,
    overflow: "hidden",
    position: "absolute",
  },
  backgroundCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  frontCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  photoNavigation: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
  },
  photoNavLeft: {
    flex: 1,
    height: "100%",
  },
  photoNavRight: {
    flex: 1,
    height: "100%",
  },
  photoProgressContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    gap: 4,
    zIndex: 5,
  },
  photoProgressBar: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 2,
  },
  photoProgressActive: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  swipeIndicator: {
    position: "absolute",
    top: "50%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 3,
    transform: [{ translateY: -20 }],
  },
  likeIndicator: {
    right: 30,
    borderColor: "#10B981",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  passIndicator: {
    left: 30,
    borderColor: "#EF4444",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  swipeIndicatorText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },
  userInfoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 20,
    backgroundColor: "linear-gradient(transparent, rgba(0,0,0,0.6))",
    paddingTop: 60,
  },
  userInfoLeft: {
    flex: 1,
  },
  locationTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  userBio: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    lineHeight: 22,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  detailBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  actionButtons: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 15,
  },
  actionBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  rewindBtn: {
    backgroundColor: "#6B7280",
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  passBtn: {
    backgroundColor: "#EF4444",
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  superlikeBtn: {
    backgroundColor: "#3B82F6",
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  likeBtn: {
    backgroundColor: "#10B981",
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  boostBtn: {
    backgroundColor: "#8B5CF6",
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  noUsersText: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
  },
  subText: {
    marginTop: 8,
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
