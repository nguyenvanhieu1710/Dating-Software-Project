import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from "react-native";
// import { Picker } from '@react-native-picker/picker';
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./match-management-styles";
import {
  adminMatchService,
  type Match,
  type MatchFilters,
} from "../../../services/adminMatchService";

// Define types
type MatchStatus = "active" | "unmatch";
type SortField =
  | "created_at"
  | "last_message"
  | "message_count"
  | "status"
  | "report_count";
type SortOrder = "asc" | "desc";
type ModalType = "create" | "edit" | "view" | "delete" | null;
type UserRole = "admin" | "moderator" | "viewer";

interface FormData {
  user1_id?: number;
  user2_id?: number;
  status: MatchStatus;
}

interface FormErrors {
  [key: string]: string | undefined;
  user1_id?: string;
  user2_id?: string;
  status?: string;
}

interface StatusOption {
  value: MatchStatus;
  label: string;
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

const getStatusColor = (status: MatchStatus): string => {
  switch (status) {
    case "active":
      return "#4CAF50";
    case "unmatch":
      return "#FF9800";
    default:
      return "#9E9E9E";
  }
};

const getStatusIcon = (status: MatchStatus): string => {
  switch (status) {
    case "active":
      return "checkmark-circle";
    case "unmatch":
      return "remove-circle";
    default:
      return "help-circle";
  }
};

const getStatusLabel = (status: MatchStatus): string => {
  switch (status) {
    case "active":
      return "Active";
    case "unmatch":
      return "Unmatch";
    default:
      return "Unknown";
  }
};

// Status options for dropdown
const statusOptions: StatusOption[] = [
  { value: "active", label: "Active" },
  { value: "unmatch", label: "Unmatch" }
];

export interface User {
  id: string | number;
  email: string;
  phone_number: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string | number;
  first_name: string;
  dob: string; // ISO date string
  gender: "male" | "female" | "other"; // nếu bạn chỉ có male/female thì có thể giới hạn
  bio: string | null;
  job_title: string | null;
  school: string | null;
  location: string; // WKT hoặc GeoJSON string
  popularity_score: number;
  last_active_at: string;
  is_verified: boolean;
}

export default function MatchManagement() {
  // Data state
  const [matches, setMatches] = useState<Match[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchToDelete, setMatchToDelete] = useState<Match | null>(null);

  // Helper to handle modal visibility
  const showModal = (type: ModalType, match: Match | null = null) => {
    setSelectedMatch(match);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedMatch(null);
    setFormData({
      user1_id: undefined,
      user2_id: undefined,
      status: "active" as MatchStatus,
    });
    setFormErrors({});
  };

  // Form state
  const [formData, setFormData] = useState<Partial<Match>>({
    user1_id: undefined,
    user2_id: undefined,
    status: "active" as MatchStatus,
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Filtering and sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<MatchStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // UI state
  const [userRole] = useState<"admin" | "moderator" | "viewer">("admin");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionInProgress, setActionInProgress] = useState(false);

  // Fetch matches from API
  const fetchMatches = useCallback(async () => {
    try {
      setIsLoading(true);
      // Prepare API parameters with correct property names
      const apiParams: MatchFilters = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      const response: any = await adminMatchService.getMatches(apiParams);
      console.log("Response of getMatches: ", response);

      // Handle different response structures
      let matches = [];
      let total = 0;

      if (response?.success && response?.data) {
        // API returns {success: true, data: [...], pagination: {...}}
        matches = response.data || [];
        total = response.pagination?.total || response.data?.length || 0;
      } else if (response?.matches) {
        // Fallback for {matches: [...], total: number} structure
        matches = response.matches || [];
        total = response.total || 0;
      } else if (Array.isArray(response)) {
        // Fallback for direct array response
        matches = response;
        total = response.length;
      }

      console.log("Processed matches:", matches);
      console.log("Total:", total);
      console.log("First match structure:", matches[0]);

      setMatches(matches);
      setTotalItems(total);
      setFilteredMatches(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      showError("Failed to load matches. Please try again.");
      // Set empty arrays on error to prevent undefined issues
      setMatches([]);
      setFilteredMatches([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [currentPage, searchQuery, sortBy, sortOrder, statusFilter]);

  const fetchUser = async () => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/user`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    console.log("List of data:", result.data);
    setUsers(result.data);
  };

  // Initial data load
  useEffect(() => {
    fetchMatches();
    fetchUser();
  }, [fetchMatches]);

  // Apply client-side filters and sorting
  useEffect(() => {
    applyFiltersAndSort();
  }, [matches, searchQuery, sortBy, sortOrder, statusFilter]);

  const getUserById = (userId: number) => {
    return users.find((user) => user.id === userId || user.user_id === userId);
  };

  const getUserDisplayName = (userId: number) => {
    const user = getUserById(userId);
    return user?.first_name || `User ${userId}`;
  };

  const getUserEmail = (userId: number) => {
    const user = getUserById(userId);
    return user?.email || "unknown@email.com";
  };

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

  const getUserLocation = (userId: number) => {
    const user = getUserById(userId);
    return user?.location ? "Location Available" : "No Location";
  };

  const renderMatchCard = (match: Match) => {
    const user1 = getUserById(match.user1_id);
    const user2 = getUserById(match.user2_id);

    return (
      <View key={match.id} style={styles.matchCard}>
        <View style={styles.matchHeader}>
          <View style={styles.matchIdContainer}>
            <Text style={styles.matchId}>Match #{match.id}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(match.status) },
              ]}
            >
              <Ionicons
                name={getStatusIcon(match.status) as any}
                size={12}
                color="#FFFFFF"
              />
              <Text style={styles.statusText}>
                {getStatusLabel(match.status)}
              </Text>
            </View>
          </View>

          <View style={styles.matchActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => showModal("view", match)}
            >
              <Ionicons name="eye" size={16} color="#4B5563" />
              <Text style={styles.actionButtonText}>View</Text>
            </TouchableOpacity>

            {hasPermission("edit") && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditMatch(match)}
              >
                <Ionicons name="pencil" size={16} color="#4B5563" />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
            )}

            {hasPermission("delete") && (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteClick(match)}
              >
                <Ionicons name="trash" size={16} color="#EF4444" />
                <Text style={[styles.actionButtonText, { color: "#EF4444" }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* User Information Section */}
        <View style={styles.usersContainer}>
          {/* User 1 */}
          <View style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {user1?.first_name?.charAt(0)?.toUpperCase() || "U"}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {user1?.first_name || `User ${match.user1_id}`}
                </Text>
                {/* <Text style={styles.userEmail}>
                  {user1?.email || "unknown@email.com"}
                </Text> */}
              </View>
            </View>

            <View style={styles.userDetails}>
              {user1?.gender && (
                <View style={styles.userDetailItem}>
                  <Ionicons name="person" size={12} color="#6B7280" />
                  <Text style={styles.userDetailText}>{user1.gender}</Text>
                </View>
              )}
              {getUserAge(match.user1_id) && (
                <View style={styles.userDetailItem}>
                  <Ionicons name="calendar" size={12} color="#6B7280" />
                  <Text style={styles.userDetailText}>
                    {getUserAge(match.user1_id)} years old
                  </Text>
                </View>
              )}
              {user1?.job_title && (
                <View style={styles.userDetailItem}>
                  <Ionicons name="briefcase" size={12} color="#6B7280" />
                  <Text style={styles.userDetailText}>{user1.job_title}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Match Connector */}
          <View style={styles.matchConnector}>
            <Ionicons name="heart" size={20} color="#EF4444" />
          </View>

          {/* User 2 */}
          <View style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {user2?.first_name?.charAt(0)?.toUpperCase() || "U"}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {user2?.first_name || `User ${match.user2_id}`}
                </Text>
                {/* <Text style={styles.userEmail}>
                  {user2?.email || "unknown@email.com"}
                </Text> */}
              </View>
            </View>

            <View style={styles.userDetails}>
              {user2?.gender && (
                <View style={styles.userDetailItem}>
                  <Ionicons name="person" size={12} color="#6B7280" />
                  <Text style={styles.userDetailText}>{user2.gender}</Text>
                </View>
              )}
              {getUserAge(match.user2_id) && (
                <View style={styles.userDetailItem}>
                  <Ionicons name="calendar" size={12} color="#6B7280" />
                  <Text style={styles.userDetailText}>
                    {getUserAge(match.user2_id)} years old
                  </Text>
                </View>
              )}
              {user2?.job_title && (
                <View style={styles.userDetailItem}>
                  <Ionicons name="briefcase" size={12} color="#6B7280" />
                  <Text style={styles.userDetailText}>{user2.job_title}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Match Statistics */}
        <View style={styles.matchStats}>
          <View style={styles.statItem}>
            <Ionicons name="chatbubbles" size={14} color="#6B7280" />
            <Text style={styles.statText}>
              {match.message_count || 0} messages
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time" size={14} color="#6B7280" />
            <Text style={styles.statText}>
              Created {formatDate(match.created_at)}
            </Text>
          </View>
          {match.last_message_at && (
            <View style={styles.statItem}>
              <Ionicons name="paper-plane" size={14} color="#6B7280" />
              <Text style={styles.statText}>
                Last message {formatDate(match.last_message_at)}
              </Text>
            </View>
          )}
          {match.report_count && match.report_count > 0 && (
            <View style={styles.statItem}>
              <Ionicons name="warning" size={14} color="#EF4444" />
              <Text style={[styles.statText, { color: "#EF4444" }]}>
                {match.report_count} reports
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderViewModal = () => {
    if (!selectedMatch) return null;

    const user1 = getUserById(selectedMatch.user1_id);
    const user2 = getUserById(selectedMatch.user2_id);

    return (
      <Modal
        visible={activeModal === "view"}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Match Details</Text>
            <TouchableOpacity style={styles.filterButton} onPress={closeModal}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.viewModalContainer}>
              {/* Match Info */}
              <View style={styles.viewSection}>
                <Text style={styles.viewSectionTitle}>Match Information</Text>
                <View style={styles.viewInfoRow}>
                  <Text style={styles.viewLabel}>Match ID:</Text>
                  <Text style={styles.viewValue}>#{selectedMatch.id}</Text>
                </View>
                <View style={styles.viewInfoRow}>
                  <Text style={styles.viewLabel}>Status:</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(selectedMatch.status) },
                    ]}
                  >
                    <Ionicons
                      name={getStatusIcon(selectedMatch.status) as any}
                      size={12}
                      color="#FFFFFF"
                    />
                    <Text style={styles.statusText}>
                      {getStatusLabel(selectedMatch.status)}
                    </Text>
                  </View>
                </View>
                <View style={styles.viewInfoRow}>
                  <Text style={styles.viewLabel}>Created:</Text>
                  <Text style={styles.viewValue}>
                    {formatDate(selectedMatch.created_at)}
                  </Text>
                </View>
                <View style={styles.viewInfoRow}>
                  <Text style={styles.viewLabel}>Messages:</Text>
                  <Text style={styles.viewValue}>
                    {selectedMatch.message_count || 0}
                  </Text>
                </View>
                {selectedMatch.last_message_at && (
                  <View style={styles.viewInfoRow}>
                    <Text style={styles.viewLabel}>Last Message:</Text>
                    <Text style={styles.viewValue}>
                      {formatDate(selectedMatch.last_message_at)}
                    </Text>
                  </View>
                )}
                {selectedMatch.report_count &&
                  selectedMatch.report_count > 0 && (
                    <View style={styles.viewInfoRow}>
                      <Text style={styles.viewLabel}>Reports:</Text>
                      <Text style={[styles.viewValue, { color: "#EF4444" }]}>
                        {selectedMatch.report_count}
                      </Text>
                    </View>
                  )}
              </View>

              {/* User 1 Details */}
              <View style={styles.viewSection}>
                <Text style={styles.viewSectionTitle}>User 1 Details</Text>
                <View style={styles.userDetailCard}>
                  <View style={styles.userProfileHeader}>
                    <View style={styles.userAvatarLarge}>
                      <Text style={styles.userAvatarTextLarge}>
                        {user1?.first_name?.charAt(0)?.toUpperCase() || "U"}
                      </Text>
                    </View>
                    <View style={styles.userProfileInfo}>
                      <Text style={styles.userProfileName}>
                        {user1?.first_name || `User ${selectedMatch.user1_id}`}
                      </Text>
                      <Text style={styles.userProfileEmail}>
                        {user1?.email || "unknown@email.com"}
                      </Text>
                      {user1?.phone_number && (
                        <Text style={styles.userProfileDetail}>
                          {user1.phone_number}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.userProfileDetails}>
                    {user1?.gender && (
                      <View style={styles.profileDetailRow}>
                        <Text style={styles.profileDetailLabel}>Gender:</Text>
                        <Text style={styles.profileDetailValue}>
                          {user1.gender}
                        </Text>
                      </View>
                    )}
                    {getUserAge(selectedMatch.user1_id) && (
                      <View style={styles.profileDetailRow}>
                        <Text style={styles.profileDetailLabel}>Age:</Text>
                        <Text style={styles.profileDetailValue}>
                          {getUserAge(selectedMatch.user1_id)} years old
                        </Text>
                      </View>
                    )}
                    {user1?.job_title && (
                      <View style={styles.profileDetailRow}>
                        <Text style={styles.profileDetailLabel}>Job:</Text>
                        <Text style={styles.profileDetailValue}>
                          {user1.job_title}
                        </Text>
                      </View>
                    )}
                    {user1?.school && (
                      <View style={styles.profileDetailRow}>
                        <Text style={styles.profileDetailLabel}>School:</Text>
                        <Text style={styles.profileDetailValue}>
                          {user1.school}
                        </Text>
                      </View>
                    )}
                    {user1?.bio && (
                      <View style={styles.profileDetailRow}>
                        <Text style={styles.profileDetailLabel}>Bio:</Text>
                        <Text style={styles.profileDetailValue}>
                          {user1.bio}
                        </Text>
                      </View>
                    )}
                    <View style={styles.profileDetailRow}>
                      <Text style={styles.profileDetailLabel}>Verified:</Text>
                      <View style={styles.verificationStatus}>
                        <Ionicons
                          name={
                            user1?.is_verified
                              ? "checkmark-circle"
                              : "close-circle"
                          }
                          size={16}
                          color={user1?.is_verified ? "#10B981" : "#EF4444"}
                        />
                        <Text
                          style={[
                            styles.profileDetailValue,
                            {
                              color: user1?.is_verified ? "#10B981" : "#EF4444",
                            },
                          ]}
                        >
                          {user1?.is_verified ? "Verified" : "Not Verified"}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.profileDetailRow}>
                      <Text style={styles.profileDetailLabel}>Popularity:</Text>
                      <Text style={styles.profileDetailValue}>
                        {user1?.popularity_score || 0}
                      </Text>
                    </View>
                    {user1?.last_active_at && (
                      <View style={styles.profileDetailRow}>
                        <Text style={styles.profileDetailLabel}>
                          Last Active:
                        </Text>
                        <Text style={styles.profileDetailValue}>
                          {formatDate(user1.last_active_at)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* User 2 Details */}
              <View style={styles.viewSection}>
                <Text style={styles.viewSectionTitle}>User 2 Details</Text>
                <View style={styles.userDetailCard}>
                  <View style={styles.userProfileHeader}>
                    <View style={styles.userAvatarLarge}>
                      <Text style={styles.userAvatarTextLarge}>
                        {user2?.first_name?.charAt(0)?.toUpperCase() || "U"}
                      </Text>
                    </View>
                    <View style={styles.userProfileInfo}>
                      <Text style={styles.userProfileName}>
                        {user2?.first_name || `User ${selectedMatch.user2_id}`}
                      </Text>
                      <Text style={styles.userProfileEmail}>
                        {user2?.email || "unknown@email.com"}
                      </Text>
                      {user2?.phone_number && (
                        <Text style={styles.userProfileDetail}>
                          {user2.phone_number}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.userProfileDetails}>
                    {user2?.gender && (
                      <View style={styles.profileDetailRow}>
                        <Text style={styles.profileDetailLabel}>Gender:</Text>
                        <Text style={styles.profileDetailValue}>
                          {user2.gender}
                        </Text>
                      </View>
                    )}
                    {getUserAge(selectedMatch.user2_id) && (
                      <View style={styles.profileDetailRow}>
                        <Text style={styles.profileDetailLabel}>Age:</Text>
                        <Text style={styles.profileDetailValue}>
                          {getUserAge(selectedMatch.user2_id)} years old
                        </Text>
                      </View>
                    )}
                    {user2?.job_title && (
                      <View style={styles.profileDetailRow}>
                        <Text style={styles.profileDetailLabel}>Job:</Text>
                        <Text style={styles.profileDetailValue}>
                          {user2.job_title}
                        </Text>
                      </View>
                    )}
                    {user2?.school && (
                      <View style={styles.profileDetailRow}>
                        <Text style={styles.profileDetailLabel}>School:</Text>
                        <Text style={styles.profileDetailValue}>
                          {user2.school}
                        </Text>
                      </View>
                    )}
                    {user2?.bio && (
                      <View style={styles.profileDetailRow}>
                        <Text style={styles.profileDetailLabel}>Bio:</Text>
                        <Text style={styles.profileDetailValue}>
                          {user2.bio}
                        </Text>
                      </View>
                    )}
                    <View style={styles.profileDetailRow}>
                      <Text style={styles.profileDetailLabel}>Verified:</Text>
                      <View style={styles.verificationStatus}>
                        <Ionicons
                          name={
                            user2?.is_verified
                              ? "checkmark-circle"
                              : "close-circle"
                          }
                          size={16}
                          color={user2?.is_verified ? "#10B981" : "#EF4444"}
                        />
                        <Text
                          style={[
                            styles.profileDetailValue,
                            {
                              color: user2?.is_verified ? "#10B981" : "#EF4444",
                            },
                          ]}
                        >
                          {user2?.is_verified ? "Verified" : "Not Verified"}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.profileDetailRow}>
                      <Text style={styles.profileDetailLabel}>Popularity:</Text>
                      <Text style={styles.profileDetailValue}>
                        {user2?.popularity_score || 0}
                      </Text>
                    </View>
                    {user2?.last_active_at && (
                      <View style={styles.profileDetailRow}>
                        <Text style={styles.profileDetailLabel}>
                          Last Active:
                        </Text>
                        <Text style={styles.profileDetailValue}>
                          {formatDate(user2.last_active_at)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  // const applyFiltersAndSort = () => {
  //     // Ensure matches is an array
  //     if (!matches || !Array.isArray(matches)) {
  //         setFilteredMatches([]);
  //         return;
  //     }

  //     let filtered = [...matches];

  //     // Apply search filter
  //     if (searchQuery) {
  //         filtered = filtered.filter(match =>
  //             match.user1_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //             match.user2_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //             match.user1_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //             match.user2_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //             match.id.toString().includes(searchQuery)
  //         );
  //     }

  //     // Apply status filter
  //     if (statusFilter !== 'all') {
  //         filtered = filtered.filter(match => match.status === statusFilter);
  //     }

  //     // Apply sorting
  //     filtered.sort((a, b) => {
  //         let aValue: any, bValue: any;

  //         switch (sortBy) {
  //             case 'created_at':
  //                 aValue = new Date(a.created_at);
  //                 bValue = new Date(b.created_at);
  //                 break;
  //             case 'last_message':
  //                 aValue = a.last_message_at ? new Date(a.last_message_at) : new Date(0);
  //                 bValue = b.last_message_at ? new Date(b.last_message_at) : new Date(0);
  //                 break;
  //             case 'message_count':
  //                 aValue = a.message_count || 0;
  //                 bValue = b.message_count || 0;
  //                 break;
  //             case 'status':
  //                 aValue = a.status;
  //                 bValue = b.status;
  //                 break;
  //             case 'report_count':
  //                 aValue = a.report_count || 0;
  //                 bValue = b.report_count || 0;
  //                 break;
  //             default:
  //                 return 0;
  //         }

  //         if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
  //         if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
  //         return 0;
  //     });

  //     setFilteredMatches(filtered);
  //     setCurrentPage(1);
  // };

  const applyFiltersAndSort = () => {
    if (!matches || !Array.isArray(matches)) {
      setFilteredMatches([]);
      return;
    }

    let filtered = [...matches];

    // Apply search filter - tìm kiếm theo thông tin user
    if (searchQuery) {
      filtered = filtered.filter((match) => {
        const user1 = getUserById(match.user1_id);
        const user2 = getUserById(match.user2_id);
        const query = searchQuery.toLowerCase();

        return (
          // Search by user names
          user1?.first_name?.toLowerCase().includes(query) ||
          user2?.first_name?.toLowerCase().includes(query) ||
          // Search by emails
          user1?.email?.toLowerCase().includes(query) ||
          user2?.email?.toLowerCase().includes(query) ||
          // Search by phone numbers
          user1?.phone_number?.toLowerCase().includes(query) ||
          user2?.phone_number?.toLowerCase().includes(query) ||
          // Search by job titles
          user1?.job_title?.toLowerCase().includes(query) ||
          user2?.job_title?.toLowerCase().includes(query) ||
          // Search by schools
          user1?.school?.toLowerCase().includes(query) ||
          user2?.school?.toLowerCase().includes(query) ||
          // Search by match ID
          match.id.toString().includes(query)
        );
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((match) => match.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "created_at":
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case "last_message":
          aValue = a.last_message_at
            ? new Date(a.last_message_at)
            : new Date(0);
          bValue = b.last_message_at
            ? new Date(b.last_message_at)
            : new Date(0);
          break;
        case "message_count":
          aValue = a.message_count || 0;
          bValue = b.message_count || 0;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "report_count":
          aValue = a.report_count || 0;
          bValue = b.report_count || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredMatches(filtered);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil((filteredMatches?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMatches = (filteredMatches || []).slice(startIndex, endIndex);

  // CRUD Operations
  const handleCreateMatch = () => {
    if (!hasPermission("create")) {
      showError("You do not have permission to create matches");
      return;
    }
    setFormData({
      user1_id: undefined,
      user2_id: undefined,
      status: "active" as MatchStatus,
    });
    setFormErrors({});
    showModal("create");
  };

  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match);
    setFormData({
      ...match,
      user1_id: match.user1_id,
      user2_id: match.user2_id,
      status: match.status,
    });
    setFormErrors({});
    showModal("edit");
  };

  const handleDeleteClick = (match: Match) => {
    setMatchToDelete(match);
    showModal("delete");
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.user1_id) {
      errors.user1_id = "Please select user 1";
    }

    if (!formData.user2_id) {
      errors.user2_id = "Please select user 2";
    }

    if (
      formData.user1_id &&
      formData.user2_id &&
      formData.user1_id === formData.user2_id
    ) {
      errors.user2_id = "Cannot match the same user";
    }

    if (!formData.status) {
      errors.status = "Please select status";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // CRUD Operations
  const handleCreateConfirm = async () => {
    if (!validateForm()) return;

    setActionInProgress(true);
    try {
      await adminMatchService.createMatch({
        user1_id: formData.user1_id!,
        user2_id: formData.user2_id!,
        status: formData.status,
      });

      await fetchMatches();
      closeModal();
      showSuccess("Match created successfully");
    } catch (error) {
      showError("Failed to create match");
    } finally {
      setActionInProgress(false);
    }
  };

  const handleEditConfirm = async () => {
    if (!selectedMatch || !validateForm()) return;

    setActionInProgress(true);
    try {
      await adminMatchService.updateMatch(selectedMatch.id, {
        status: formData.status,
      });

      await fetchMatches();
      closeModal();
      showSuccess("Match updated successfully");
    } catch (error) {
      showError("Failed to update match");
    } finally {
      setActionInProgress(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMatch) return;

    setActionInProgress(true);
    try {
      await adminMatchService.deleteMatch(selectedMatch.id);

      await fetchMatches();
      closeModal();
      showSuccess("Match deleted successfully");
    } catch (error) {
      showError("Failed to delete match");
    } finally {
      setActionInProgress(false);
    }
  };

  // Helper functions
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessAlert(true);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorAlert(true);
  };

  const hasPermission = (action: string) => {
    const permissions = {
      admin: ["view", "create", "edit", "delete", "export"],
      moderator: ["view", "edit", "export"],
      viewer: ["view"],
    };
    return permissions[userRole]?.includes(action) || false;
  };

  const renderFormField = (
    label: string,
    field: keyof FormData,
    type: string = "text",
    options?: Array<{ value: string; label: string }>
  ) => {
    const value = formData[field];
    return (
      <View style={styles.formGroup} key={field}>
        <Text style={styles.formLabel}>{label}</Text>
        {type === "select" ? (
          <View style={styles.formButtonGroup}>
            {options?.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.formButton,
                  value === option.value && styles.formButtonActive,
                ]}
                onPress={() => handleInputChange(field, option.value)}
              >
                <Text
                  style={[
                    styles.formButtonText,
                    value === option.value && styles.formButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <TextInput
            style={[
              styles.formInput,
              formErrors[field] && {
                borderColor: "#EF4444",
                backgroundColor: "#FEF2F2",
              },
            ]}
            value={value?.toString() || ""}
            onChangeText={(text) => handleInputChange(field, text)}
            keyboardType={type === "number" ? "numeric" : "default"}
            placeholder={`Enter ${label.toLowerCase()}`}
            placeholderTextColor="#9CA3AF"
          />
        )}
        {formErrors[field] && (
          <Text style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>
            {formErrors[field]}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Success Alert */}
      {showSuccessAlert && (
        <View style={[styles.alertContainer, styles.successAlert]}>
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.alertText}>{successMessage}</Text>
        </View>
      )}

      {/* Error Alert */}
      {showErrorAlert && (
        <View style={[styles.alertContainer, styles.errorAlert]}>
          <Ionicons name="alert-circle" size={20} color="#FFFFFF" />
          <Text style={styles.alertText}>{errorMessage}</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Match Management</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              !hasPermission("create") && styles.buttonDisabled,
            ]}
            onPress={handleCreateMatch}
            disabled={!hasPermission("create")}
          >
            <Ionicons name="add" size={20} color="#8B5CF6" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="filter" size={20} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#9CA3AF"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by user names, emails, or match ID..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Sort:</Text>
            <View style={styles.filterGroup}>
              {[
                { key: "created_at", label: "Created" },
                { key: "last_message", label: "Last Message" },
                { key: "message_count", label: "Messages" },
                { key: "status", label: "Status" },
                { key: "report_count", label: "Reports" },
              ].map((sort) => (
                <TouchableOpacity
                  key={sort.key}
                  style={[
                    styles.sortButton,
                    sortBy === sort.key && styles.sortButtonActive,
                  ]}
                  onPress={() => {
                    if (sortBy === sort.key) {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortBy(sort.key as SortField);
                      setSortOrder("desc");
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.sortButtonText,
                      sortBy === sort.key && styles.sortButtonTextActive,
                    ]}
                  >
                    {sort.label}
                  </Text>
                  {sortBy === sort.key && (
                    <Ionicons
                      name={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
                      size={12}
                      color="#FFFFFF"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Status:</Text>
            <View style={styles.filterGroup}>
              {[
                { key: "all", label: "All" },
                { key: "active", label: "Active" },
                { key: "unmatched", label: "Unmatched" },
                { key: "blocked", label: "Blocked" },
                { key: "reported", label: "Reported" },
              ].map((status) => (
                <TouchableOpacity
                  key={status.key}
                  style={[
                    styles.statusFilterButton,
                    statusFilter === status.key && styles.statusFilterActive,
                  ]}
                  onPress={() =>
                    setStatusFilter(status.key as MatchStatus | "all")
                  }
                >
                  <Text
                    style={[
                      styles.statusFilterText,
                      statusFilter === status.key &&
                        styles.statusFilterActiveText,
                    ]}
                  >
                    {status.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Showing {paginatedMatches?.length || 0} of{" "}
          {filteredMatches?.length || 0} matches
          {searchQuery ? ` matching "${searchQuery}"` : ""}
          {statusFilter !== "all" ? ` with status "${statusFilter}"` : ""}
        </Text>
      </View>

      {/* Content */}
      {isLoading ? (
        <View
          style={[
            styles.loadingContainer,
            { flex: 1, justifyContent: "center" },
          ]}
        >
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={[styles.loadingText, { marginTop: 16 }]}>
            Loading matches...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.matchList}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={fetchMatches}
              colors={["#8B5CF6"]}
            />
          }
        >
          {(paginatedMatches?.length || 0) > 0 ? (
            (paginatedMatches || []).map((match) => {
              console.log("Rendering match:", match);
              return (
                // <View key={match.id} style={styles.matchCard}>
                //     <View style={styles.matchHeader}>
                //         <View style={styles.userInfo}>
                //             <Text style={styles.userName}>{match.user1_name || 'Unknown User'}</Text>
                //             <Text style={styles.userEmail}>{match.user1_email || 'unknown@email.com'}</Text>
                //         </View>
                //         <View style={styles.matchActions}>
                //             <TouchableOpacity
                //                 style={[styles.actionButton]}
                //                 onPress={() => showModal('view', match)}
                //             >
                //                 <Text style={{ fontSize: 12, color: '#4B5563', fontWeight: '500' }}>View</Text>
                //             </TouchableOpacity>

                //             <TouchableOpacity
                //                 style={[
                //                     styles.actionButton,
                //                     !hasPermission('edit') && styles.buttonDisabled
                //                 ]}
                //                 onPress={() => handleEditMatch(match)}
                //                 disabled={!hasPermission('edit')}
                //             >
                //                 <Text style={[
                //                     { fontSize: 12, color: '#4B5563', fontWeight: '500' },
                //                     !hasPermission('edit') && styles.buttonTextDisabled
                //                 ]}>
                //                     Edit
                //                 </Text>
                //             </TouchableOpacity>

                //             <TouchableOpacity
                //                 style={[
                //                     styles.actionButton,
                //                     styles.deleteButton,
                //                     !hasPermission('delete') && styles.buttonDisabled
                //                 ]}
                //                 onPress={() => handleDeleteClick(match)}
                //                 disabled={!hasPermission('delete')}
                //             >
                //                 <Text style={[
                //                     { fontSize: 12, color: '#4B5563', fontWeight: '500' },
                //                     !hasPermission('delete') && styles.buttonTextDisabled
                //                 ]}>
                //                     Delete
                //                 </Text>
                //             </TouchableOpacity>
                //         </View>
                //     </View>

                //     <View style={styles.matchDetails}>
                //         <View style={styles.matchStats}>
                //             <View style={[styles.statusBadge, { backgroundColor: getStatusColor(match.status) }]}>
                //                 <Ionicons name={getStatusIcon(match.status) as any} size={12} color="#FFFFFF" />
                //                 <Text style={styles.statusText}>{getStatusLabel(match.status)}</Text>
                //             </View>
                //             <Text style={styles.summaryText}>
                //                 {formatDate(match.created_at)}
                //             </Text>
                //         </View>
                //     </View>
                // </View>
                renderMatchCard(match)
              );
            })
          ) : (
            <View style={styles.loadingContainer}>
              <Ionicons name="people-outline" size={48} color="#D1D5DB" />
              <Text style={styles.loadingText}>No matches found</Text>
              <TouchableOpacity
                style={[styles.actionButton, { marginTop: 16 }]}
                onPress={fetchMatches}
              >
                <Text
                  style={{ fontSize: 12, color: "#4B5563", fontWeight: "500" }}
                >
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {/* Create Modal */}
      <Modal
        visible={activeModal === "create"}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Match</Text>
            <TouchableOpacity style={styles.filterButton} onPress={closeModal}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.formContainer}>
              {renderFormField("User 1 ID", "user1_id", "number")}
              {renderFormField("User 2 ID", "user2_id", "number")}
              {renderFormField("Status", "status", "select", statusOptions)}
            </View>

            <View style={styles.modalActionContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={closeModal}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalSubmitButton,
                  (!formData.user1_id ||
                    !formData.user2_id ||
                    !formData.status) &&
                    styles.modalSubmitButtonDisabled,
                ]}
                onPress={handleCreateConfirm}
                disabled={
                  !formData.user1_id || !formData.user2_id || !formData.status
                }
              >
                <Text
                  style={[
                    styles.modalSubmitButtonText,
                    (!formData.user1_id ||
                      !formData.user2_id ||
                      !formData.status) &&
                      styles.modalSubmitButtonTextDisabled,
                  ]}
                >
                  Create Match
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={activeModal === "edit"}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Match</Text>
            <TouchableOpacity style={styles.filterButton} onPress={closeModal}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.formContainer}>
              {renderFormField("User 1 ID", "user1_id", "number")}
              {renderFormField("User 2 ID", "user2_id", "number")}
              {renderFormField("Status", "status", "select", statusOptions)}
            </View>

            <View style={styles.modalActionContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={closeModal}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleEditConfirm}
              >
                <Text style={styles.modalSubmitButtonText}>Update Match</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Delete Modal */}
      <Modal
        visible={activeModal === "delete"}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Delete Match</Text>
            <TouchableOpacity style={styles.filterButton} onPress={closeModal}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.deleteModalContainer}>
              <Ionicons
                name="warning"
                size={48}
                color="#EF4444"
                style={styles.deleteWarningIcon}
              />
              <Text style={styles.deleteModalTitle}>Delete Match</Text>
              <Text style={styles.deleteModalMessage}>
                Are you sure you want to delete this match?
              </Text>
              <Text style={styles.deleteModalDetails}>
                User 1: {selectedMatch?.user1_name || "Unknown User"}
              </Text>
              <Text style={styles.deleteModalDetails}>
                User 2: {selectedMatch?.user2_name || "Unknown User"}
              </Text>
              <Text style={styles.deleteModalWarning}>
                This action cannot be undone.
              </Text>
            </View>

            <View style={styles.modalActionContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={closeModal}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteConfirmButton}
                onPress={handleDeleteConfirm}
              >
                <Text style={styles.deleteConfirmButtonText}>Delete Match</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* View Modal */}
      {renderViewModal()}

      {/* Loading Overlay */}
      {actionInProgress && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.loadingOverlayText}>Processing...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
