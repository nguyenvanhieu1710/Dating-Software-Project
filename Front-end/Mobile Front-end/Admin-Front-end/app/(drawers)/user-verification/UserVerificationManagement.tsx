import * as React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useTheme } from "react-native-paper";
import { adminUserService } from "@/services/admin-user.service";
import { IUserVerification } from "@/types/user-verification";
import VerificationQueueList from "@/features/user-verification/VerificationQueueList";
import VerificationDetailModal from "@/features/user-verification/VerificationDetailModal";

export default function UserVerificationManagement() {
  const theme = useTheme();
  const [verifications, setVerifications] = React.useState<IUserVerification[]>(
    []
  );
  const [selectedVerification, setSelectedVerification] =
    React.useState<IUserVerification | null>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchVerifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminUserService.getAllVerifications();
      console.log("Verifications: ", response.data);
      if (response.success && Array.isArray(response.data)) {
        const data = response.data;
        setVerifications(data);
      } else {
        setError(response.message || "Failed to load verifications");
      }
    } catch (err) {
      console.error("Error fetching verifications:", err);
      setError("An error occurred while loading verifications");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchVerifications();
  }, []);

  const handleSelectVerification = (verification: IUserVerification) => {
    setSelectedVerification(verification);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedVerification(null);
  };

  const handleVerified = async (id: number, notes: string) => {
    try {
      const response = await adminUserService.updateVerification(id, {
        status: "verified",
        notes,
        reviewed_by: 5, // TODO: Thay bằng admin ID thực tế
      });

      if (response.success && response.data) {
        setVerifications((prev) =>
          prev.map((v) => (v.id === id ? response.data! : v))
        );
        handleCloseModal();
      } else {
        throw new Error(response.message || "Failed to approve");
      }
    } catch (error) {
      console.error("Error approving verification:", error);
      throw error;
    }
  };

  const handleReject = async (id: number, reason: string, notes: string) => {
    try {
      const response = await adminUserService.updateVerification(id, {
        status: "rejected",
        notes: `${reason}${notes ? ` - ${notes}` : ""}`,
        reviewed_by: 1, // TODO: Thay bằng admin ID thực tế
      });

      if (response.success && response.data) {
        setVerifications((prev) =>
          prev.map((v) => (v.id === id ? response.data! : v))
        );
        handleCloseModal();
      } else {
        throw new Error(response.message || "Failed to reject");
      }
    } catch (error) {
      console.error("Error rejecting verification:", error);
      throw error;
    }
  };

  const handleFlag = async (id: number, notes: string) => {
    try {
      const response = await adminUserService.updateVerification(id, {
        status: "pending",
        notes: `⚠ FLAGGED: ${notes}`,
        reviewed_by: 1, // TODO: Thay bằng admin ID thực tế
      });

      if (response.success && response.data) {
        setVerifications((prev) =>
          prev.map((v) => (v.id === id ? response.data! : v))
        );
        handleCloseModal();
      } else {
        throw new Error(response.message || "Failed to flag");
      }
    } catch (error) {
      console.error("Error flagging verification:", error);
      throw error;
    }
  };

  if (loading && verifications.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          style={{
            marginTop: 16,
            color: theme.colors.onSurface,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Loading data...
        </Text>
      </View>
    );
  }

  if (error && verifications.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: theme.colors.error,
            textAlign: "center",
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <VerificationQueueList
        verifications={verifications}
        onSelectVerification={handleSelectVerification}
      />

      <VerificationDetailModal
        visible={openModal}
        verification={selectedVerification}
        onClose={handleCloseModal}
        onVerified={handleVerified}
        onReject={handleReject}
        onFlag={handleFlag}
      />
    </View>
  );
}
