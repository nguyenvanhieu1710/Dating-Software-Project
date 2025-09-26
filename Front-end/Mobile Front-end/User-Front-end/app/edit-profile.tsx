import { View, SafeAreaView, TouchableOpacity, Text, StyleSheet, TextInput, Switch, ScrollView, ActivityIndicator, Alert, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import { getUserProfile, updateUserProfile, User } from '../services/userApi';

// Photo type for local state (tracks backend id for delete)
interface PhotoItem {
    id: number;
    url: string;
}

// Define base section style first
const baseSection = {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
};

// Form Input Component
interface FormInputProps {
    label: string;
    value: string;
    onChangeText?: (text: string) => void;
    placeholder: string;
    editable?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
    maxLength?: number;
}

const FormInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    numberOfLines = 1,
    editable = true,
    keyboardType = 'default',
    maxLength
}: FormInputProps) => (
    <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
            style={[
                styles.input, 
                multiline && styles.multilineInput,
                !editable && styles.inputDisabled
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            multiline={multiline}
            numberOfLines={numberOfLines}
            editable={editable}
            keyboardType={keyboardType}
            maxLength={maxLength}
            placeholderTextColor="#9B9B9B"
        />
        {!editable && (
            <Text style={styles.inputHint}>This field cannot be edited</Text>
        )}
    </View>
);

// Toggle Switch Component
interface ToggleOptionProps {
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    description?: string;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({ label, value, onValueChange, description }) => (
    <View style={styles.toggleContainer}>
        <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>{label}</Text>
            {description && <Text style={styles.toggleDescription}>{description}</Text>}
        </View>
        <Switch
            trackColor={{ false: '#E8E8E8', true: '#8B5CF6' }}
            thumbColor="white"
            onValueChange={onValueChange}
            value={value}
        />
    </View>
);

// Selectable Item Component
interface SelectableItemProps {
    label: string;
    selected: boolean;
    onPress: () => void;
}

const SelectableItem: React.FC<SelectableItemProps> = ({ label, selected, onPress }) => (
    <TouchableOpacity
        style={[styles.selectableItem, selected && styles.selectedItem]}
        onPress={onPress}
    >
        <Text style={[styles.selectableText, selected && styles.selectedText]}>{label}</Text>
    </TouchableOpacity>
);

// Status Badge Component
interface StatusBadgeProps {
    status: string;
    verified: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, verified }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#10B981';
            case 'verified': return '#8B5CF6';
            case 'unverified': return '#F59E0B';
            case 'suspended': return '#EF4444';
            default: return '#6B7280';
        }
    };

    return (
        <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
                <Text style={styles.statusText}>{status.toUpperCase()}</Text>
            </View>
            {verified && (
                <View style={[styles.statusBadge, { backgroundColor: '#10B981' }]}>
                    <Ionicons name="checkmark-circle" size={12} color="white" />
                    <Text style={styles.statusText}>VERIFIED</Text>
                </View>
            )}
        </View>
    );
};

