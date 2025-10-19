import React from "react";
import { ScrollView, View } from "react-native";
import { useTheme, Text } from "react-native-paper";
import StatCard from "../dashboard/StatCard";
import UsersChart from "../dashboard/UsersChart";
import RevenueChart from "../dashboard/RevenueChart";
import ActivityChart from "../dashboard/ActivityChart";
import ModerationChart from "../dashboard/ModerationChart";

import { adminUserService } from "@/services/admin-user.service";
import { adminMatchService } from "@/services/admin-match.service";
import { adminMessageService } from "@/services/admin-message.service";
import { adminModerationService } from "@/services/admin-moderation.service";

export default function HomeScreen() {
  const theme = useTheme();
  const [users, setUsers] = React.useState([]);
  const [matches, setMatches] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [moderations, setModerations] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminUserService.getAllUsers();
      if (response.success && Array.isArray(response.data)) {
        setUsers(response.data as any);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await adminMatchService.getAllMatches();
      // console.log(response);
      if (response.success && Array.isArray(response.data)) {
        setMatches(response.data as any);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await adminMessageService.getAllMessages();
      if (response.success && Array.isArray(response.data)) {
        setMessages(response.data as any);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchModerations = async () => {
    try {
      setLoading(true);
      const response = await adminModerationService.getAllReports();
      // console.log(response);
      if (response.success && Array.isArray(response.data)) {
        setModerations(response.data as any);
      }
    } catch (error) {
      console.error("Error fetching moderations:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
    fetchMatches();
    fetchMessages();
    fetchModerations();
  }, []);

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
        <StatCard title="Total Users" value={users.length.toString()} icon="account" />
        <StatCard title="Active Matches" value={matches.length.toString()} icon="heart" />
        <StatCard title="Messages 24h" value={messages.length.toString()} icon="chat" />
        <StatCard
          title="Revenue (month)"
          value="$12,400"
          icon="currency-usd"
        />
      </View>

      <UsersChart users={users} />
      <RevenueChart />
      <ActivityChart matches={matches} messages={messages}/>
      <ModerationChart moderations={moderations}/>
    </ScrollView>
  );
}
