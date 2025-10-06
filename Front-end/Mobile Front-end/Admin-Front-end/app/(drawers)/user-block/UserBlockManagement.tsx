import * as React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { FAB, useTheme } from "react-native-paper";
import UserBlockTable from "@/features/user-block/UserBlockTable";
import UserBlockDialog from "@/features/user-block/UserBlockDialog";
import { adminUserService } from "@/services/admin-user.service";
import { IUserBlock, BlockQueryParams, CreateBlockRequest } from "@/types/user-block";

export default function UserBlockManagement() {
  const theme = useTheme();
  const [blocks, setBlocks] = React.useState<IUserBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = React.useState<IUserBlock | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchBlocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminUserService.getAllBlocks();
      // console.log("blocks: ", response);      
      if (response.success && Array.isArray(response.data)) {
        setBlocks(response.data);
      } else {
        setError(response.message || "An error occurred while loading the blocks list.");
      }
    } catch (err) {
      console.error("Error fetching blocks:", err);
      setError("An error occurred while loading the blocks list.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBlocks();
  }, []);

  const handleAdd = () => {
    setSelectedBlock(null);
    setOpenDialog(true);
  };

  const handleUnblock = async (block: IUserBlock) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminUserService.unblockUser(block.blocked_id);
      if (response.success) {
        setBlocks((prev) => prev.filter((b) => b.id !== block.id));
      } else {
        setError(response.message || "Cannot unblock user");
      }
    } catch (err) {
      setError("An error occurred while unblocking the user.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (blockData: CreateBlockRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminUserService.blockUser(blockData);
      if (response.success && Array.isArray(response.data)) {
        setBlocks((prev) => [...prev, response.data as IUserBlock]);
        setOpenDialog(false);
      } else {
        setError(response.message || "Cannot block user");
      }
    } catch (err) {
      setError("An error occurred while blocking the user.");
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    errorText: {
      color: theme.colors.error,
      marginBottom: 16,
      textAlign: "center",
    },
    fab: {
      position: "absolute",
      bottom: 16,
      right: 16,
    },
  });

  return (
    <View style={styles.container}>
      {loading && (
        <View style={{ alignItems: "center", marginVertical: 16 }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
      {!loading && (
        <UserBlockTable blocks={blocks} onUnblock={handleUnblock} />
      )}
      {/* <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAdd}
      /> */}
      <UserBlockDialog
        visible={openDialog}
        block={selectedBlock}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
      />
    </View>
  );
}