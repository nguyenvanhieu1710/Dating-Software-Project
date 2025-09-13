import { View, SafeAreaView, TouchableOpacity, Text, StyleSheet, TextInput, Switch, ScrollView, ActivityIndicator, Alert, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { getUserProfile, updateUserProfile, User } from '../services/userApi';

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
    onChangeText: (text: string) => void;
    placeholder: string;
    multiline?: boolean;
    numberOfLines?: number;
}

const FormInput = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    multiline = false, 
    numberOfLines = 1 
}: FormInputProps) => (
    <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
            style={[styles.input, multiline && styles.multilineInput]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            multiline={multiline}
            numberOfLines={numberOfLines}
            placeholderTextColor="#9B9B9B"
        />
    </View>
);

// Toggle Switch Component
interface ToggleOptionProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({ label, value, onValueChange }) => (
    <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>{label}</Text>
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

// Main Component
export default function EditProfileScreen() {
    const router = useRouter();
    const { userId } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('edit');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        bio: '',
        jobTitle: '',
        company: '',
        school: '',
        location: '',
        gender: '',
        hideAge: false,
        hideDistance: false,
    });
    
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [photos, setPhotos] = useState<string[]>([]);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    
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
            
            // Populate form with user data
            setFormData({
                bio: profile.bio || '',
                jobTitle: profile.job_title || '',
                company: '', // Add company field to User interface if needed
                school: profile.school || '',
                location: profile.location || '',
                gender: profile.gender || '',
                hideAge: false, // Add these fields to User interface if needed
                hideDistance: false,
            });
            
            // Set interests and goals if available in profile
            // These would need to be added to the User interface and backend
            
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
                bio: formData.bio,
                job_title: formData.jobTitle,
                school: formData.school,
                location: formData.location,
                gender: formData.gender,
                // Add other fields as needed
            };
            
            const updatedProfile = await updateUserProfile(updateData);
            setUserData(updatedProfile);
            
            Alert.alert(
                'Success',
                'Profile updated successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );
            
        } catch (err: any) {
            console.error('Error saving profile:', err);
            setError('Failed to save profile. Please try again.');
            Alert.alert('Error', 'Failed to save profile. Please try again.');
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
            
            console.log('Photo API response:', result);
            
            if (result.success && result.data) {
                const photoUrls = result.data.map((photo: any) => {
                    const fullUrl = `${process.env.EXPO_PUBLIC_API_URL}${photo.url}`;
                    console.log('Photo URL:', fullUrl);
                    return fullUrl;
                });
                console.log('All photo URLs:', photoUrls);
                setPhotos(photoUrls);
            } else {
                console.log('No photos found or API error:', result);
            }
        } catch (error) {
            console.error('Error loading photos:', error);
        }
    };

    // Pick image from gallery, camera, or file system
    const pickImage = async () => {
        try {
            // Check if running in web browser
            const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';
            
            if (isWeb) {
                // For web, directly open file picker instead of showing alert
                await openFilePicker();
            } else {
                // Request permission for mobile
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission denied', 'Camera roll permission is required to select photos');
                    return;
                }

                // Show action sheet for mobile
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
            // Check if running in browser environment
            if (typeof window !== 'undefined' && typeof document !== 'undefined') {
                console.log('Opening file picker for web...');
                
                // Create file input element
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.multiple = false;
                
                // Create promise to handle file selection
                return new Promise<void>((resolve, reject) => {
                    input.onchange = async (event: any) => {
                        try {
                            const file = event.target.files?.[0];
                            console.log('File selected:', file);
                            
                            if (file) {
                                // Validate file type
                                if (!file.type.startsWith('image/')) {
                                    Alert.alert('Error', 'Please select an image file');
                                    resolve();
                                    return;
                                }
                                
                                // Validate file size (max 10MB)
                                if (file.size > 10 * 1024 * 1024) {
                                    Alert.alert('Error', 'File size must be less than 10MB');
                                    resolve();
                                    return;
                                }
                                
                                console.log('Uploading file:', file.name, file.size);
                                
                                // Upload file directly
                                await uploadPhotoFromFile(file);
                                resolve();
                            } else {
                                console.log('No file selected');
                                resolve();
                            }
                        } catch (error) {
                            console.error('Error in file selection:', error);
                            Alert.alert('Error', 'Failed to process selected file');
                            reject(error);
                        }
                    };
                    
                    // Handle cancel/close
                    input.oncancel = () => {
                        console.log('File picker cancelled');
                        resolve();
                    };
                    
                    // Trigger file picker
                    console.log('Triggering file picker click...');
                    input.click();
                });
            } else {
                // Fallback to gallery for non-web platforms
                console.log('Not in web environment, using gallery fallback');
                Alert.alert('Info', 'File picker not available. Using gallery instead.');
                await openGallery();
            }
        } catch (error) {
            console.error('Error opening file picker:', error);
            Alert.alert('Error', 'Failed to open file picker. Try using gallery instead.');
        }
    };

    // Upload photo from file (for web platform)
    const uploadPhotoFromFile = async (file: File) => {
        try {
            setIsUploadingPhoto(true);

            const formData = new FormData();
            formData.append('file', file);

            // Upload file
            const uploadResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/upload/single`, {
                method: 'POST',
                body: formData,
            });

            const uploadResult = await uploadResponse.json();

            if (uploadResult.success) {
                // Save photo metadata to database
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
                    // Add to photos array
                    setPhotos(prev => [...prev, `${process.env.EXPO_PUBLIC_API_URL}${uploadResult.file.path}`]);
                    Alert.alert('Success', 'Photo uploaded successfully!');
                } else {
                    Alert.alert('Error', 'Failed to save photo metadata');
                }
            } else {
                Alert.alert('Error', 'Failed to upload photo');
            }
        } catch (error) {
            console.error('Error uploading photo from file:', error);
            Alert.alert('Error', 'Failed to upload photo');
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

            // Upload file
            const uploadResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/upload/single`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const uploadResult = await uploadResponse.json();

            if (uploadResult.success) {
                // Save photo metadata to database
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
                    // Add to photos array
                    setPhotos(prev => [...prev, `${process.env.EXPO_PUBLIC_API_URL}${uploadResult.file.path}`]);
                    Alert.alert('Success', 'Photo uploaded successfully!');
                } else {
                    Alert.alert('Error', 'Failed to save photo metadata');
                }
            } else {
                Alert.alert('Error', 'Failed to upload photo');
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
            Alert.alert('Error', 'Failed to upload photo');
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    // Delete photo
    const deletePhoto = async (photoIndex: number) => {
        try {
            Alert.alert(
                'Delete Photo',
                'Are you sure you want to delete this photo?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                            // Remove from local state
                            const newPhotos = photos.filter((_, index) => index !== photoIndex);
                            setPhotos(newPhotos);
                            
                            // TODO: Call API to delete from server
                            // This would require photo ID which we don't have in current implementation
                        }
                    }
                ]
            );
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
                    <Text style={styles.headerTitle}>Edit Profile</Text>
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
                        {/* Photos Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Photos</Text>
                            <View style={styles.photoGrid}>
                                {photos.map((photo, index) => (
                                    <View key={index} style={styles.photoItem}>
                                        <Image 
                                            source={{ uri: photo }} 
                                            style={styles.photoImage}
                                            onError={(error) => {
                                                console.error('Image load error:', error);
                                                console.log('Failed to load image URL:', photo);
                                                // Test direct URL access
                                                console.log('Try opening this URL directly in browser:', photo);
                                            }}
                                            onLoad={() => {
                                                console.log('Image loaded successfully:', photo);
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
                        
                        {/* Bio */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>About Me</Text>
                            <FormInput
                                label="Bio"
                                value={formData.bio}
                                onChangeText={(text) => setFormData({...formData, bio: text})}
                                placeholder="Tell others about yourself..."
                                multiline
                                numberOfLines={4}
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
                        
                        {/* Personal Info */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Personal Information</Text>
                            <FormInput
                                label="Job Title"
                                value={formData.jobTitle}
                                onChangeText={(text) => setFormData({...formData, jobTitle: text})}
                                placeholder="What do you do?"
                            />
                            <FormInput
                                label="Company"
                                value={formData.company}
                                onChangeText={(text) => setFormData({...formData, company: text})}
                                placeholder="Where do you work?"
                            />
                            <FormInput
                                label="School"
                                value={formData.school}
                                onChangeText={(text) => setFormData({...formData, school: text})}
                                placeholder="Where did you study?"
                            />
                            <FormInput
                                label="Location"
                                value={formData.location}
                                onChangeText={(text) => setFormData({...formData, location: text})}
                                placeholder="Where do you live?"
                            />
                            <FormInput
                                label="Gender"
                                value={formData.gender}
                                onChangeText={(text) => setFormData({...formData, gender: text})}
                                placeholder="Your gender"
                            />
                        </View>
                        
                        {/* Privacy Settings */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Privacy Settings</Text>
                            <ToggleOption
                                label="Hide My Age"
                                value={formData.hideAge}
                                onValueChange={(value) => setFormData({...formData, hideAge: value})}
                            />
                            <ToggleOption
                                label="Hide My Distance"
                                value={formData.hideDistance}
                                onValueChange={(value) => setFormData({...formData, hideDistance: value})}
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
                        
                        {/* Bio Preview */}
                        {formData.bio && (
                            <View style={styles.previewSection}>
                                <Text style={styles.previewSectionTitle}>About Me</Text>
                                <Text style={styles.previewText}>{formData.bio}</Text>
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
                        
                        {/* Personal Info Preview */}
                        {(formData.jobTitle || formData.company || formData.school || formData.location || formData.gender) && (
                            <View style={styles.previewSection}>
                                <Text style={styles.previewSectionTitle}>Personal Information</Text>
                                {formData.jobTitle && (
                                    <Text style={styles.previewText}>Job Title: {formData.jobTitle}</Text>
                                )}
                                {formData.company && (
                                    <Text style={styles.previewText}>Company: {formData.company}</Text>
                                )}
                                {formData.school && (
                                    <Text style={styles.previewText}>School: {formData.school}</Text>
                                )}
                                {formData.location && (
                                    <Text style={styles.previewText}>Location: {formData.location}</Text>
                                )}
                                {formData.gender && (
                                    <Text style={styles.previewText}>Gender: {formData.gender}</Text>
                                )}
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
                                Review your profile information before saving. Any changes will be visible to other users.
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
        marginLeft: 8,
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
    media: {
        ...baseSection,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E8E8E8',
        borderStyle: 'dashed',
        borderRadius: 20,
        backgroundColor: '#FAFAFA',
    },
    mediaText: {
        fontSize: 16,
        color: '#9B9B9B',
        marginBottom: 8,
        textAlign: 'center',
    },
    addButton: {
        width: 80,
        height: 80,
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    addButtonText: {
        color: '#9B9B9B',
        fontSize: 14,
        marginTop: 5,
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
    multilineInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    toggleLabel: {
        fontSize: 16,
        color: '#333',
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
    },
    previewInterestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    previewInterest: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
        marginRight: 8,
        marginBottom: 8,
        padding: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
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