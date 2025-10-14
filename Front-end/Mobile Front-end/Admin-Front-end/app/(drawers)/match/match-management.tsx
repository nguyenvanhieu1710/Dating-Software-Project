import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import {
  Surface,
  Title,
  TextInput,
  Snackbar,
  FAB,
  Button,
  useTheme,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import MatchCard from "@/features/match/MatchCard";
import ViewModal from "@/features/match/ViewModal";
import FormModal from "@/features/match/FormModal";
import DeleteModal from "@/features/match/DeleteModal";
import { FlatUserProfile } from "@/types/user";
import { IMatch } from "@/types/matche";
import { adminUserService } from "@/services/admin-user.service";
import { adminMatchService } from "@/services/admin-match.service";

// Define types
type MatchStatus = "active" | "unmatch";
type ModalType = "create" | "edit" | "view" | "delete" | null;
type UserRole = "admin" | "moderator" | "viewer";

interface FormErrors {
  [key: string]: string | undefined;
  user1_id?: string;
  user2_id?: string;
  status?: string;
}

// Utility functions
const formatDate = (
  dateString: string | Date,
  locale: "vi-VN" | "en-US" = "vi-VN"
): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status: IMatch["status"]): string => {
  switch (status) {
    case "active":
      return "#4CAF50";
    case "unmatch":
      return "#FF9800";
    default:
      return "#9E9E9E";
  }
};

const getStatusIcon = (status: IMatch["status"]): string => {
  switch (status) {
    case "active":
      return "check-circle-outline";
    case "unmatch":
      return "close-circle-outline";
    default:
      return "help-circle-outline";
  }
};

const getStatusLabel = (status: IMatch["status"]): string => {
  switch (status) {
    case "active":
      return "Active";
    case "unmatch":
      return "Unmatch";
    default:
      return "Unknown";
  }
};

const statusOptions: string[] = ["active", "unmatch"];

