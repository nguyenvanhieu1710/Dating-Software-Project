import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Text, useTheme } from "react-native-paper";
import ExploreHeader from "../explore/ExploreHeader";
import ExploreCard from "../explore/ExploreCard";
import { interestService } from "@/services/interest.service";
import { goalService } from "@/services/goal.service";
import { IInterest } from "@/types/interest";
import { IGoal } from "@/types/goal";
import { router } from "expo-router";

export default function ExploreScreen() {
  const theme = useTheme();
  const [interests, setInterests] = useState<IInterest[]>([]);
  const [goals, setGoals] = useState<IGoal[]>([]);

  const getInterests = async () => {
    const response = await interestService.getAllInterests();
    if (response.success && Array.isArray(response.data?.data)) {
      setInterests(response.data.data);
    }
  };

  const getGoals = async () => {
    const response = await goalService.getAllGoals();
    if (response.success && Array.isArray(response.data?.data)) {
      setGoals(response.data.data);
    }
  };

  useEffect(() => {
    getInterests();
    getGoals();
  }, []);

  const handleNavigateToExploreDetail = (item: IInterest | IGoal) => {
    router.push(`/explore-detail?name=${encodeURIComponent(item.name)}`);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <StatusBar style="dark" />
      <ExploreHeader title="Explore" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* Interests */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            marginBottom: 12,
            color: theme.colors.primary,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Your Interests
        </Text>
        <View style={{ gap: 12 }}>
          {interests.map((item) => (
            <ExploreCard
              key={item.id}
              title={item.name}
              subtitle={item.category}
              onPress={() => handleNavigateToExploreDetail(item)}
            />
          ))}
        </View>

        {/* Goals */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            marginVertical: 16,
            color: theme.colors.primary,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Your Goals
        </Text>
        <View style={{ gap: 12 }}>
          {goals.map((goal) => (
            <ExploreCard
              key={goal.id}
              title={goal.name}
              subtitle={goal.category || ""}
              onPress={() => handleNavigateToExploreDetail(goal)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
