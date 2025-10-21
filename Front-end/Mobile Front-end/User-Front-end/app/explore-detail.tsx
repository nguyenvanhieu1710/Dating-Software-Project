import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator, useTheme } from "react-native-paper";
import SwipeCard, { SwipeCardHandle } from "./home/SwipeCard";
import ActionButtons from "./home/ActionButtons";
import { userService } from "@/services/user.service";
import { swipeService } from "@/services/swipe.service";
import { CreateSwipeRequest } from "@/types/swipe";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  requestLocationPermission,
  getCurrentLocation,
  calculateDistance,
  parseGeoJSONLocation,
} from "@/utils/geolocation";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/header/Header";
import { IPhoto } from "@/types/photo";
import { photoService } from "@/services/photo.service";
import { io } from "socket.io-client";
import { IUserProfile } from "@/types/user";

export default function ExploreDetailScreen() {
  const { title } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const [users, setUsers] = useState<IUserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUserProfile[]>([]);
  const [current, setCurrent] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<any | null>(null);
  const [maxDistance, setMaxDistance] = useState(100);
  const [photoOfUser, setPhotoOfUser] = useState<IPhoto[]>([]);

  const swipeRef = useRef<SwipeCardHandle | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
          setError("Location permission denied");
          return;
        }
        const loc = await getCurrentLocation();
        setUserLocation(loc);
        const users = await userService.getRecommendedUsers();
        // console.log("Recommended users: ", users);
        if (users.success && Array.isArray(users.data)) {
          setUsers(users.data);
          const nearby = filterUsersByDistance(
            users.data as any,
            loc,
            maxDistance
          );
          // console.log("nearby users: ", nearby);
          setFilteredUsers(nearby);
          setCurrent(0);
          setCurrentPhotoIndex(0);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load nearby users. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, []);
  useEffect(() => {
    if (userLocation && users.length > 0) {
      const nearby = filterUsersByDistance(users, userLocation, maxDistance);
      setFilteredUsers(nearby);
      setCurrent(0);
      setCurrentPhotoIndex(0);
    }
  }, [maxDistance, users, userLocation]);

  const filterUsersByDistance = (
    users: IUserProfile[],
    userLocation: { latitude: number; longitude: number },
    maxDistanceKm: number = maxDistance
  ) => {
    return users
      .map((u) => {
        if (u.location) {
          const coords = parseGeoJSONLocation(u.location);
          if (coords) {
            const d = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              coords.latitude,
              coords.longitude
            );
            // console.log(`User ${u.first_name} (ID: ${u.id}) - Distance: ${d} km`);
            return { ...u, distance: d };
          }
        }
        // console.log(`User ${u.first_name} (ID: ${u.id}) - Invalid location`);
        return { ...u, distance: Infinity }; // Users with invalid location are filtered out
      })
      .filter((u) => u.distance != null && u.distance <= maxDistanceKm)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  };

  const user = filteredUsers[current];
  const handlePhotoNav = (dir: "left" | "right") => {
    if (!user) return;
    if (dir === "left" && currentPhotoIndex > 0)
      setCurrentPhotoIndex((prev) => prev - 1);
    else if (dir === "right" && currentPhotoIndex < photoOfUser.length - 1)
      setCurrentPhotoIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (user) {
      const loadPhotos = async () => {
        try {
          const photoOfUser = await photoService.getPhotosByUserId(user.id);
          // console.log("getPhotosOfUser: ", photoOfUser);
          if (photoOfUser.success && Array.isArray(photoOfUser.data)) {
            setPhotoOfUser(photoOfUser.data);
          }
        } catch (error) {
          console.error("Failed to load photos", error);
        }
      };
      loadPhotos();
    }
  }, [user]);

  const performSwipeApi = async (
    direction: "left" | "right" | "superlike",
    swipedUser?: IUserProfile
  ) => {
    if (!swipedUser) return;
    try {
      const currentUser = await userService.getCurrentUser();
      if (!currentUser.data || !currentUser.data.id) {
        throw new Error("User not found");
      }
      const currentUserId = currentUser.data.id;
      const token = await AsyncStorage.getItem("auth_token");
      const action =
        direction === "left"
          ? "pass"
          : direction === "right"
          ? "like"
          : "superlike";
      const payload = {
        swiper_user_id: currentUserId,
        swiped_user_id: swipedUser.id,
        action,
      };
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/swipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Swipe API error", err);
    }
  };
  const onSwiped = async (direction: "left" | "right" | "superlike") => {
    // Called after card animation completes
    const swipedUser = filteredUsers[current];
    await performSwipeApi(direction, swipedUser);
    // move to next
    setCurrent((prev) => Math.min(prev + 1, filteredUsers.length - 1));
    setCurrentPhotoIndex(0);
  };

  const handleRewind = () => {
    setCurrent(
      (prev) =>
        (prev - 1 + filteredUsers.length) % Math.max(filteredUsers.length, 1)
    );
    setCurrentPhotoIndex(0);
  };

  const handlePass = async () => {
    try {
      const currentUser = await userService.getCurrentUser();
      // console.log(currentUser.data);
      if (!currentUser.data || !currentUser.data.id) {
        throw new Error("User not found");
      }
      const checkSwiped = await swipeService.checkSwiped(
        Number(currentUser.data.id),
        Number(user.id)
      );
      if (checkSwiped.success) {
        alert("You have already swiped this user");
        swipeRef.current?.swipe("left");
        return;
      }
      const swipeData: CreateSwipeRequest = {
        swiper_user_id: Number(currentUser.data.id),
        swiped_user_id: Number(user.id),
        action: "pass",
      };
      const response = await swipeService.performSwipe(swipeData);
      // console.log(response);
      if (response.success) {
        router.replace("/");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleLike = async () => {
    try {
      const currentUser = await userService.getCurrentUser();
      // console.log(currentUser.data);
      if (!currentUser.data || !currentUser.data.id) {
        throw new Error("User not found");
      }
      const userdetail = await userService.getUserById(user.id);
      // console.log("userdetail: ", userdetail);
      const checkSwiped = await swipeService.checkSwiped(
        Number(currentUser.data.id),
        Number(user.id)
      );
      if (
        checkSwiped.success &&
        Array.isArray(checkSwiped.data) &&
        checkSwiped.data.length > 0
      ) {
        const action = checkSwiped.data[0].action;

        if (action === "like") {
          alert("You liked this user");
          swipeRef.current?.swipe("right");
          return;
        }

        if (action === "pass") {
          alert("You passed this user");
          swipeRef.current?.swipe("left");
          return;
        }
      }
      const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
        query: { userId: currentUser.data.id.toString() },
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("✅ Socket connected for sending like notification");

        const firstName = userdetail.data?.profile?.first_name || "Someone";

        const notificationData = {
          swiper_user_id: Number(currentUser.data?.id),
          swiped_user_id: Number(user.id),
          title: "New Like!",
          body: `${firstName} liked you! Check out their profile.`,
          data: {
            type: "like",
            swiper_user_id: currentUser.data?.id.toString(),
          },
          sent_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };
        // console.log("notificationData: ", notificationData);

        socket.emit("send-like-notification", notificationData);
        console.log("📤 Sent like notification:", notificationData);
      });

      socket.on("connect_error", (err) => {
        console.error(
          "❌ Socket connection error for like notification:",
          err.message
        );
      });
      const swipeData: CreateSwipeRequest = {
        swiper_user_id: Number(currentUser.data.id),
        swiped_user_id: Number(user.id),
        action: "like",
      };
      const response = await swipeService.performSwipe(swipeData);
      // console.log("response of like:", response);
      if (response.success) {
        alert("Like sent successfully");
        router.replace("/");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleConsumable = () => router.push("/consumable");
  const handleOpenProfile = () => {
    router.push({
      pathname: "/profile-detail",
      params: { userId: user.id.toString() },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <Header title="Explore Detail" />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator
            animating
            size="large"
            color={theme.colors.primary}
          />
          <Text
            style={{
              marginTop: 12,
              color: theme.colors.onBackground,
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            Loading profiles...
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
        <Header title="Explore Detail" />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Ionicons name="warning" size={48} color="#EF4444" />
          <Text
            style={{
              marginTop: 16,
              color: "#EF4444",
              textAlign: "center",
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  if (!user) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <Header title="Explore Detail" />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Ionicons name="heart-dislike" size={48} color="#9CA3AF" />
          <Text
            style={{
              marginTop: 16,
              fontSize: 18,
              fontWeight: "600",
              color: "#4B5563",
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            No more profiles to show!
          </Text>
          <Text
            style={{
              marginTop: 8,
              color: "#9CA3AF",
              textAlign: "center",
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            Check back later for new profiles
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Explore Detail" />
      {/* <DistanceFilter value={maxDistance} onChange={setMaxDistance} /> */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={{ width: "100%", height: "100%" }}>
            <SwipeCard
              ref={swipeRef}
              user={user}
              photos={photoOfUser}
              photoIndex={currentPhotoIndex}
              onPhotoNav={handlePhotoNav}
              onOpenProfile={handleOpenProfile}
              onSwiped={onSwiped}
            />
          </View>
        </View>

        <ActionButtons
          onRewind={handleRewind}
          onPass={handlePass}
          onSuperlike={handleConsumable}
          onLike={handleLike}
          onBoost={handleConsumable}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
