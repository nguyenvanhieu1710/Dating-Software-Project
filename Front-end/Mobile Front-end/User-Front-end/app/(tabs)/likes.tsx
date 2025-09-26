import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { User, getDiscoveryUsers, getCurrentUserId } from "@/services/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

// template user
// {
//     action: "like",
//     bio: "I love traveling and meeting new people",
//     created_at: "2025-09-04T15:08:40.821Z",
//     dob: "1999-12-31T17:00:00.000Z",
//     first_name: "Nguyen",
//     gender: "male",
//     id: "2",
//     job_title: "Software Engineer",
//     photo_url: "/uploads/z6608953955296_b5a7d1857976cb67ee44e49cea2643ef.jpg",
//     school: "MIT",
//     swiped_user_id: "1",
//     swiper_user_id: "3"
//   }

export default function LikesScreen() {
  const [users, setUsers] = useState([]);
  const [isGold, setIsGold] = useState(false);

  useEffect(() => {
    const fetchUsersWhoLikedYou = async () => {
      try {
        // setIsLoading(true);
        const currentUserId = await getCurrentUserId();
        console.log("Current user ID:", currentUserId);
        const token = await AsyncStorage.getItem("auth_token");
        console.log("Token from AsyncStorage:", token);
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/swipe/by-user/${currentUserId}/swiped-by`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Response: ", response);
        const result = await response.json();
        console.log("List of data:", result.data);
        setUsers(result.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        // setError("Failed to load user list. Please try again.");
      } finally {
        // setIsLoading(false);
      }
    };
    fetchUsersWhoLikedYou();
  }, []);

  const handleSeeWhoLikesYou = () => {
    setIsGold(true);
    // router.push("/subscriptions");
  };

  // tính tuổi từ dob
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const renderItem = ({ item }: { item: any }) => {
    const photoUrl = `${process.env.EXPO_PUBLIC_API_URL}${item.photo_url}`;
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: photoUrl }}
          style={[styles.avatar, !isGold && styles.avatarBlur]}
          blurRadius={isGold ? 0 : 12}
        />
        {isGold ? (
          <View style={styles.infoBox}>
            <Text style={styles.name}>
              {item.first_name}, {calculateAge(item.dob)}
            </Text>
            {item.job_title ? (
              <Text style={styles.job}>{item.job_title}</Text>
            ) : null}
            {item.school ? (
              <Text style={styles.school}>{item.school}</Text>
            ) : null}
            {item.bio ? (
              <Text style={styles.bio} numberOfLines={2}>
                {item.bio}
              </Text>
            ) : null}
          </View>
        ) : (
          <Text style={styles.name}>Hidden</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF9FB" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="heart" size={24} color="#6D28D9" />
            <Text style={styles.logoText}>Likes</Text>
          </View>
        </View>
        {/* Tabs */}
        <View style={styles.filterContainer}>
          <Text style={styles.likesCount}>{users.length} likes</Text>
        </View>
        {/* Filter */}
        <View style={styles.filterContainer}>
          <View style={styles.filterButton}>
            <Ionicons name="filter" size={16} color="#7C3AED" />
            <Text style={styles.filterText}>Filters</Text>
          </View>
          <View style={styles.filterPill}>
            <Ionicons name="location" size={14} color="#7C3AED" />
            <Text style={styles.filterPillText}>Nearby</Text>
          </View>
          <View style={styles.filterPill}>
            <Ionicons name="document-text" size={14} color="#7C3AED" />
            <Text style={styles.filterPillText}>With Bio</Text>
          </View>
        </View>
        {/* Upgrade Text */}
        {!isGold && (
          <View style={styles.paywall}>
            <Text style={styles.paywallTitle}>
              Upgrade to Gold to see people who have already liked you.
            </Text>
          </View>
        )}
        <FlatList
          data={users}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.grid}
        />
        <TouchableOpacity
          style={styles.upgradeBtn}
          onPress={() => handleSeeWhoLikesYou()}
        >
          <Text style={styles.upgradeText}>See Who Likes You</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF9FB",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF9FB",
    padding: 16,
    paddingTop:
      Platform.OS === "ios" ? 44 : (StatusBar.currentHeight || 0) + 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6D28D9",
    marginLeft: 8,
  },
  grid: {
    alignItems: "center",
    paddingVertical: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    margin: 8,
    width: 160,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#F3E8FF",
  },
  infoBox: {
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  job: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 2,
  },
  school: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
  },
  bio: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 4,
  },
  avatarBlur: {
    opacity: 0.7,
  },
  paywall: {
    backgroundColor: "#F5F3FF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "#EDE9FE",
  },
  paywallTitle: {
    fontSize: 16,
    color: "#6D28D9",
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    lineHeight: 22,
  },
  upgradeBtn: {
    backgroundColor: "#7C3AED",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 3,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginTop: 8,
    marginBottom: 24,
  },
  upgradeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 20,
    paddingHorizontal: 4,
    flexWrap: "wrap",
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    marginRight: 8,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
  },
  filterText: {
    color: "#7C3AED",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  filterPillText: {
    color: "#7C3AED",
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 4,
  },
  likesCount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  topPicks: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
});
