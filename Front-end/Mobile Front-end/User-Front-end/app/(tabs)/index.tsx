import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { User, getDiscoveryUsers, getCurrentUserId } from "@/services/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestLocationPermission, getCurrentLocation, calculateDistance, UserLocation } from "@/utils/geolocation";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const SWIPE_THRESHOLD = screenWidth * 0.25;

export default function DiscoveryScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [current, setCurrent] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [maxDistance, setMaxDistance] = useState(50); // km

  const swipeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  // Initialize location and fetch users
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        
        // 1. Request location permission
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
          Alert.alert(
            'Location Permission Required',
            'Please enable location permission to find nearby users.',
            [{ text: 'OK' }]
          );
          setError('Location permission denied');
          return;
        }

        // 2. Get current location
        const location = await getCurrentLocation();
        setUserLocation(location);
        // console.log('Current location:', location);

        // 3. Fetch users from API
        const data = await getDiscoveryUsers();
        setUsers(data);

        // 4. Filter users by distance
        const nearbyUsers = filterUsersByDistance(data, location, maxDistance);
        setFilteredUsers(nearbyUsers);
        
        console.log(`Found ${nearbyUsers.length} users within ${maxDistance}km`);

      } catch (err) {
        console.error('Error initializing app:', err);
        setError('Failed to load nearby users. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const filterUsersByDistance = (
    users: User[],
    userLocation: UserLocation,
    maxDistance: number = 50 // km
  ): User[] => {
    return users
      .map((user) => {
        if (
          user.location &&
          typeof user.location === "object" &&
          user.location.latitude &&
          user.location.longitude
        ) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            user.location.latitude,
            user.location.longitude
          );
          return { ...user, distance: distance || 0 };
        }
        return { ...user, distance: 0 };
      })
      .filter((user) => user.distance !== null && user.distance <= maxDistance)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  };

  // Update filtered users when maxDistance changes
  useEffect(() => {
    if (userLocation && users.length > 0) {
      const nearbyUsers = filterUsersByDistance(users, userLocation, maxDistance);
      setFilteredUsers(nearbyUsers);
      setCurrent(0); // Reset to first user
    }
  }, [maxDistance, users, userLocation]);

  const user = filteredUsers[current];

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: swipeAnim } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;

      if (Math.abs(translationX) > SWIPE_THRESHOLD) {
        // Swipe threshold met
        const direction = translationX > 0 ? "right" : "left";
        handleSwipe(direction);
      } else {
        // Return to center
        Animated.spring(swipeAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const handleSwipe = async (direction: "left" | "right" | "superlike") => {
    if (
      (direction === "right" || direction === "superlike") &&
      user &&
      user.id === 1
    ) {
      return;
    }

    const currentUserId = await getCurrentUserId();
    console.log("Current user ID (swiper_user_id):", currentUserId);
    console.log("User ID (swiped_user_id):", user.id);
    const token = await AsyncStorage.getItem("auth_token");
    console.log("Token from AsyncStorage:", token);

    let swipeType: string | null = null;
    if (direction === "left") swipeType = "pass"; // dislike
    if (direction === "right") swipeType = "like"; // like
    if (direction === "superlike") swipeType = "superlike"; // superlike

    if (swipeType && user) {
      try {
        const payload = {
          swiper_user_id: currentUserId,
          swiped_user_id: user.id,
          action: swipeType,
        };

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/swipe`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const result = await response.json();
        console.log("Swipe API response:", result);
        if (result.message === "Already swiped this user") {
          console.log("You have already swiped this user");
        }
      } catch (error) {
        console.error("Swipe API error:", error);
      }
    }

    const targetValue =
      direction === "left" ? -screenWidth * 1.5 : screenWidth * 1.5;
    const rotateValue = direction === "left" ? -30 : 30;

    Animated.parallel([
      Animated.timing(swipeAnim, {
        toValue: targetValue,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: rotateValue,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset animations and move to next card
      swipeAnim.setValue(0);
      rotateAnim.setValue(0);
      setCurrentPhotoIndex(0);
      setCurrent((prev) => (prev + 1) % users.length);
    });
  };

  const handlePhotoNavigation = (direction: "left" | "right") => {
    if (direction === "left" && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    } else if (
      direction === "right" &&
      user.photos &&
      currentPhotoIndex < user.photos.length - 1
    ) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const handleRewind = () => {
    setCurrent((prev) => (prev - 1 + users.length) % users.length);
    setCurrentPhotoIndex(0);
  };

  const handleConsumable = () => {
    router.push("/consumable");
  };

  const handleProfileDetail = () => {
    router.push("/profile-detail");
  };

  const navigateToFriends = () => {
    router.push("/friends");
  };

  if (isLoading) {
    return (
      <View style={[styles.safeArea, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.loadingText}>Loading profiles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.safeArea, styles.centerContent]}>
        <Ionicons name="warning" size={48} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.safeArea, styles.centerContent]}>
        <Ionicons name="heart-dislike" size={48} color="#9CA3AF" />
        <Text style={styles.noUsersText}>No more profiles to show!</Text>
        <Text style={styles.subText}>Check back later for new profiles</Text>
      </View>
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
        <View style={styles.logoContainer}>
          <Ionicons name="heart" size={24} color="#8B5CF6" />
          <Text style={styles.logoText}>Vibe</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigateToFriends()}
          >
            <Ionicons name="people" size={16} color="#8B5CF6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="search" size={16} color="#8B5CF6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={handleConsumable}>
            <Ionicons name="flash" size={16} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <GestureHandlerRootView
        style={[
          styles.mainContainer,
          Platform.OS === "web" && styles.webContainer,
        ]}
      >
        <View style={styles.cardContainer}>
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View
              style={[
                styles.card,
                {
                  transform: [
                    { translateX: swipeAnim },
                    {
                      rotate: rotateAnim.interpolate({
                        inputRange: [-30, 0, 30],
                        outputRange: ["-30deg", "0deg", "30deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Image
                source={{
                  uri: user.photos?.[currentPhotoIndex] || user.avatar || "",
                }}
                style={styles.cardImage}
              />

              {/* Photo Progress Indicator */}
              <View style={styles.photoProgressContainer}>
                {user.photos?.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.photoProgressBar,
                      index === currentPhotoIndex && styles.photoProgressActive,
                    ]}
                  />
                ))}
              </View>

              {/* Photo Navigation Overlay - Tap to navigate */}
              <View style={styles.photoNavigation}>
                <TouchableOpacity
                  style={styles.photoNavLeft}
                  onPress={() => handlePhotoNavigation("left")}
                  disabled={currentPhotoIndex === 0}
                />
                <TouchableOpacity
                  style={styles.photoNavRight}
                  onPress={() => handlePhotoNavigation("right")}
                  disabled={
                    !user.photos || currentPhotoIndex === user.photos.length - 1
                  }
                />
              </View>

              {/* User Info Overlay */}
              <View style={styles.userInfoOverlay}>
                <View style={styles.userInfoLeft}>
                  <View style={styles.locationTag}>
                    <Ionicons name="location" size={12} color="#fff" />
                    <Text style={styles.locationText}>
                      {user.distance} km away
                    </Text>
                  </View>
                  <Text style={styles.userName}>
                    {user.name}, {user.age}
                  </Text>
                  <Text style={styles.userDistance}>{user.bio}</Text>
                </View>
                <TouchableOpacity
                  style={styles.detailBtn}
                  onPress={handleProfileDetail}
                >
                  <Ionicons name="arrow-up" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </PanGestureHandler>
        </View>

        {/* Action Buttons - Cố định ở dưới */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.rewindBtn]}
            onPress={handleRewind}
          >
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.passBtn]}
            onPress={() => handleSwipe("left")}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.superlikeBtn]}
            onPress={() => handleConsumable()}
          >
            <Ionicons name="star" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.likeBtn]}
            onPress={() => handleSwipe("right")}
          >
            <Ionicons name="heart" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.boostBtn]}
            onPress={handleConsumable}
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
  // On web, constrain width to avoid stretching across large screens
  webContainer: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
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
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B5CF6", // Màu tím thống nhất
  },
  headerButtons: {
    flexDirection: "row",
    gap: 15,
  },
  headerBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderColor: "gray",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    flex: 1, // Chiếm nửa bên trái
    height: "100%",
  },
  photoNavRight: {
    flex: 1, // Chiếm nửa bên phải
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
  userInfoOverlay: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 20,
    paddingBottom: 30,
  },
  userInfoLeft: {
    flex: 1,
  },
  locationTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B5CF6", // Màu tím thống nhất
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 8,
  },

  locationText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userDistance: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  detailBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
  },

  actionButtons: {
    position: "absolute", // Đè lên card container
    bottom: 0, // Cố định ở dưới
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingVertical: 20,
    gap: 15,
    zIndex: 10, // Đảm bảo đè lên card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  actionBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  rewindBtn: {
    backgroundColor: "#8B5CF6", // Màu tím thống nhất
  },
  passBtn: {
    backgroundColor: "#8B5CF6", // Màu tím thống nhất
  },
  superlikeBtn: {
    backgroundColor: "#8B5CF6", // Màu tím thống nhất
  },
  likeBtn: {
    backgroundColor: "#8B5CF6", // Màu tím thống nhất
  },
  boostBtn: {
    backgroundColor: "#8B5CF6", // Màu tím thống nhất
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
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 20,
  },
  noUsersText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#4B5563",
  },
  subText: {
    marginTop: 8,
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  distanceFilter: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
    textAlign: "center",
  },
  distanceButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  distanceBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },
  distanceBtnActive: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  distanceBtnText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  distanceBtnTextActive: {
    color: "#fff",
  },
  distanceText: {
    fontSize: 10,
    color: "#8B5CF6",
    fontWeight: "600",
  },
});
