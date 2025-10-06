import React from "react";
import { ScrollView, View } from "react-native";
import { useTheme, Text } from "react-native-paper";
import StatCard from "../dashboard/StatCard";
import UsersChart from "../dashboard/UsersChart";
import RevenueChart from "../dashboard/RevenueChart";
import ActivityChart from "../dashboard/ActivityChart";
import ModerationChart from "../dashboard/ModerationChart";

export default function HomeScreen() {
  const theme = useTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}
    >
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <StatCard title="Total Users" value="12,345" icon="account" />
        <StatCard title="Active Matches" value="3,210" icon="heart" />
        <StatCard title="Messages 24h" value="8,940" icon="chat" />
        <StatCard
          title="Revenue (month)"
          value="$12,400"
          icon="currency-usd"
        />
      </View>

      <UsersChart />
      <RevenueChart />
      <ActivityChart />
      <ModerationChart />
    </ScrollView>
  );
}
