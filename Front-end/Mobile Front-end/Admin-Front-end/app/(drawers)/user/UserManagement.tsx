import * as React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { FAB, useTheme, TextInput } from "react-native-paper";
import UserTable from "@/features/user/UserTable";
import UserDialog from "@/features/user/UserDialog";
import PaginationControls from "@/components/paginations/TablePagination";
import { adminUserService } from "@/services/admin-user.service"; // Import service
import { IUser } from "@/types/user";
import { IProfile } from "@/types/profile";

// Helper: Map từ flat API response sang nested state
const mapFlatToNested = (flatData: any): IUser & { profile?: IProfile } => {
  const user: IUser = {
    id: parseInt(flatData.id, 10), // Chuyển string sang number nếu cần
    email: flatData.email,
    phone_number: flatData.phone_number,
    status: flatData.status,
    password_hash: flatData.password_hash,
    created_at: flatData.created_at,
    updated_at: flatData.updated_at,
  };

  const profile: IProfile = {
    user_id: parseInt(flatData.user_id, 10),
    first_name: flatData.first_name,
    dob: flatData.dob,
    gender: flatData.gender,
    bio: flatData.bio,
    job_title: flatData.job_title,
    company: flatData.company,
    school: flatData.school,
    education: flatData.education,
    height_cm: flatData.height_cm,
    relationship_goals: flatData.relationship_goals,
    location: flatData.location,
    popularity_score: flatData.popularity_score,
    message_count: flatData.message_count,
    last_active_at: flatData.last_active_at,
    is_verified: flatData.is_verified,
    is_online: flatData.is_online,
    last_seen: flatData.last_seen,
    created_at: flatData.profile_created_at,
    updated_at: flatData.profile_updated_at,
  };

  return { ...user, profile };
};

// Helper: Map từ nested state sang flat (nếu cần gửi API flat, nhưng ở đây service gửi nested nên ít dùng)
const mapNestedToFlat = (nestedData: IUser & { profile?: IProfile }): any => {
  return {
    ...nestedData,
    ...nestedData.profile,
    password: "12345678",
  };
};

export default function UsersScreen() {
  const theme = useTheme();
  const [users, setUsers] = React.useState<(IUser & { profile?: IProfile })[]>(
    []
  );
  const [selectedUser, setSelectedUser] = React.useState<
    (IUser & { profile?: IProfile }) | null
  >(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Filter
  const filteredUsers = React.useMemo(() => {
    if (!searchTerm.trim()) return users;
    return users.filter(
      (user) =>
        user.id.toString().includes(searchTerm.trim()) ||
        user.email.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        user.profile?.first_name
          ?.toLowerCase()
          .includes(searchTerm.trim().toLowerCase())
    );
  }, [searchTerm, users]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminUserService.getAllUsers();
      // console.log("Response: ", response);
      if (response.success && Array.isArray(response.data)) {
        // console.log("Response data: ", response.data);
        const mappedUsers = response.data.map(mapFlatToNested);
        setUsers(mappedUsers);
      } else {
        setError(response.message || "Không thể tải danh sách users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Đã có lỗi xảy ra khi tải danh sách users");
    } finally {
      setLoading(false);
    }
  };

  // Load users khi component mount
  React.useEffect(() => {
    fetchUsers();
  }, []);

  // Handler thêm user
  const handleAdd = () => {
    setSelectedUser(null);
    setOpenDialog(true);
  };

  // Handler sửa user
  const handleEdit = (user: IUser & { profile?: IProfile }) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  // Handler xóa user
  const handleDelete = async (user: IUser & { profile?: IProfile }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminUserService.deleteUser(user.id);
      if (response.success) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      } else {
        setError(response.message || "Không thể xóa user");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi xóa user");
    } finally {
      setLoading(false);
    }
  };

  // Handler lưu user (thêm mới hoặc cập nhật)
  const handleSave = async (user: IUser & { profile?: IProfile }) => {
    setLoading(true);
    setError(null);

    try {
      let response;

      const flatUser = mapNestedToFlat(user);
      console.log("Flat user: ", flatUser);
      if (user.id) {
        // Cập nhật user
        response = await adminUserService.updateUser(user.id, flatUser);
        console.log("Response: ", response);
        if (response.success) {
          // Map response flat sang nested trước khi update state
          const updatedUser = mapFlatToNested(response.data);
          console.log("Updated user: ", updatedUser);
          setUsers((prev) =>
            prev.map((u) => (u.id === user.id ? updatedUser : u))
          );
        } else {
          setError(response.message || "Không thể cập nhật user");
        }
      } else {
        // Thêm mới user (gửi nested)
        console.log("Flat user: ", flatUser);

        response = await adminUserService.createUser(flatUser);
        console.log("Response: ", response);
        if (response.success) {
          // Map response flat sang nested trước khi add vào state
          const newUser = mapFlatToNested(response.data);
          setUsers((prev) => [...prev, newUser]);
        } else {
          setError(response.message || "Không thể tạo user");
        }
      }
      setOpenDialog(false);
    } catch (err) {
      setError("Đã có lỗi xảy ra khi lưu user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Search input */}
      <TextInput
        mode="outlined"
        placeholder="Search by ID, Email, or Name"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={{
          marginBottom: 12,
          fontFamily: theme.fonts.bodyLarge.fontFamily,
          backgroundColor: theme.colors.surface,
        }}
        outlineStyle={{ borderRadius: 12 }}
      />
      {/* Hiển thị loading spinner */}
      {loading && (
        <View style={{ alignItems: "center", marginVertical: 16 }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {/* Hiển thị thông báo lỗi */}
      {error && (
        <Text style={{ color: "red", marginBottom: 16, textAlign: "center" }}>
          {error}
        </Text>
      )}

      {/* Bảng User */}
      {!loading && (
        <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {/* Pagination */}
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Nút thêm mới */}
      <FAB
        icon="plus"
        style={{ position: "absolute", bottom: 16, right: 16 }}
        onPress={handleAdd}
      />

      {/* Dialog thêm/sửa */}
      <UserDialog
        visible={openDialog}
        user={selectedUser}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
      />
    </View>
  );
}
