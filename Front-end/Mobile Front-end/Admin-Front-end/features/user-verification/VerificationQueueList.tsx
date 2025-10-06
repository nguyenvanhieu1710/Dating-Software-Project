import * as React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useTheme, Searchbar } from "react-native-paper";
import { IUserVerification } from "@/types/user-verification";
import VerificationQueueCard from "./VerificationQueueCard";

type Props = {
  verifications: IUserVerification[];
  onSelectVerification: (verification: IUserVerification) => void;
};

type FilterTab = "all" | "pending" | "approved" | "rejected";

export default function VerificationQueueList({
  verifications,
  onSelectVerification,
}: Props) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = React.useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredVerifications = React.useMemo(() => {
    let filtered = verifications;

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((v) => v.status === activeTab);
    }

    // Filter by search
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (v) =>
          v.user_id.toString().includes(searchQuery) ||
          v.verification_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [verifications, activeTab, searchQuery]);

  const stats = React.useMemo(() => {
    const today = new Date().toDateString();
    return {
      pending: verifications.filter((v) => v.status === "pending").length,
      approvedToday: verifications.filter(
        (v) =>
          v.status === "approved" &&
          new Date(v.updated_at).toDateString() === today
      ).length,
      rejectedToday: verifications.filter(
        (v) =>
          v.status === "rejected" &&
          new Date(v.updated_at).toDateString() === today
      ).length,
    };
  }, [verifications]);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Stats Cards */}
      <View style={{ flexDirection: "row", padding: 16, gap: 12 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.surfaceVariant,
            padding: 12,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: theme.colors.primary,
              marginBottom: 4,
            }}
          >
            {stats.pending}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.onSurfaceVariant,
              textAlign: "center",
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            Pending
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.surfaceVariant,
            padding: 12,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: theme.colors.primary,
              marginBottom: 4,
            }}
          >
            {stats.approvedToday}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.onSurfaceVariant,
              textAlign: "center",
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            Approved today
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.surfaceVariant,
            padding: 12,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: theme.colors.primary,
              marginBottom: 4,
            }}
          >
            {stats.rejectedToday}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.onSurfaceVariant,
              textAlign: "center",
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            }}
          >
            Rejected today
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <Searchbar
          placeholder="Search by User ID or verification type..."
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: 16, marginBottom: 16 }}
        contentContainerStyle={{ gap: 8, flexDirection: "row" }}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor:
                activeTab === tab.key
                  ? theme.colors.primary
                  : theme.colors.surfaceVariant,
              height: 40,
            }}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={{
                fontSize: 14,
                color:
                  activeTab === tab.key
                    ? theme.colors.onPrimary
                    : theme.colors.onSurfaceVariant,
                fontWeight: activeTab === tab.key ? "600" : "500",
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Verification List */}
      <ScrollView
        style={{flex: 150, paddingHorizontal: 16, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredVerifications.length > 0 ? (
          filteredVerifications.map((verification) => (
            <VerificationQueueCard
              key={verification.id}
              verification={verification}
              onClick={onSelectVerification}
            />
          ))
        ) : (
          <View style={{ padding: 32, alignItems: "center" }}>
            <Text
              style={{
                fontSize: 16,
                color: theme.colors.onSurfaceVariant,
                textAlign: "center",
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              No data available
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