const MatchManagement: React.FC = () => {
  const theme = useTheme();
  // Data state
  const [matches, setMatches] = useState<IMatch[]>([]);
  const [users, setUsers] = useState<FlatUserProfile[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<IMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedMatch, setSelectedMatch] = useState<IMatch | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<IMatch>>({
    user1_id: undefined,
    user2_id: undefined,
    status: "active" as MatchStatus,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Search and pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // UI state
  const [userRole] = useState<UserRole>("admin");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarError, setSnackbarError] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);

  // Fetch matches from API
  const fetchMatches = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: any = await adminMatchService.getAllMatches();
      let matches = [];
      let total = 0;
      if (response?.success && response?.data) {
        matches = response.data || [];
        total = response.pagination?.total || response.data?.length || 0;
      } else if (Array.isArray(response)) {
        matches = response;
        total = response.length;
      }
      setMatches(matches);
      setTotalItems(total);
      setFilteredMatches(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setSnackbarMessage("Failed to load matches. Please try again.");
      setSnackbarError(true);
      setSnackbarVisible(true);
      setMatches([]);
      setFilteredMatches([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [currentPage, searchQuery]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await adminUserService.getAllUsers();
      console.log("response: ", response);

      if (response.success && Array.isArray(response.data)) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchMatches();
    fetchUsers();
  }, [fetchMatches]);

  // Apply search filter
  useEffect(() => {
    if (!matches || !Array.isArray(matches)) {
      setFilteredMatches([]);
      return;
    }
    let filtered = [...matches];
    if (searchQuery) {
      filtered = filtered.filter((match) => {
        const user1 = getUserById(match.user1_id);
        const user2 = getUserById(match.user2_id);
        const query = searchQuery.toLowerCase();
        return (
          user1?.first_name?.toLowerCase().includes(query) ||
          user2?.first_name?.toLowerCase().includes(query) ||
          user1?.email?.toLowerCase().includes(query) ||
          user2?.email?.toLowerCase().includes(query) ||
          user1?.phone_number?.toLowerCase().includes(query) ||
          user2?.phone_number?.toLowerCase().includes(query) ||
          user1?.job_title?.toLowerCase().includes(query) ||
          user2?.job_title?.toLowerCase().includes(query) ||
          user1?.school?.toLowerCase().includes(query) ||
          user2?.school?.toLowerCase().includes(query) ||
          match.id.toString().includes(query)
        );
      });
    }
    setFilteredMatches(filtered);
    setCurrentPage(1);
  }, [matches, searchQuery]);

  // Pagination
  const totalPages = Math.ceil((filteredMatches?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMatches = (filteredMatches || []).slice(startIndex, endIndex);

  // Modal handlers
  const showModal = (type: ModalType, match: IMatch | null = null) => {
    setSelectedMatch(match);
    setActiveModal(type);
    if (type === "create") {
      setFormData({
        user1_id: undefined,
        user2_id: undefined,
        status: "active",
      });
      setFormErrors({});
    } else if (type === "edit" && match) {
      setFormData({
        user1_id: match.user1_id,
        user2_id: match.user2_id,
        status: match.status,
      });
      setFormErrors({});
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedMatch(null);
    setFormData({ user1_id: undefined, user2_id: undefined, status: "active" });
    setFormErrors({});
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.user1_id) errors.user1_id = "Please select user 1";
    if (!formData.user2_id) errors.user2_id = "Please select user 2";
    if (
      formData.user1_id &&
      formData.user2_id &&
      formData.user1_id === formData.user2_id
    ) {
      errors.user2_id = "Cannot match the same user";
    }
    if (!formData.status) errors.status = "Please select status";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof Partial<IMatch>, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // CRUD operations
  const handleCreateMatch = () => {
    if (!hasPermission("create")) {
      setSnackbarMessage("You do not have permission to create matches");
      setSnackbarError(true);
      setSnackbarVisible(true);
      return;
    }
    showModal("create");
  };

  const handleEditMatch = (match: IMatch) => {
    showModal("edit", match);
  };

  const handleDeleteClick = (match: IMatch) => {
    showModal("delete", match);
  };

  const handleCreateConfirm = async () => {
    if (!validateForm()) return;
    setActionInProgress(true);
    try {
      // await adminMatchService.createMatch({
      //   user1_id: formData.user1_id!,
      //   user2_id: formData.user2_id!,
      // });
      await fetchMatches();
      closeModal();
      setSnackbarMessage("Match created successfully");
      setSnackbarError(false);
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage("Failed to create match");
      setSnackbarError(true);
      setSnackbarVisible(true);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleEditConfirm = async () => {
    if (!selectedMatch || !validateForm()) return;
    setActionInProgress(true);
    try {
      // await adminUserService.updateUser(selectedMatch.user1_id, {
      //   status: formData.status,
      // });
      // await adminUserService.updateUser(selectedMatch.user2_id, {
      //   status: formData.status,
      // });
      await fetchMatches();
      closeModal();
      setSnackbarMessage("Match updated successfully");
      setSnackbarError(false);
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage("Failed to update match");
      setSnackbarError(true);
      setSnackbarVisible(true);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMatch) return;
    setActionInProgress(true);
    try {
      // await adminMatchService.unmatch(selectedMatch.user1_id, selectedMatch.id);
      await fetchMatches();
      closeModal();
      setSnackbarMessage("Match deleted successfully");
      setSnackbarError(false);
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage("Failed to delete match");
      setSnackbarError(true);
      setSnackbarVisible(true);
    } finally {
      setActionInProgress(false);
    }
  };

  // Helper functions
  const hasPermission = (action: string) => {
    const permissions = {
      admin: ["view", "create", "edit", "delete", "export"],
      moderator: ["view", "edit", "export"],
      viewer: ["view"],
    };
    return permissions[userRole]?.includes(action) || false;
  };

  const getUserById = (userId: number) =>
    users.find((user) => user.id === userId || user.user_id === userId);

  const getUserAge = (userId: number) => {
    const user = getUserById(userId);
    if (user?.dob) {
      const birthDate = new Date(user.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    }
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Surface style={{ flex: 1, padding: 16 }}>
        <Surface
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <TextInput
            mode="outlined"
            placeholder="Search by user names, emails, or match ID..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ flex: 1 }}
          />
        </Surface>
        <Title
          style={{
            fontSize: 14,
            marginBottom: 16,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Showing {paginatedMatches?.length || 0} of{" "}
          {filteredMatches?.length || 0} matches
          {searchQuery ? ` matching "${searchQuery}"` : ""}
        </Title>
        {isLoading ? (
          <Surface
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Title
              style={{
                marginTop: 16,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              Loading matches...
            </Title>
          </Surface>
        ) : (
          <FlatList
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
            data={paginatedMatches}
            renderItem={({ item }) => (
              <MatchCard
                match={item}
                users={users}
                onView={() => showModal("view", item)}
                onEdit={handleEditMatch}
                onDelete={handleDeleteClick}
                hasPermission={hasPermission}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                getStatusLabel={getStatusLabel}
                formatDate={formatDate}
                getUserAge={getUserAge}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={() => (
              <Surface style={{ alignItems: "center", padding: 16 }}>
                <Ionicons name="people-outline" size={48} color="#D1D5DB" />
                <Title
                  style={{
                    marginVertical: 16,
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  No matches found
                </Title>
                <Button
                  onPress={fetchMatches}
                  theme={{
                    fonts: {
                      labelLarge: {
                        fontFamily: theme.fonts.bodyLarge.fontFamily,
                      },
                    },
                  }}
                >
                  Retry
                </Button>
              </Surface>
            )}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={fetchMatches}
                colors={["#8B5CF6"]}
              />
            }
          />
        )}
        <FAB
          icon="plus"
          label="Create Match"
          disabled={!hasPermission("create")}
          onPress={handleCreateMatch}
          style={{ position: "absolute", bottom: 16, right: 16 }}
          theme={{
            fonts: {
              labelLarge: {
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              },
            },
          }}
        />
        <ViewModal
          visible={activeModal === "view"}
          match={selectedMatch}
          users={users}
          onClose={closeModal}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
          getStatusLabel={getStatusLabel}
          formatDate={formatDate}
          getUserAge={getUserAge}
        />
        <FormModal
          visible={activeModal === "create" || activeModal === "edit"}
          modalType={activeModal === "create" ? "create" : "edit"}
          formData={formData}
          formErrors={formErrors}
          statusOptions={statusOptions}
          onClose={closeModal}
          onSubmit={
            activeModal === "create" ? handleCreateConfirm : handleEditConfirm
          }
          onInputChange={handleInputChange}
        />
        <DeleteModal
          visible={activeModal === "delete"}
          match={selectedMatch}
          users={users}
          onClose={closeModal}
          onConfirm={handleDeleteConfirm}
        />
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={4000}
          style={{ backgroundColor: snackbarError ? "#f44336" : "#4caf50" }}
        >
          {snackbarMessage}
        </Snackbar>
        {actionInProgress && (
          <Surface
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Title
              style={{
                color: "#fff",
                marginTop: 16,
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              Processing...
            </Title>
          </Surface>
        )}
      </Surface>
    </SafeAreaView>
  );
};

export default MatchManagement;
