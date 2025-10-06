import * as React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { FAB } from "react-native-paper";
import UserDeviceTable from "@/features/user-device/UserDeviceTable";
import UserDeviceDialog from "@/features/user-device/UserDeviceDialog";
import { adminUserService } from "@/services/admin-user.service";
import {
  IUserDevice,
  CreateDeviceRequest,
  UpdateDeviceRequest,
  ApiResponse,
} from "@/types/user-device";

export default function UserDeviceManagement() {
  const [devices, setDevices] = React.useState<IUserDevice[]>([]);
  const [selectedDevice, setSelectedDevice] =
    React.useState<IUserDevice | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminUserService.getAllDevices();
      if (response.success && Array.isArray(response.data)) {
        setDevices(response.data);
      } else {
        setError(response.message || "Unable to load device list");
      }
    } catch (err) {
      console.error("Error fetching devices:", err);
      setError("An error occurred while loading the device list");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDevices();
  }, []);

  const handleAdd = () => {
    setSelectedDevice(null);
    setOpenDialog(true);
  };

  const handleEdit = (device: IUserDevice) => {
    setSelectedDevice(device);
    setOpenDialog(true);
  };

  const handleDelete = async (device: IUserDevice) => {
    setLoading(true);
    setError(null);
    try {
      // const response = await adminUserService.deleteDevice(device.id);
      // if (response.success) {
      //   setDevices((prev) => prev.filter((d) => d.id !== device.id));
      // } else {
      //   setError(response.message || "Unable to delete device");
      // }
    } catch (err) {
      setError("An error occurred while deleting the device");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (device: IUserDevice) => {
    setLoading(true);
    setError(null);
    try {
      let response: ApiResponse<IUserDevice>;
      if (device.id) {
        // Cập nhật thiết bị
        const updateData: UpdateDeviceRequest = {
          platform: device.platform,
          device_model: device.device_model,
          app_version: device.app_version,
          last_ip: device.last_ip,
        };
        // console.log(device.id);
        // console.log(updateData);
        response = await adminUserService.updateDevice(device.id, updateData);
        if (response.success) {
          setDevices((prev) =>
            prev.map((d) => (d.id === device.id ? response.data! : d))
          );
          fetchDevices();
        } else {
          setError(response.message || "Unable to update device");
        }
      } else {
        // Thêm mới thiết bị
        const createData: CreateDeviceRequest = {
          user_id: device.user_id,
          platform: device.platform,
          device_model: device.device_model,
          app_version: device.app_version,
          last_ip: device.last_ip,
        };
        response = await adminUserService.registerDevice(createData);
        if (response.success && Array.isArray(response.data)) {
          setDevices((prev) => [...prev, response.data!]);
          fetchDevices();
        } else {
          setError(response.message || "Unable to create device");
        }
      }
      setOpenDialog(false);
    } catch (err) {
      setError("An error occurred while saving the device");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {loading && (
        <View style={{ alignItems: "center", marginVertical: 16 }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {error && (
        <Text style={{ color: "red", marginBottom: 16, textAlign: "center" }}>
          {error}
        </Text>
      )}
      {!loading && (
        <UserDeviceTable
          devices={devices}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      <FAB
        icon="plus"
        style={{ position: "absolute", bottom: 16, right: 16 }}
        onPress={handleAdd}
      />
      <UserDeviceDialog
        visible={openDialog}
        device={selectedDevice}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
      />
    </View>
  );
}
