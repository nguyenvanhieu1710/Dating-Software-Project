import { View, SafeAreaView, ScrollView, Platform, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import Geolocation from "react-native-geolocation-service";
import { PermissionsAndroid } from "react-native";
import * as Location from "expo-location";
import {
  Appbar,
  SegmentedButtons,
  Button,
  ActivityIndicator,
  Text,
  useTheme,
} from "react-native-paper";
import { getUserProfile, updateUserProfile, User } from "../services/userApi";
import { userService } from "@/services/user.service";
import { interestService } from "@/services/interest.service";
import { goalService } from "@/services/goal.service";
import { photoService } from "@/services/photo.service";
import { FlatUserProfile, IUser } from "@/types/user";

// Import components
import StatusBadge from "./profile/edit-profile/StatusBadge";
import AccountInfoSection from "./profile/edit-profile/AccountInfoSection";
import PhotosSection from "./profile/edit-profile/PhotosSection";
import BasicInfoSection from "./profile/edit-profile/BasicInfoSection";
import BioSection from "./profile/edit-profile/BioSection";
import InterestsSection from "./profile/edit-profile/InterestsSection";
import GoalsSection from "./profile/edit-profile/GoalsSection";
import ProfessionalInfoSection from "./profile/edit-profile/ProfessionalInfoSection";
import LocationSection from "./profile/edit-profile/LocationSection";
import PreviewContent from "./profile/edit-profile/PreviewContent";
import {
  getCurrentLocation,
  requestLocationPermission,
  getCurrentReadableLocation,
} from "@/utils/geolocation";

interface PhotoItem {
  id: number;
  url: string;
}

export default function EditProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("edit");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<FlatUserProfile | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const isWebPlatform = Platform.OS === "web";

  const notify = (title: string, message?: string) => {
    if (isWebPlatform && typeof window !== "undefined") {
      window.alert(message ? `${title}\n\n${message}` : title);
    } else {
      Alert.alert(title, message);
    }
  };

  const confirmAsync = (title: string, message: string): Promise<boolean> => {
    if (isWebPlatform && typeof window !== "undefined") {
      return Promise.resolve(window.confirm(`${title}\n\n${message}`));
    }
    return new Promise((resolve) => {
      Alert.alert(title, message, [
        { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
        { text: "OK", style: "destructive", onPress: () => resolve(true) },
      ]);
    });
  };

  const handleUseMyLocation = async () => {
    const granted = await requestLocationPermission();
    if (!granted) {
      alert("Please allow location access to use this feature.");
      return;
    }

    try {
      const coords = await getCurrentLocation();
      const locationStr = `POINT(${coords.longitude.toFixed(4)} ${coords.latitude.toFixed(4)})`;
      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          location: locationStr,
          updated_at: new Date().toISOString(),
        };
      });
      // => { latitude: 21.0285, longitude: 105.8542, address: "Hoàn Kiếm, Hà Nội, Việt Nam" }
      const loc = await getCurrentReadableLocation();
      // console.log("📍 My Location:", loc);
      setAddress(loc.address as any);
    } catch (err) {
      console.error("Failed to get location:", err);
    }
  };

  useEffect(() => {
    loadUserProfile();
    loadUserPhotos();
    loadInterests();
    loadGoals();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userProfile = await userService.getUserById(Number(userId));
      // console.log("Profile of user response:", userProfile.data);
      if (userProfile.success && userProfile.data) {
        setUser(userProfile.data as any);
        const loc = await getCurrentReadableLocation();
        setAddress(loc.address as any);
      }
    } catch (err: any) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const updateData: any = {
        id: user?.id,
        email: user?.email,
        phone_number: user?.phone_number,
        status: user?.status,
        password: '12345678',
        created_at: user?.created_at,
        updated_at: user?.updated_at,

        user_id: user?.user_id,
        first_name: user?.first_name,
        dob: user?.dob,
        gender: user?.gender,
        bio: user?.bio,
        job_title: user?.job_title,
        company: user?.company,
        school: user?.school,
        education: user?.education,
        height_cm: user?.height_cm,
        relationship_goals: user?.relationship_goals,
        location: user?.location,
        popularity_score: user?.popularity_score,
        message_count: user?.message_count,
        last_active_at: user?.last_active_at,
        is_verified: user?.is_verified,
        is_online: user?.is_online,
        last_seen: user?.last_seen,
        profile_created_at: user?.created_at,
        profile_updated_at: user?.updated_at,
      };

      const updateUser = await userService.updateUser(
        Number(user?.id),
        updateData
      );
      // console.log("Update user response:", updateUser);
      if (updateUser.success) {
        notify("Success", "Profile updated successfully!");
        setUser(updateUser.data as any);
      }

      router.back();
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Please try again.");
      notify("Error", "Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const loadUserPhotos = async () => {
    try {
      // console.log("Loading photos for user:", userId);
      const res = await photoService.getPhotosByUserId(Number(userId));
      // console.log("Photos response:", res);
      if (res.success && Array.isArray(res.data)) {
        const photoItems: PhotoItem[] = res.data.map((photo: any) => ({
          id: photo.id,
          url: `${process.env.EXPO_PUBLIC_API_URL}${photo.url}`,
        }));
        setPhotos(photoItems);
      } else {
        notify("Error", "Failed to load photos from server.");
      }
    } catch (error) {
      console.error("Error loading photos:", error);
    }
  };

  const loadInterests = async () => {
    try {
      const response = await interestService.getAllInterests();
      // console.log("Interests response:", response);
      if (
        response.success &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        setInterests(response.data.data.map((item: any) => item.name));
      } else {
        notify("Error", "Failed to load interests from server.");
      }
    } catch (error) {
      console.error("Error loading interests:", error);
    }
  };

  const loadGoals = async () => {
    try {
      const response = await goalService.getAllGoals();
      if (
        response.success &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        setGoals(response.data.data.map((item: any) => item.name));
      } else {
        notify("Error", "Failed to load goals from server.");
      }
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  };

  const pickImage = async () => {
    try {
      console.log("pickImage: Started");
      const isWeb =
        typeof window !== "undefined" && typeof document !== "undefined";

      if (isWeb) {
        await openFilePicker();
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission denied",
            "Camera roll permission is required to select photos"
          );
          return;
        }

        Alert.alert(
          "Select Photo",
          "Choose from where you want to select a photo",
          [
            { text: "Camera", onPress: () => openCamera() },
            { text: "Gallery", onPress: () => openGallery() },
            { text: "Cancel", style: "cancel" },
          ]
        );
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Camera permission is required");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error opening camera:", error);
    }
  };

  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error opening gallery:", error);
    }
  };

  const openFilePicker = async () => {
    try {
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = false;

        return new Promise<void>((resolve, reject) => {
          input.onchange = async (event: any) => {
            try {
              const file = event.target.files?.[0];
              if (file) {
                if (!file.type.startsWith("image/")) {
                  notify("Error", "Please select an image file");
                  resolve();
                  return;
                }

                if (file.size > 10 * 1024 * 1024) {
                  notify("Error", "File size must be less than 10MB");
                  resolve();
                  return;
                }

                await uploadPhotoFromFile(file);
                resolve();
              } else {
                resolve();
              }
            } catch (error) {
              console.error("Error in file selection:", error);
              notify("Error", "Failed to process selected file");
              reject(error);
            }
          };

          input.oncancel = () => resolve();
          input.click();
        });
      } else {
        notify("Info", "File picker not available. Using gallery instead.");
        await openGallery();
      }
    } catch (error) {
      console.error("Error opening file picker:", error);
      notify("Error", "Failed to open file picker. Try using gallery instead.");
    }
  };

  const uploadPhotoFromFile = async (file: File) => {
    try {
      setIsUploadingPhoto(true);

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/upload/single`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadResult = await uploadResponse.json();

      if (uploadResult.success) {
        const photoResponse = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/photo`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              url: uploadResult.file.path,
              order_index: photos.length,
            }),
          }
        );

        const photoResult = await photoResponse.json();

        if (photoResult.success) {
          const created = photoResult.data;
          const fullUrl = `${process.env.EXPO_PUBLIC_API_URL}${uploadResult.file.path}`;
          setPhotos((prev) => [...prev, { id: created.id, url: fullUrl }]);
          notify("Success", "Photo uploaded successfully!");
        } else {
          notify("Error", "Failed to save photo metadata");
        }
      } else {
        notify("Error", "Failed to upload photo");
      }
    } catch (error) {
      console.error("Error uploading photo from file:", error);
      notify("Error", "Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const uploadPhoto = async (imageUri: string) => {
    try {
      setIsUploadingPhoto(true);

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: `photo_${Date.now()}.jpg`,
      } as any);

      const uploadResponse = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/upload/single`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadResult = await uploadResponse.json();

      if (uploadResult.success) {
        const photoResponse = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/photo`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              url: uploadResult.file.path,
              order_index: photos.length,
            }),
          }
        );

        const photoResult = await photoResponse.json();

        if (photoResult.success) {
          const created = photoResult.data;
          const fullUrl = `${process.env.EXPO_PUBLIC_API_URL}${uploadResult.file.path}`;
          setPhotos((prev) => [...prev, { id: created.id, url: fullUrl }]);
          notify("Success", "Photo uploaded successfully!");
        } else {
          notify("Error", "Failed to save photo metadata");
        }
      } else {
        notify("Error", "Failed to upload photo");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      notify("Error", "Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const deletePhoto = async (photoIndex: number) => {
    try {
      const photo = photos[photoIndex];
      if (!photo) return;

      const confirmed = await confirmAsync(
        "Delete Photo",
        "Are you sure you want to delete this photo?"
      );
      if (!confirmed) return;

      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/photo/${photo.id}/by-user/${userId}`,
          {
            method: "DELETE",
          }
        );
        const result = await response.json();
        if (result.success) {
          const newPhotos = photos.filter((_, index) => index !== photoIndex);
          setPhotos(newPhotos);
          notify("Deleted", "Photo deleted successfully");
        } else {
          notify("Error", result.message || "Failed to delete photo");
        }
      } catch (err) {
        console.error("Error deleting photo:", err);
        notify("Error", "Failed to delete photo");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const updateFormField = (field: string, value: string) => {
    setUser((prev) => {
      if (!prev) return null;
      if (["first_name", "dob", "gender"].includes(field)) {
        return {
          ...prev,
          [field]: value,
        };
      }
      return { ...prev, [field]: value };
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 60,
            paddingHorizontal: 20,
          }}
        >
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text
            variant="bodyLarge"
            style={{ marginTop: 16, color: "#6B7280", textAlign: "center" }}
          >
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 60,
            paddingHorizontal: 20,
          }}
        >
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text
            variant="bodyLarge"
            style={{
              marginTop: 16,
              marginBottom: 20,
              color: "#EF4444",
              textAlign: "center",
            }}
          >
            {error}
          </Text>
          <Button
            mode="contained"
            onPress={loadUserProfile}
            buttonColor="#8B5CF6"
            style={{ marginTop: 8 }}
          >
            Try Again
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: "#FFFFFF", elevation: 1 }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title="Edit Profile"
          titleStyle={{ fontSize: 20, fontWeight: "bold" }}
        />
        {user && (
          <View style={{ marginRight: 12 }}>
            <StatusBadge
              status={user.status || ""}
              verified={user.is_verified || false}
            />
          </View>
        )}
      </Appbar.Header>

      {/* Tabs */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: "#E8E8E8",
        }}
      >
        <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          buttons={[
            { value: "edit", label: "Edit" },
            { value: "preview", label: "Preview" },
          ]}
          style={{ backgroundColor: "#FFFFFF" }}
          theme={{
            fonts: {
              labelLarge: {
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              },
            },
          }}
        />
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1, padding: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "edit" ? (
          <View>
            {user && (
              <AccountInfoSection
                userId={user.user_id || 0}
                createdAt={user.created_at || ""}
                updatedAt={user.updated_at || ""}
                lastActiveAt={user.last_active_at || ""}
                popularityScore={user.popularity_score || 0}
              />
            )}

            <PhotosSection
              photos={photos}
              maxPhotos={5}
              onAddPhoto={pickImage}
              onDeletePhoto={deletePhoto}
              isUploading={isUploadingPhoto}
            />

            <BasicInfoSection
              formData={{
                first_name: user?.first_name || "",
                email: user?.email || "",
                phone_number: user?.phone_number || "",
                dob: user?.dob || "",
                gender: user?.gender || "",
              }}
              onUpdateField={updateFormField}
            />

            <BioSection
              bio={user?.bio || ""}
              onUpdateBio={(bio) => updateFormField("bio", bio)}
            />

            <InterestsSection
              interests={interests}
              selectedInterests={selectedInterests}
              onToggleInterest={toggleInterest}
            />

            <GoalsSection
              goals={goals}
              selectedGoals={selectedGoals}
              onToggleGoal={toggleGoal}
            />

            <ProfessionalInfoSection
              formData={{
                job_title: user?.job_title || "",
                company: user?.company || "",
                school: user?.school || "",
              }}
              onUpdateField={updateFormField}
            />

            <LocationSection
              location={user?.location || ""}
              address={address || ""}
              onUseMyLocation={handleUseMyLocation}
            />

            <Button
              mode="contained"
              onPress={handleSaveProfile}
              disabled={isSaving}
              loading={isSaving}
              buttonColor="#8B5CF6"
              style={{ marginTop: 16, marginBottom: 32, borderRadius: 25 }}
              contentStyle={{ paddingVertical: 8 }}
              labelStyle={{
                fontSize: 16,
                fontWeight: "bold",
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              Save Changes
            </Button>
          </View>
        ) : (
          <PreviewContent
            formData={user}
            photos={photos}
            selectedInterests={selectedInterests}
            selectedGoals={selectedGoals}
            userData={user}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