// Main Component
export default function EditProfileScreen() {
    const router = useRouter();
    const { userId } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('edit');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<User | null>(null);
    
    // Enhanced form data to match API structure
    const [formData, setFormData] = useState({
        first_name: '',
        bio: '',
        job_title: '',
        company: '',
        school: '',
        location: '',
        gender: '',
        email: '',
        phone_number: '',
        dob: '',
        hideAge: false,
        hideDistance: false,
    });

    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    // Web-safe notify/confirm helpers
    const isWebPlatform = Platform.OS === 'web';
    const notify = (title: string, message?: string) => {
        if (isWebPlatform && typeof window !== 'undefined') {
            window.alert(message ? `${title}\n\n${message}` : title);
        } else {
            Alert.alert(title, message);
        }
    };
    const confirmAsync = (title: string, message: string): Promise<boolean> => {
        if (isWebPlatform && typeof window !== 'undefined') {
            return Promise.resolve(window.confirm(`${title}\n\n${message}`));
        }
        return new Promise((resolve) => {
            Alert.alert(title, message, [
                { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
                { text: 'OK', style: 'destructive', onPress: () => resolve(true) },
            ]);
        });
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch {
            return dateString;
        }
    };

    // Calculate age from DOB
    const calculateAge = (dob: string) => {
        if (!dob) return '';
        try {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age.toString();
        } catch {
            return '';
        }
    };

    const requestLocationPermissionIfNeeded = async (): Promise<boolean> => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    const useMyLocation = async () => {
        try {
            if (Platform.OS === 'web') {
                if (!navigator.geolocation) {
                    notify('Error', 'Geolocation is not supported in this browser');
                    return;
                }
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const lat = pos.coords.latitude;
                        const lng = pos.coords.longitude;
                        setFormData((prev) => ({ ...prev, location: `${lng},${lat}` }));
                        notify('Success', 'Location detected and filled');
                    },
                    (error) => notify('Error', error.message),
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            } else {
                const hasPerm = await requestLocationPermissionIfNeeded();
                if (!hasPerm) {
                    notify('Error', 'Location permission denied');
                    return;
                }
                Geolocation.getCurrentPosition(
                    (pos) => {
                        const lat = pos.coords.latitude;
                        const lng = pos.coords.longitude;
                        setFormData((prev) => ({ ...prev, location: `${lng},${lat}` }));
                        notify('Success', 'Location detected and filled');
                    },
                    (error) => notify('Error', error.message),
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            }
        } catch (e: any) {
            notify('Error', e?.message || 'Failed to get location');
        }
    };

    // Load user profile data on component mount
    useEffect(() => {
        loadUserProfile();
        loadUserPhotos();
    }, [userId]);

    const loadUserProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const profile = await getUserProfile();
            setUserData(profile);

            // Populate form with comprehensive user data
            setFormData({
                first_name: profile.first_name || '',
                bio: profile.bio || '',
                job_title: profile.job_title || '',
                company: '', // Add to User interface if needed
                school: profile.school || '',
                location: profile.location || '',
                gender: profile.gender || '',
                email: profile.email || '',
                phone_number: profile.phone_number || '',
                dob: profile.dob || '',
                hideAge: false, // Add to User interface if needed
                hideDistance: false,
            });

        } catch (err: any) {
            console.error('Error loading profile:', err);
            setError('Failed to load profile data. Please try again.');
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
                school: formData.school,
                location: formData.location,
                gender: formData.gender,
                email: formData.email,
                phone_number: formData.phone_number,
            };

            const updatedProfile = await updateUserProfile(updateData);
            setUserData(updatedProfile);

            notify('Success', 'Profile updated successfully!');
            router.back();

        } catch (err: any) {
            console.error('Error saving profile:', err);
            setError('Failed to save profile. Please try again.');
            notify('Error', 'Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Load user photos
    const loadUserPhotos = async () => {
        try {
            console.log('Loading photos for user:', userId);
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/photo/by-user/${userId}`);
            const result = await response.json();

            if (result.success && result.data) {
                const photoItems: PhotoItem[] = result.data.map((photo: any) => {
                    const fullUrl = `${process.env.EXPO_PUBLIC_API_URL}${photo.url}`;
                    return { id: photo.id, url: fullUrl };
                });
                setPhotos(photoItems);
            }
        } catch (error) {
            console.error('Error loading photos:', error);
        }
    };

    // Pick image from gallery, camera, or file system
    const pickImage = async () => {
        try {
            const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

            if (isWeb) {
                await openFilePicker();
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission denied', 'Camera roll permission is required to select photos');
                    return;
                }

                Alert.alert(
                    'Select Photo',
                    'Choose from where you want to select a photo',
                    [
                        { text: 'Camera', onPress: () => openCamera() },
                        { text: 'Gallery', onPress: () => openGallery() },
                        { text: 'Cancel', style: 'cancel' }
                    ]
                );
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const openCamera = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Camera permission is required');
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
            console.error('Error opening camera:', error);
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
            console.error('Error opening gallery:', error);
        }
    };

    // File picker for web/desktop platforms
    const openFilePicker = async () => {
        try {
            if (typeof window !== 'undefined' && typeof document !== 'undefined') {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.multiple = false;

                return new Promise<void>((resolve, reject) => {
                    input.onchange = async (event: any) => {
                        try {
                            const file = event.target.files?.[0];
                            if (file) {
                                if (!file.type.startsWith('image/')) {
                                    notify('Error', 'Please select an image file');
                                    resolve();
                                    return;
                                }

                                if (file.size > 10 * 1024 * 1024) {
                                    notify('Error', 'File size must be less than 10MB');
                                    resolve();
                                    return;
                                }

                                await uploadPhotoFromFile(file);
                                resolve();
                            } else {
                                resolve();
                            }
                        } catch (error) {
                            console.error('Error in file selection:', error);
                            notify('Error', 'Failed to process selected file');
                            reject(error);
                        }
                    };

                    input.oncancel = () => resolve();
                    input.click();
                });
            } else {
                notify('Info', 'File picker not available. Using gallery instead.');
                await openGallery();
            }
        } catch (error) {
            console.error('Error opening file picker:', error);
            notify('Error', 'Failed to open file picker. Try using gallery instead.');
        }
    };

    // Upload photo from file (for web platform)
    const uploadPhotoFromFile = async (file: File) => {
        try {
            setIsUploadingPhoto(true);

            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/upload/single`, {
                method: 'POST',
                body: formData,
            });

            const uploadResult = await uploadResponse.json();

            if (uploadResult.success) {
                const photoResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/photo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        url: uploadResult.file.path,
                        order_index: photos.length
                    }),
                });

                const photoResult = await photoResponse.json();

                if (photoResult.success) {
                    const created = photoResult.data;
                    const fullUrl = `${process.env.EXPO_PUBLIC_API_URL}${uploadResult.file.path}`;
                    setPhotos(prev => [...prev, { id: created.id, url: fullUrl }]);
                    notify('Success', 'Photo uploaded successfully!');
                } else {
                    notify('Error', 'Failed to save photo metadata');
                }
            } else {
                notify('Error', 'Failed to upload photo');
            }
        } catch (error) {
            console.error('Error uploading photo from file:', error);
            notify('Error', 'Failed to upload photo');
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    // Upload photo to server
    const uploadPhoto = async (imageUri: string) => {
        try {
            setIsUploadingPhoto(true);

            const formData = new FormData();
            formData.append('file', {
                uri: imageUri,
                type: 'image/jpeg',
                name: `photo_${Date.now()}.jpg`,
            } as any);

            const uploadResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/upload/single`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const uploadResult = await uploadResponse.json();

            if (uploadResult.success) {
                const photoResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/photo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        url: uploadResult.file.path,
                        order_index: photos.length
                    }),
                });

                const photoResult = await photoResponse.json();

                if (photoResult.success) {
                    const created = photoResult.data;
                    const fullUrl = `${process.env.EXPO_PUBLIC_API_URL}${uploadResult.file.path}`;
                    setPhotos(prev => [...prev, { id: created.id, url: fullUrl }]);
                    notify('Success', 'Photo uploaded successfully!');
                } else {
                    notify('Error', 'Failed to save photo metadata');
                }
            } else {
                notify('Error', 'Failed to upload photo');
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
            notify('Error', 'Failed to upload photo');
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    // Delete photo
    const deletePhoto = async (photoIndex: number) => {
        try {
            const photo = photos[photoIndex];
            if (!photo) return;

            const confirmed = await confirmAsync('Delete Photo', 'Are you sure you want to delete this photo?');
            if (!confirmed) return;
            
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/photo/${photo.id}/by-user/${userId}`, {
                    method: 'DELETE',
                });
                const result = await response.json();
                if (result.success) {
                    const newPhotos = photos.filter((_, index) => index !== photoIndex);
                    setPhotos(newPhotos);
                    notify('Deleted', 'Photo deleted successfully');
                } else {
                    notify('Error', result.message || 'Failed to delete photo');
                }
            } catch (err) {
                console.error('Error deleting photo:', err);
                notify('Error', 'Failed to delete photo');
            }
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    };

    const interests = ['Travel', 'Music', 'Sports', 'Reading', 'Cooking', 'Photography', 'Movies', 'Gaming'];
    const goals = ['Long-term partner', 'Short-term fun', 'New friends', 'Still figuring it out'];

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    const toggleGoal = (goal: string) => {
        setSelectedGoals(prev =>
            prev.includes(goal)
                ? prev.filter(g => g !== goal)
                : [...prev, goal]
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#8B5CF6" />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error && !userData) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={48} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadUserProfile}>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000000" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>Edit Profile</Text>
                        {userData && (
                            <StatusBadge 
                                status={userData.user_status || 'unknown'} 
                                verified={userData.is_verified || false} 
                            />
                        )}
                    </View>
                </View>
            </View>

            {/* Tabs Edit And Preview */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'edit' && styles.tabActive]}
                    onPress={() => setActiveTab('edit')}
                >
                    <Text style={[styles.tabText, activeTab === 'edit' && styles.tabTextActive]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'preview' && styles.tabActive]}
                    onPress={() => setActiveTab('preview')}
                >
                    <Text style={[styles.tabText, activeTab === 'preview' && styles.tabTextActive]}>Preview</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {activeTab === 'edit' ? (
                    // Edit Form
                    <>
                        {/* Account Status Section */}
                        {userData && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Account Information</Text>
                                <View style={styles.accountInfoGrid}>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>User ID</Text>
                                        <Text style={styles.infoValue}>{userData.user_id}</Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Member Since</Text>
                                        <Text style={styles.infoValue}>
                                            {formatDate(userData.created_at || '')}
                                        </Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Last Update</Text>
                                        <Text style={styles.infoValue}>
                                            {formatDate(userData.updated_at || '')}
                                        </Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Last Active</Text>
                                        <Text style={styles.infoValue}>
                                            {formatDate(userData.last_active_at || '')}
                                        </Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Popularity Score</Text>
                                        <Text style={styles.infoValue}>{userData.popularity_score || 0}</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Photos Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Photos ({photos.length}/5)</Text>
                            <View style={styles.photoGrid}>
                                {photos.map((photo, index) => (
                                    <View key={index} style={styles.photoItem}>
                                        <Image
                                            source={{ uri: photo.url }}
                                            style={styles.photoImage}
                                            onError={(error) => {
                                                console.error('Image load error:', error);
                                            }}
                                        />
                                        <TouchableOpacity
                                            style={styles.deletePhotoButton}
                                            onPress={() => deletePhoto(index)}
                                        >
                                            <Ionicons name="close-circle" size={24} color="#EF4444" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                {photos.length < 5 && (
                                    <TouchableOpacity
                                        style={styles.addPhotoButton}
                                        onPress={pickImage}
                                        disabled={isUploadingPhoto}
                                    >
                                        {isUploadingPhoto ? (
                                            <ActivityIndicator size="small" color="#8B5CF6" />
                                        ) : (
                                            <>
                                                <Ionicons name="add" size={32} color="#8B5CF6" />
                                                <Text style={styles.addPhotoText}>Add Photo</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                )}
                            </View>
                            {photos.length === 0 && (
                                <Text style={styles.photoHint}>Add photos to get more matches</Text>
                            )}
                        </View>

                        {/* Basic Information */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Basic Information</Text>
                            <FormInput
                                label="First Name"
                                value={formData.first_name}
                                onChangeText={(text) => setFormData({ ...formData, first_name: text })}
                                placeholder="Enter your first name"
                                maxLength={50}
                            />
                            <FormInput
                                label="Email"
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                maxLength={100}
                            />
                            <FormInput
                                label="Phone Number"
                                value={formData.phone_number}
                                onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
                                placeholder="Enter your phone number"
                                keyboardType="phone-pad"
                                maxLength={20}
                            />
                            <FormInput
                                label="Date of Birth"
                                value={formData.dob ? formatDate(formData.dob) : ''}
                                placeholder="Date of birth"
                                editable={false}
                            />
                            {formData.dob && (
                                <View style={styles.ageContainer}>
                                    <Text style={styles.ageText}>
                                        Age: {calculateAge(formData.dob)} years old
                                    </Text>
                                </View>
                            )}
                            <FormInput
                                label="Gender"
                                value={formData.gender}
                                onChangeText={(text) => setFormData({ ...formData, gender: text })}
                                placeholder="Your gender"
                                maxLength={20}
                            />
                        </View>

                        {/* Bio */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>About Me</Text>
                            <FormInput
                                label="Bio"
                                value={formData.bio}
                                onChangeText={(text) => setFormData({ ...formData, bio: text })}
                                placeholder="Tell others about yourself..."
                                multiline
                                numberOfLines={4}
                                maxLength={500}
                            />
                        </View>

                        {/* Interests */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Interests</Text>
                            <View style={styles.interestsContainer}>
                                {interests.map((interest) => (
                                    <SelectableItem
                                        key={interest}
                                        label={interest}
                                        selected={selectedInterests.includes(interest)}
                                        onPress={() => toggleInterest(interest)}
                                    />
                                ))}
                            </View>
                        </View>

                        {/* Relationship Goals */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Relationship Goals</Text>
                            <View style={styles.interestsContainer}>
                                {goals.map((goal) => (
                                    <SelectableItem
                                        key={goal}
                                        label={goal}
                                        selected={selectedGoals.includes(goal)}
                                        onPress={() => toggleGoal(goal)}
                                    />
                                ))}
                            </View>
                        </View>

                        {/* Professional Information */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Professional Information</Text>
                            <FormInput
                                label="Job Title"
                                value={formData.job_title}
                                onChangeText={(text) => setFormData({ ...formData, job_title: text })}
                                placeholder="What do you do?"
                                maxLength={100}
                            />
                            <FormInput
                                label="Company"
                                value={formData.company}
                                onChangeText={(text) => setFormData({ ...formData, company: text })}
                                placeholder="Where do you work?"
                                maxLength={100}
                            />
                            <FormInput
                                label="School"
                                value={formData.school}
                                onChangeText={(text) => setFormData({ ...formData, school: text })}
                                placeholder="Where did you study?"
                                maxLength={100}
                            />
                        </View>

                        {/* Location Information */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Location Information</Text>
                            <FormInput
                                label="Current Location"
                                value={formData.location}
                                placeholder="Your current location coordinates"
                                editable={false}
                            />
                            <TouchableOpacity
                                style={styles.locationButton}
                                onPress={useMyLocation}
                            >
                                <Ionicons name="location" size={20} color="#8B5CF6" />
                                <Text style={styles.locationButtonText}>Use My Current Location</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Privacy Settings */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Privacy Settings</Text>
                            <ToggleOption
                                label="Hide My Age"
                                value={formData.hideAge}
                                onValueChange={(value) => setFormData({ ...formData, hideAge: value })}
                                description="Other users won't see your age"
                            />
                            <ToggleOption
                                label="Hide My Distance"
                                value={formData.hideDistance}
                                onValueChange={(value) => setFormData({ ...formData, hideDistance: value })}
                                description="Other users won't see distance from you"
                            />
                        </View>

                        {/* Save Button */}
                        <TouchableOpacity
                            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                            onPress={handleSaveProfile}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            )}
                        </TouchableOpacity>
                    </>
                ) : (
                    // Preview Content
                    <View style={styles.previewContainer}>
                        <Text style={styles.previewTitle}>Profile Preview</Text>

                        {/* Basic Info Preview */}
                        <View style={styles.previewSection}>
                            <Text style={styles.previewSectionTitle}>Basic Information</Text>
                            <Text style={styles.previewText}>Name: {formData.first_name || 'Not specified'}</Text>
                            {formData.dob && (
                                <Text style={styles.previewText}>
                                    Age: {calculateAge(formData.dob)} years old
                                </Text>
                            )}
                            <Text style={styles.previewText}>Gender: {formData.gender || 'Not specified'}</Text>
                            <Text style={styles.previewText}>Email: {formData.email || 'Not specified'}</Text>
                            <Text style={styles.previewText}>Phone: {formData.phone_number || 'Not specified'}</Text>
                        </View>

                        {/* Photos Preview */}
                        {photos.length > 0 && (
                            <View style={styles.previewSection}>
                                <Text style={styles.previewSectionTitle}>Photos ({photos.length})</Text>
                                <View style={styles.previewPhotosContainer}>
                                    {photos.slice(0, 3).map((photo, index) => (
                                        <Image
                                            key={index}
                                            source={{ uri: photo.url }}
                                            style={styles.previewPhoto}
                                        />
                                    ))}
                                    {photos.length > 3 && (
                                        <View style={styles.previewPhotoMore}>
                                            <Text style={styles.previewPhotoMoreText}>
                                                +{photos.length - 3} more
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Bio Preview */}
                        {formData.bio && (
                            <View style={styles.previewSection}>
                                <Text style={styles.previewSectionTitle}>About Me</Text>
                                <Text style={styles.previewText}>{formData.bio}</Text>
                            </View>
                        )}

                        {/* Professional Info Preview */}
                        {(formData.job_title || formData.company || formData.school) && (
                            <View style={styles.previewSection}>
                                <Text style={styles.previewSectionTitle}>Professional Information</Text>
                                {formData.job_title && (
                                    <Text style={styles.previewText}>Job: {formData.job_title}</Text>
                                )}
                                {formData.company && (
                                    <Text style={styles.previewText}>Company: {formData.company}</Text>
                                )}
                                {formData.school && (
                                    <Text style={styles.previewText}>School: {formData.school}</Text>
                                )}
                            </View>
                        )}

                        {/* Interests Preview */}
                        {selectedInterests.length > 0 && (
                            <View style={styles.previewSection}>
                                <Text style={styles.previewSectionTitle}>Interests</Text>
                                <View style={styles.previewInterestsContainer}>
                                    {selectedInterests.map((interest) => (
                                        <Text key={interest} style={styles.previewInterest}>{interest}</Text>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Relationship Goals Preview */}
                        {selectedGoals.length > 0 && (
                            <View style={styles.previewSection}>
                                <Text style={styles.previewSectionTitle}>Relationship Goals</Text>
                                <View style={styles.previewInterestsContainer}>
                                    {selectedGoals.map((goal) => (
                                        <Text key={goal} style={styles.previewInterest}>{goal}</Text>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Account Status Preview */}
                        {userData && (
                            <View style={styles.previewSection}>
                                <Text style={styles.previewSectionTitle}>Account Status</Text>
                                <Text style={styles.previewText}>Status: {userData.user_status || 'Unknown'}</Text>
                                <Text style={styles.previewText}>
                                    Verified: {userData.is_verified ? 'Yes' : 'No'}
                                </Text>
                                <Text style={styles.previewText}>
                                    Popularity Score: {userData.popularity_score || 0}
                                </Text>
                                <Text style={styles.previewText}>
                                    Member Since: {formatDate(userData.created_at || '')}
                                </Text>
                            </View>
                        )}

                        {/* Privacy Settings Preview */}
                        {(formData.hideAge || formData.hideDistance) && (
                            <View style={styles.previewSection}>
                                <Text style={styles.previewSectionTitle}>Privacy Settings</Text>
                                {formData.hideAge && (
                                    <Text style={styles.previewText}>Hide My Age: Yes</Text>
                                )}
                                {formData.hideDistance && (
                                    <Text style={styles.previewText}>Hide My Distance: Yes</Text>
                                )}
                            </View>
                        )}

                        <View style={styles.previewFooter}>
                            <Text style={styles.previewFooterText}>
                                Review your profile information before saving. Changes will be visible to other users after saving.
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    headerTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 8,
    },
    backButton: {
        padding: 8,
        marginRight: 16,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    statusText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: '#8B5CF6',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#9B9B9B',
    },
    tabTextActive: {
        color: '#000000',
    },
    content: {
        flex: 1,
        padding: 12,
    },
    section: baseSection,
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 12,
    },
    accountInfoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    infoItem: {
        width: '48%',
        marginBottom: 12,
        padding: 12,
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
    },
    infoLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '600',
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#FAFAFA',
    },
    inputDisabled: {
        backgroundColor: '#F3F4F6',
        color: '#6B7280',
    },
    inputHint: {
        fontSize: 12,
        color: '#9CA3AF',
        fontStyle: 'italic',
        marginTop: 4,
    },
    multilineInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    ageContainer: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#EEF2FF',
        borderRadius: 6,
    },
    ageText: {
        fontSize: 14,
        color: '#4F46E5',
        fontWeight: '500',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    toggleInfo: {
        flex: 1,
        marginRight: 12,
    },
    toggleLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 2,
    },
    toggleDescription: {
        fontSize: 12,
        color: '#6B7280',
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    selectableItem: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    selectedItem: {
        backgroundColor: '#FFEBEE',
        borderColor: '#8B5CF6',
    },
    selectableText: {
        color: '#666',
    },
    selectedText: {
        color: '#8B5CF6',
        fontWeight: '600',
    },
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginTop: 10,
    },
    photoItem: {
        width: '30%',
        aspectRatio: 1,
        marginRight: '3%',
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    photoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        backgroundColor: '#F0F0F0',
    },
    deletePhotoButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
    },
    addPhotoButton: {
        width: '30%',
        aspectRatio: 1,
        marginRight: '3%',
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#8B5CF6',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F4FF',
    },
    addPhotoText: {
        color: '#8B5CF6',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    photoHint: {
        fontSize: 14,
        color: '#9B9B9B',
        textAlign: 'center',
        marginTop: 10,
        fontStyle: 'italic',
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#8B5CF6',
        borderStyle: 'dashed',
        backgroundColor: '#F8F4FF',
        marginTop: 8,
    },
    locationButtonText: {
        color: '#8B5CF6',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
    },
    saveButton: {
        backgroundColor: '#8B5CF6',
        borderRadius: 25,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 32,
    },
    saveButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    previewContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    previewTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
        color: '#333',
    },
    previewSection: {
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    previewSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#666',
    },
    previewText: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
        marginBottom: 4,
    },
    previewPhotosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    previewPhoto: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#F0F0F0',
    },
    previewPhotoMore: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewPhotoMoreText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    previewInterestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    previewInterest: {
        fontSize: 13,
        color: '#333',
        marginRight: 8,
        marginBottom: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#F0F0F0',
        borderRadius: 16,
    },
    previewFooter: {
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    previewFooterText: {
        fontSize: 13,
        color: '#888',
        textAlign: 'center',
        lineHeight: 18,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#EF4444',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});