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
import DiscoveryHeader from "../home/DiscoveryHeader";
import SwipeCard, { SwipeCardHandle } from "../home/SwipeCard";
import ActionButtons from "../home/ActionButtons";
// import DistanceFilter from "../home/DistanceFilter";
import { getDiscoveryUsers, User, getCurrentUserId } from "@/services/userApi";
import { userService } from "@/services/user.service";
import { swipeService } from "@/services/swipe.service";
import { CreateSwipeRequest } from "@/types/swipe";
import { photoService } from "@/services/photo.service";
import { IPhoto } from "@/types/photo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  requestLocationPermission,
  getCurrentLocation,
  calculateDistance,
} from "@/utils/geolocation";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import NotificationToast from "../notification/Notification";
import { INotification } from "@/types/notification";

export default function DiscoveryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [current, setCurrent] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<any | null>(null);
  const [maxDistance, setMaxDistance] = useState(10);
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
        const data = await getDiscoveryUsers();
        setUsers(data);
        const nearby = filterUsersByDistance(data, loc, maxDistance);
        setFilteredUsers(nearby);
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
    users: User[],
    userLocation: any,
    maxDistanceKm: number = maxDistance
  ) => {
    return users
      .map((u) => {
        if (u.location && u.location.latitude && u.location.longitude) {
          const d = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            u.location.latitude,
            u.location.longitude
          );
          return { ...u, distance: d ?? 0 };
        }
        return { ...u, distance: 0 };
      })
      .filter((u) => u.distance != null && u.distance <= maxDistanceKm)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  };

  const user = filteredUsers[current];
  const handlePhotoNav = (dir: "left" | "right") => {
    if (!user) return;
    if (dir === "left" && currentPhotoIndex > 0)
      setCurrentPhotoIndex((prev) => prev - 1);
    else if (
      dir === "right" &&
      user.photos &&
      currentPhotoIndex < user.photos.length - 1
    )
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
    swipedUser?: User
  ) => {
    if (!swipedUser) return;
    try {
      const currentUserId = await getCurrentUserId();
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
      const checkSwiped = await swipeService.checkSwiped(
        Number(currentUser.data.id),
        Number(user.id)
      );
      if (checkSwiped.success) {
        alert("You have already swiped this user");
        swipeRef.current?.swipe("right");
        return;
      }
      const swipeData: CreateSwipeRequest = {
        swiper_user_id: Number(currentUser.data.id),
        swiped_user_id: Number(user.id),
        action: "like",
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

  const handleConsumable = () => router.push("/consumable");
  const handleOpenProfile = () => {
    router.push({
      pathname: "/profile-detail",
      params: { userId: user.id.toString() },
    });
  };

  const handleNotificationPress = (notification: INotification) => {
    // Xử lý khi user click vào notification
    // Ví dụ: navigate đến trang notification detail
    Alert.alert(notification.title, notification.body, [{ text: "OK" }]);
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <DiscoveryHeader />
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
        <DiscoveryHeader />
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
        <DiscoveryHeader />
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
      <DiscoveryHeader />
      {/* <DistanceFilter value={maxDistance} onChange={setMaxDistance} /> */}
      <NotificationToast onPress={handleNotificationPress} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
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
