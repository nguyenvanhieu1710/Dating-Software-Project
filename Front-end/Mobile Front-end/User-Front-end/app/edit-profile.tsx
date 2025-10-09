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
import { interestService } from "@/services/interest.service";
import { goalService } from "@/services/goal.service";

// Import components
import { StatusBadge } from "./profile/edit-profile/StatusBadge";
import { AccountInfoSection } from "./profile/edit-profile/AccountInfoSection";
import { PhotosSection } from "./profile/edit-profile/PhotosSection";
import { BasicInfoSection } from "./profile/edit-profile/BasicInfoSection";
import { BioSection } from "./profile/edit-profile/BioSection";
import { InterestsSection } from "./profile/edit-profile/InterestsSection";
import { GoalsSection } from "./profile/edit-profile/GoalsSection";
import { ProfessionalInfoSection } from "./profile/edit-profile/ProfessionalInfoSection";
import { LocationSection } from "./profile/edit-profile/LocationSection";
import { PreviewContent } from "./profile/edit-profile/PreviewContent";

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
  const [userData, setUserData] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    bio: "",
    job_title: "",
    company: "",
    school: "",
    location: "",
    gender: "",
    email: "",
    phone_number: "",
    dob: "",
  });

  const [interests, setInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

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

  const requestLocationPermissionIfNeeded = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const useMyLocation = async () => {
    try {
      if (Platform.OS === "web") {
        if (!navigator.geolocation) {
          notify("Error", "Geolocation is not supported in this browser");
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setFormData((prev) => ({ ...prev, location: `${lng},${lat}` }));
            notify("Success", "Location detected and filled");
          },
          (error) => notify("Error", error.message),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          notify("Error", "Location permission denied");
          return;
        }
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
        });
        const { latitude: lat, longitude: lng } = location.coords;
        setFormData((prev) => ({ ...prev, location: `${lng},${lat}` }));
        notify("Success", "Location detected and filled");
      }
    } catch (e: any) {
      notify("Error", e?.message || "Failed to get location");
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
      const profile = await getUserProfile();
      setUserData(profile);

      setFormData({
        first_name: profile.first_name || "",
        bio: profile.bio || "",
        job_title: profile.job_title || "",
        company: profile.company || "",
        school: profile.school || "",
        location: profile.location || "",
        gender: profile.gender || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        dob: profile.dob || "",
      });
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

      const updateData: Partial<User> = {
        first_name: formData.first_name,
        bio: formData.bio,
        job_title: formData.job_title,
        dob: formData.dob,
        company: formData.company,
        school: formData.school,
        location: formData.location,
        gender: formData.gender,
        email: formData.email,
        phone_number: formData.phone_number,
      };

      const updatedProfile = await updateUserProfile(updateData);
      setUserData(updatedProfile);

      notify("Success", "Profile updated successfully!");
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
      console.log("Loading photos for user:", userId);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/photo/by-user/${userId}`
      );
      const result = await response.json();

      if (result.success && result.data) {
        const photoItems: PhotoItem[] = result.data.map((photo: any) => {
          const fullUrl = `${process.env.EXPO_PUBLIC_API_URL}${photo.url}`;
          return { id: photo.id, url: fullUrl };
        });
        setPhotos(photoItems);
      }
    } catch (error) {
      console.error("Error loading photos:", error);
    }
  };

  const loadInterests = async () => {
    try {
      const response = await interestService.getAllInterests();
      // console.log("Interests response:", response);
      if (response.success && response.data && Array.isArray(response.data.data)) {
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
      if (response.success && response.data && Array.isArray(response.data.data)) {
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePrivacy = (field: "hideAge" | "hideDistance", value: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  if (error && !userData) {
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
        {userData && (
          <View style={{ marginRight: 12 }}>
            <StatusBadge
              status={userData.user_status || "unknown"}
              verified={userData.is_verified || false}
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
            {userData && (
              <AccountInfoSection
                userId={userData.user_id.toString()}
                createdAt={userData.created_at || ""}
                updatedAt={userData.updated_at || ""}
                lastActiveAt={userData.last_active_at || ""}
                popularityScore={userData.popularity_score || 0}
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
              formData={formData}
              onUpdateField={updateFormField}
            />

            <BioSection
              bio={formData.bio}
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
              formData={formData}
              onUpdateField={updateFormField}
            />

            <LocationSection
              location={formData.location}
              onUseMyLocation={useMyLocation}
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
            formData={formData}
            photos={photos}
            selectedInterests={selectedInterests}
            selectedGoals={selectedGoals}
            userData={userData}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
