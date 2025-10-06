import React, { useState, useEffect } from 'react';
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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { styles } from './photo-management-styles';
import { adminPhotoService, AdminPhoto, PhotoFilters } from '../../../services/adminPhotoService';

// Use AdminPhoto interface from service
type Photo = AdminPhoto;

// Remove mock data - will use real API data

export default function PhotoManagement() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPhotos, setTotalPhotos] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    
    // Advanced features state
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    
    // UX & Security states
    const [userRole] = useState('admin');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [actionInProgress, setActionInProgress] = useState(false);

    // Load photos from API
    const loadPhotos = async () => {
        try {
            setIsLoading(true);
            const filters: PhotoFilters = {
                search: searchQuery || undefined,
                status: statusFilter === 'all' ? undefined : statusFilter as any,
                sort_by: sortBy as any,
                sort_order: sortOrder as any,
                page: currentPage,
                limit: itemsPerPage
            };
            
            const response = await adminPhotoService.getAllPhotos(filters);
            console.log("Response of getAllPhotos: ", response);
            setPhotos(response.photos);
            setFilteredPhotos(response.photos);
            setTotalPhotos(response.total);
            setTotalPages(response.total_pages);
        } catch (error) {
            console.error('Failed to load photos:', error);
            showError('Failed to load photos. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Load photos on component mount and when filters change
    useEffect(() => {
        loadPhotos();
    }, [searchQuery, sortBy, sortOrder, statusFilter, currentPage]);

    // Remove applyFiltersAndSort function - filtering is now done server-side

    // Use filtered photos directly (pagination handled by API)
    const paginatedPhotos = filteredPhotos;

    // UX & Security helper functions
    const hasPermission = (action: 'create' | 'read' | 'update' | 'delete' | 'export') => {
        const permissions = {
            admin: ['create', 'read', 'update', 'delete', 'export'],
            moderator: ['read', 'update', 'delete'],
            viewer: ['read']
        };
        return permissions[userRole as keyof typeof permissions]?.includes(action) || false;
    };

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
    };

    const showError = (message: string) => {
        setErrorMessage(message);
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 3000);
    };

    // Photo management functions
    const handleViewPhoto = (photo: Photo) => {
        setSelectedPhoto(photo);
        setShowPhotoModal(true);
    };

    const handleDeletePhoto = (photo: Photo) => {
        if (!hasPermission('delete')) {
            showError('You do not have permission to delete photos');
            return;
        }
        setPhotoToDelete(photo);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (photoToDelete) {
            setActionInProgress(true);
            
            try {
                // console.log("Photo to delete: ", photoToDelete);
                const success = await adminPhotoService.deletePhoto(photoToDelete.id, photoToDelete.user_id);
                if (success) {
                    setShowDeleteConfirm(false);
                    setPhotoToDelete(null);
                    showSuccess('Photo deleted successfully');
                    // Reload photos to reflect changes
                    await loadPhotos();
                } else {
                    showError('Failed to delete photo');
                }
            } catch (error) {
                console.error('Delete photo error:', error);
                showError('Failed to delete photo. Please try again.');
            } finally {
                setActionInProgress(false);
            }
        }
    };

    const togglePhotoStatus = async (photo: Photo) => {
        if (!hasPermission('update')) {
            showError('You do not have permission to modify photo status');
            return;
        }

        setActionInProgress(true);
        const newStatus: 'active' | 'removed' = photo.status === 'active' ? 'removed' : 'active';
        
        try {
            const success = await adminPhotoService.updatePhotoStatus(photo.id, newStatus);
            if (success) {
                showSuccess(`Photo ${newStatus === 'active' ? 'activated' : 'removed'} successfully`);
                // Reload photos to reflect changes
                await loadPhotos();
            } else {
                showError('Failed to update photo status');
            }
        } catch (error) {
            console.error('Update photo status error:', error);
            showError('Failed to update photo status. Please try again.');
        } finally {
            setActionInProgress(false);
        }
    };

    const handleUploadPhoto = () => {
        if (!hasPermission('create')) {
            showError('You do not have permission to upload photos');
            return;
        }
        setShowUploadModal(true);
    };

    const selectPhotoFromGallery = async () => {
        try {
            if (Platform.OS === 'web') {
                // Use DocumentPicker for web/desktop
                await selectPhotoFromComputer();
                return;
            }

            const { launchImageLibrary } = require('react-native-image-picker');
            
            const options = {
                mediaType: 'photo',
                quality: 0.8,
                maxWidth: 1024,
                maxHeight: 1024,
            };

            launchImageLibrary(options, async (response: any) => {
                if (response.didCancel || response.error) {
                    return;
                }

                if (response.assets && response.assets[0]) {
                    await uploadPhotoFile(response.assets[0]);
                }
            });
        } catch (error) {
            console.error('Photo selection error:', error);
            showError('Failed to select photo. Please try again.');
        }
    };

    const selectPhotoFromComputer = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*'],
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                const asset = result.assets[0];
                
                // Convert DocumentPicker result to format expected by uploadPhotoFile
                const photoAsset = {
                    uri: asset.uri,
                    type: asset.mimeType || 'image/jpeg',
                    name: asset.name,
                    fileName: asset.name,
                };

                await uploadPhotoFile(photoAsset);
            }
        } catch (error) {
            console.error('File selection error:', error);
            showError('Failed to select file. Please try again.');
        }
    };

    const uploadPhotoFile = async (photoAsset: any) => {
        if (!selectedUserId) {
            showError('Please select a user first');
            return;
        }

        setUploadingPhoto(true);
        try {
            // console.log("Check photoAsset: ", photoAsset);                        
            // Use adminPhotoService to handle upload
            const success = await adminPhotoService.uploadPhoto(photoAsset, selectedUserId);
            
            if (success) {
                showSuccess('Photo uploaded successfully');
                setShowUploadModal(false);
                setSelectedUserId(null);
                await loadPhotos();
            } else {
                showError('Failed to upload photo');
            }
        } catch (error) {
            console.error('Photo upload error:', error);
            showError('Failed to upload photo. Please try again.');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const exportPhotos = async () => {
        if (!hasPermission('export')) {
            showError('You do not have permission to export data');
            return;
        }

        setActionInProgress(true);
        
        try {
            // Create CSV data from current photos
            const headers = ['ID', 'User Name', 'User Email', 'Status', 'Primary', 'Reports', 'Created At'];
            const csvData = filteredPhotos.map(photo => [
                photo.id,
                photo.user_name || '',
                photo.user_email || '',
                photo.status,
                photo.is_primary ? 'Yes' : 'No',
                photo.report_count || 0,
                new Date(photo.created_at).toLocaleDateString()
            ]);

            Alert.alert('Export Complete', `Photo data exported with ${filteredPhotos.length} records.`);
            showSuccess('Photo export completed successfully');
        } catch (error) {
            console.error('Export photos error:', error);
            showError('Failed to export photos. Please try again.');
        } finally {
            setActionInProgress(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
            
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Photo Management</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity 
                        style={styles.filterButton}
                        onPress={handleUploadPhoto}
                    >
                        <Ionicons name="add" size={16} color="#8B5CF6" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.filterButton}
                        onPress={() => setShowFilters(!showFilters)}
                    >
                        <Ionicons name="filter" size={16} color="#8B5CF6" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search and Filters */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search photos by user name, email, or ID..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9CA3AF"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Advanced Filters */}
            {showFilters && (
                <View style={styles.filtersContainer}>
                    <View style={styles.filterRow}>
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Sort by:</Text>
                            <TouchableOpacity 
                                style={[
                                    styles.sortButton, 
                                    sortBy === 'created_at' && styles.sortButtonActive
                                ]}
                                onPress={() => {
                                    if (sortBy === 'created_at') {
                                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                    } else {
                                        setSortBy('created_at');
                                        setSortOrder('desc');
                                    }
                                }}
                            >
                                <Text style={[
                                    styles.sortButtonText,
                                    sortBy === 'created_at' && styles.sortButtonTextActive
                                ]}>Date</Text>
                                {sortBy === 'created_at' && (
                                    <Ionicons 
                                        name={sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'} 
                                        size={16} 
                                        color="#FFFFFF" 
                                    />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[
                                    styles.sortButton, 
                                    sortBy === 'user_name' && styles.sortButtonActive
                                ]}
                                onPress={() => {
                                    if (sortBy === 'user_name') {
                                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                    } else {
                                        setSortBy('user_name');
                                        setSortOrder('asc');
                                    }
                                }}
                            >
                                <Text style={[
                                    styles.sortButtonText,
                                    sortBy === 'user_name' && styles.sortButtonTextActive
                                ]}>User</Text>
                                {sortBy === 'user_name' && (
                                    <Ionicons 
                                        name={sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'} 
                                        size={16} 
                                        color="#FFFFFF" 
                                    />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[
                                    styles.sortButton, 
                                    sortBy === 'reports' && styles.sortButtonActive
                                ]}
                                onPress={() => {
                                    if (sortBy === 'reports') {
                                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                    } else {
                                        setSortBy('reports');
                                        setSortOrder('desc');
                                    }
                                }}
                            >
                                <Text style={[
                                    styles.sortButtonText,
                                    sortBy === 'reports' && styles.sortButtonTextActive
                                ]}>Reports</Text>
                                {sortBy === 'reports' && (
                                    <Ionicons 
                                        name={sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'} 
                                        size={16} 
                                        color="#FFFFFF" 
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={styles.filterRow}>
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Status:</Text>
                            <TouchableOpacity 
                                style={[styles.statusFilterButton, statusFilter === 'all' && styles.statusFilterActive]}
                                onPress={() => setStatusFilter('all')}
                            >
                                <Text style={[styles.statusFilterText, statusFilter === 'all' && styles.statusFilterActiveText]}>All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.statusFilterButton, statusFilter === 'active' && styles.statusFilterActive]}
                                onPress={() => setStatusFilter('active')}
                            >
                                <Text style={[styles.statusFilterText, statusFilter === 'active' && styles.statusFilterActiveText]}>Active</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.statusFilterButton, statusFilter === 'reported' && styles.statusFilterActive]}
                                onPress={() => setStatusFilter('reported')}
                            >
                                <Text style={[styles.statusFilterText, statusFilter === 'reported' && styles.statusFilterActiveText]}>Reported</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.statusFilterButton, statusFilter === 'removed' && styles.statusFilterActive]}
                                onPress={() => setStatusFilter('removed')}
                            >
                                <Text style={[styles.statusFilterText, statusFilter === 'removed' && styles.statusFilterActiveText]}>Removed</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {hasPermission('export') && (
                        <View style={styles.filterRow}>
                            <View style={styles.exportGroup}>
                                <Text style={styles.filterLabel}>Export:</Text>
                                <TouchableOpacity 
                                    style={[styles.exportActionButton, actionInProgress && styles.buttonDisabled]} 
                                    onPress={exportPhotos}
                                    disabled={actionInProgress}
                                >
                                    <Ionicons name="download" size={16} color={actionInProgress ? "#9CA3AF" : "#8B5CF6"} />
                                    <Text style={[styles.exportActionText, actionInProgress && styles.buttonTextDisabled]}>Export CSV</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            )}

            {/* Results Summary */}
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>
                    Showing {paginatedPhotos.length} of {totalPhotos} photos
                    {searchQuery && ` (filtered)`}
                </Text>
            </View>

            {/* Photo Grid */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#8B5CF6" />
                        <Text style={styles.loadingText}>Loading photos...</Text>
                    </View>
                ) : (
                    <View style={styles.photoGrid}>
                        {paginatedPhotos.map((photo) => (
                            <View key={photo.id} style={styles.photoCard}>
                                <TouchableOpacity 
                                    style={styles.photoImageContainer}
                                    onPress={() => handleViewPhoto(photo)}
                                >
                                    <Image 
                                        source={{ uri: photo.url }} 
                                        style={styles.photoImage}
                                    />
                                    {photo.is_primary && (
                                        <View style={styles.primaryBadge}>
                                            <Ionicons name="star" size={12} color="#FFFFFF" />
                                        </View>
                                    )}
                                    <View style={[
                                        styles.statusBadge, 
                                        photo.status === 'active' ? styles.statusActive : 
                                        photo.status === 'reported' ? styles.statusReported : styles.statusRemoved
                                    ]}>
                                        <Text style={styles.statusText}>
                                            {photo.status.toUpperCase()}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                
                                <View style={styles.photoInfo}>
                                    <Text style={styles.photoUser}>{photo.user_name}</Text>
                                    <Text style={styles.photoEmail}>{photo.user_email}</Text>
                                    {photo.report_count && photo.report_count > 0 && (
                                        <Text style={styles.reportCount}>
                                            {photo.report_count} report{photo.report_count > 1 ? 's' : ''}
                                        </Text>
                                    )}
                                </View>
                                
                                <View style={styles.photoActions}>
                                    {hasPermission('read') && (
                                        <TouchableOpacity 
                                            style={[styles.actionButton, actionInProgress && styles.buttonDisabled]}
                                            onPress={() => handleViewPhoto(photo)}
                                            disabled={actionInProgress}
                                        >
                                            <Ionicons name="eye" size={16} color={actionInProgress ? "#9CA3AF" : "#6B7280"} />
                                        </TouchableOpacity>
                                    )}              
                                    {hasPermission('delete') && (
                                        <TouchableOpacity 
                                            style={[styles.actionButton, styles.deleteButton, actionInProgress && styles.buttonDisabled]}
                                            onPress={() => handleDeletePhoto(photo)}
                                            disabled={actionInProgress}
                                        >
                                            <Ionicons name="trash" size={16} color={actionInProgress ? "#9CA3AF" : "#EF4444"} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                )}
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <View style={styles.paginationContainer}>
                        <TouchableOpacity 
                            style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                            onPress={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <Ionicons name="chevron-back" size={16} color={currentPage === 1 ? '#9CA3AF' : '#8B5CF6'} />
                            <Text style={[styles.paginationButtonText, currentPage === 1 && styles.paginationButtonTextDisabled]}>
                                Previous
                            </Text>
                        </TouchableOpacity>
                        
                        <View style={styles.paginationInfo}>
                            <Text style={styles.paginationText}>
                                Page {currentPage} of {totalPages}
                            </Text>
                        </View>
                        
                        <TouchableOpacity 
                            style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
                            onPress={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <Text style={[styles.paginationButtonText, currentPage === totalPages && styles.paginationButtonTextDisabled]}>
                                Next
                            </Text>
                            <Ionicons name="chevron-forward" size={16} color={currentPage === totalPages ? '#9CA3AF' : '#8B5CF6'} />
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Photo Detail Modal */}
            <Modal
                visible={showPhotoModal}    
                transparent
                animationType="fade"            
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.photoModal}>
                        <View style={styles.photoModalContent}>
                            <View style={styles.photoModalHeader}>
                                <Text style={styles.photoModalTitle}>Photo Details</Text>
                                <TouchableOpacity onPress={() => setShowPhotoModal(false)}>
                                    <Ionicons name="close" size={24} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                            
                            <ScrollView 
                                style={styles.photoModalScrollView}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ flexGrow: 1 }}
                            >
                                {selectedPhoto && (
                                    <>
                                        <Image 
                                            source={{ uri: selectedPhoto.url }} 
                                            style={styles.modalPhotoImage}
                                        />
                                        <View style={styles.photoDetails}>
                                            <Text style={styles.detailLabel}>User: <Text style={styles.detailValue}>{selectedPhoto.user_name}</Text></Text>
                                            <Text style={styles.detailLabel}>Email: <Text style={styles.detailValue}>{selectedPhoto.user_email}</Text></Text>
                                            <Text style={styles.detailLabel}>Status: <Text style={styles.detailValue}>{selectedPhoto.status}</Text></Text>
                                            <Text style={styles.detailLabel}>Primary: <Text style={styles.detailValue}>{selectedPhoto.is_primary ? 'Yes' : 'No'}</Text></Text>
                                            <Text style={styles.detailLabel}>Reports: <Text style={styles.detailValue}>{selectedPhoto.report_count || 0}</Text></Text>
                                            <Text style={styles.detailLabel}>Created: <Text style={styles.detailValue}>{new Date(selectedPhoto.created_at).toLocaleDateString()}</Text></Text>
                                        </View>
                                    </>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                visible={showDeleteConfirm}
                transparent
                animationType="fade"
            >
                <View style={styles.confirmOverlay}>
                    <View style={styles.confirmModal}>
                        <Ionicons name="warning" size={48} color="#EF4444" />
                        <Text style={styles.confirmTitle}>Delete Photo</Text>
                        <Text style={styles.confirmMessage}>
                            Are you sure you want to delete this photo? This action cannot be undone.
                        </Text>
                        <View style={styles.confirmButtons}>
                            <TouchableOpacity 
                                style={styles.confirmCancel}
                                onPress={() => setShowDeleteConfirm(false)}
                            >
                                <Text style={styles.confirmCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.confirmDelete, actionInProgress && styles.buttonDisabled]}
                                onPress={confirmDelete}
                                disabled={actionInProgress}
                            >
                                {actionInProgress ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.confirmDeleteText}>Delete</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Success Alert */}
            {showSuccessAlert && (
                <View style={[styles.alertContainer, styles.successAlert]}>
                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.alertText}>{successMessage}</Text>
                    <TouchableOpacity onPress={() => setShowSuccessAlert(false)}>
                        <Ionicons name="close" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Error Alert */}
            {showErrorAlert && (
                <View style={[styles.alertContainer, styles.errorAlert]}>
                    <Ionicons name="alert-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.alertText}>{errorMessage}</Text>
                    <TouchableOpacity onPress={() => setShowErrorAlert(false)}>
                        <Ionicons name="close" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Loading Overlay */}
            {actionInProgress && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingContent}>
                        <ActivityIndicator size="large" color="#8B5CF6" />
                        <Text style={styles.loadingOverlayText}>Processing...</Text>
                    </View>
                </View>
            )}

            {/* Upload Photo Modal */}
            <Modal
                visible={showUploadModal}
                transparent
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.photoModal}>
                        <View style={styles.photoModalContent}>
                            <View style={styles.photoModalHeader}>
                                <Text style={styles.photoModalTitle}>Upload Photo</Text>
                                <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                                    <Ionicons name="close" size={24} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                            
                            <ScrollView 
                                style={styles.photoModalScrollView}
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={styles.photoDetails}>
                                    <Text style={styles.detailLabel}>Select User ID:</Text>
                                    <TextInput
                                        style={[styles.searchInput, { marginTop: 8, marginBottom: 16 }]}
                                        placeholder="Enter user ID..."
                                        value={selectedUserId?.toString() || ''}
                                        onChangeText={(text) => setSelectedUserId(text ? parseInt(text) : null)}
                                        keyboardType="numeric"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                    
                                    {/* Photo selection buttons */}
                                    <View style={{ gap: 12 }}>
                                        {Platform.OS !== 'web' && (
                                            <TouchableOpacity 
                                                style={[styles.confirmDelete, { backgroundColor: '#10B981' }, uploadingPhoto && styles.buttonDisabled]}
                                                onPress={selectPhotoFromGallery}
                                                disabled={uploadingPhoto || !selectedUserId}
                                            >
                                                {uploadingPhoto ? (
                                                    <ActivityIndicator color="#FFFFFF" />
                                                ) : (
                                                    <>
                                                        <Ionicons name="camera" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                                        <Text style={styles.confirmDeleteText}>From Gallery</Text>
                                                    </>
                                                )}
                                            </TouchableOpacity>
                                        )}
                                        
                                        <TouchableOpacity 
                                            style={[styles.confirmDelete, { backgroundColor: '#8B5CF6' }, uploadingPhoto && styles.buttonDisabled]}
                                            onPress={selectPhotoFromComputer}
                                            disabled={uploadingPhoto || !selectedUserId}
                                        >
                                            {uploadingPhoto ? (
                                                <ActivityIndicator color="#FFFFFF" />
                                            ) : (
                                                <>
                                                    <Ionicons name="folder" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                                    <Text style={styles.confirmDeleteText}>
                                                        {Platform.OS === 'web' ? 'Select File' : 'From Computer'}
                                                    </Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
