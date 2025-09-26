import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, StatusBar, Platform, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getUserProfile, updateUserProfile, User, getCurrentUserId } from '../../services/userApi';

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null); // Initialize as null instead of undefined
    const [consumable, setConsumable] = useState<any[]>([]); // Specify type for consumable
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load user profile on component mount
    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const profileData = await getUserProfile();
            console.log("Profile data: ", profileData);            
            setUser(profileData);   
            loadConsumableOfUser();        
        } catch (err: any) {
            console.error('Error loading profile:', err);
            if (err.message === 'USER_NOT_LOGGED_IN') {
                setError('Please login to view your profile.');
            } else {
                setError('Failed to load profile. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const loadConsumableOfUser = async () => {
        const userId = await getCurrentUserId();
        if (!userId) return; // Guard against undefined user
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/consumable/by-user/${userId}`, {
                method: 'GET'
            });
            const data = await response.json();
            console.log("Consumable of user: ", data);
            setConsumable(data);
        } catch (err) {
            console.error('Error loading consumables:', err);
        }
    };    

    const handleEditProfile = () => {
        if (user?.id) {
            router.push({
                pathname: '/edit-profile',
                params: { userId: user.id.toString() } // Ensure userId is string
            });
        }
    };

    const handleRefresh = () => {
        loadUserProfile();
    };

    const handleLogin = () => {
        router.push('/login');
    };

    const handleSettings = () => {
        router.push('/settings');
    };

    const handleSafetyCenter = () => {
        router.push('/safety-center');
    };

    const handleUpgrade = () => {
        router.push('/subscriptions');
    };

    const handleConsumable = () => {
        router.push('/consumable');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF9FB" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.profileHeader}>
                        <View style={styles.profileIcon}>
                            <Ionicons name="person-circle" size={28} color="#6D28D9" />
                        </View>
                        <Text style={styles.profileText}>Profile</Text>
                    </View>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.iconButton} onPress={handleSafetyCenter}>
                            <Ionicons name="shield-checkmark" size={24} color="#6D28D9" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={handleSettings}>
                            <Ionicons name="settings" size={24} color="#6D28D9" />
                        </TouchableOpacity>
                    </View>
                </View>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#7C3AED" />
                        <Text style={styles.loadingText}>Loading profile...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={48} color="#EF4444" />
                        <Text style={styles.errorText}>{error}</Text>
                        {error.includes('login') ? (
                            <TouchableOpacity style={styles.retryButton} onPress={handleLogin}>
                                <Text style={styles.retryButtonText}>Login</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                                <Text style={styles.retryButtonText}>Try Again</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : user ? (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Avatar */}
                        <View style={styles.avatarBox}>
                            <Image source={{ uri: user.avatar || 'https://picsum.photos/400/600' }} style={styles.avatar} />
                            <Text style={styles.name}>{user.name || 'Unknown User'}</Text>
                            <Text style={styles.age}>{user.age ? `${user.age} years old` : ''}</Text>
                            <Text style={styles.bio}>{user.bio || 'No bio available'}</Text>
                            <TouchableOpacity style={styles.actionBtn} onPress={handleEditProfile}>
                                <Text style={styles.actionText}>Chỉnh sửa hồ sơ</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.actions}>
                            {/* Consumable and subscription */}
                            <View style={styles.statsContainer}>
                                {/* Super Likes */}
                                <TouchableOpacity style={styles.statCard} onPress={handleConsumable}>
                                    <Ionicons name="add-circle" size={20} color="#7C3AED" style={styles.plusIcon} />
                                    <Text style={styles.statValue}>100</Text>
                                    <Text style={styles.statLabel}>Super Likes</Text>
                                    <Text style={styles.getMore}>GET MORE</Text>
                                </TouchableOpacity>

                                {/* My Boots */}
                                <TouchableOpacity style={styles.statCard} onPress={handleConsumable}>
                                    <Ionicons name="add-circle" size={20} color="#7C3AED" style={styles.plusIcon} />
                                    <Text style={styles.statValue}>50</Text>
                                    <Text style={styles.statLabel}>My Boots</Text>
                                    <Text style={styles.getMore}>GET MORE</Text>
                                </TouchableOpacity>

                                {/* Subscriptions */}
                                <TouchableOpacity style={styles.statCard} onPress={handleUpgrade}>
                                    <Ionicons name="add-circle" size={20} color="#7C3AED" style={styles.plusIcon} />                                    
                                    <Text style={styles.statLabel}>Subscriptions</Text>
                                </TouchableOpacity>
                            </View>
                            {/* Upgrade */}
                            <View style={styles.upgradeBox}>
                                <Text style={styles.upgradeTitle}>Upgrade Your Experience</Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.upgradeTiersContainer}
                                >
                                    <TouchableOpacity style={[styles.tier, styles.tierGold]} onPress={handleUpgrade}>
                                        <Text style={styles.tierName}>Gold</Text>
                                        <Text style={styles.tierPrice}>$9.99<Text style={styles.tierPeriod}>/month</Text></Text>
                                        <View style={styles.tierFeatures}>
                                            <Text style={styles.tierFeature}>✓ Unlimited Likes</Text>
                                            <Text style={styles.tierFeature}>✓ See who likes you</Text>
                                            <Text style={styles.tierFeature}>✓ 5 Super Likes/week</Text>
                                        </View>
                                        <Text style={styles.tierPopular}>MOST POPULAR</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.tier, styles.tierPlatinum]} onPress={handleUpgrade}>
                                        <Text style={styles.tierName}>Platinum</Text>
                                        <Text style={styles.tierPrice}>$19.99<Text style={styles.tierPeriod}>/month</Text></Text>
                                        <View style={styles.tierFeatures}>
                                            <Text style={styles.tierFeature}>✓ All Gold features</Text>
                                            <Text style={styles.tierFeature}>✓ Message before matching</Text>
                                            <Text style={styles.tierFeature}>✓ Priority likes</Text>
                                            <Text style={styles.tierFeature}>✓ 10 Super Likes/week</Text>
                                        </View>
                                        <Text style={styles.tierPopular}>BEST VALUE</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.tier, styles.tierPlus]} onPress={handleUpgrade}>
                                        <Text style={styles.tierName}>Plus</Text>
                                        <Text style={styles.tierPrice}>$4.99<Text style={styles.tierPeriod}>/month</Text></Text>
                                        <View style={styles.tierFeatures}>
                                            <Text style={styles.tierFeature}>✓ Unlimited Likes</Text>
                                            <Text style={styles.tierFeature}>✓ Rewind last swipe</Text>
                                            <Text style={styles.tierFeature}>✓ 1 Super Like/week</Text>
                                        </View>
                                    </TouchableOpacity>
                                </ScrollView>
                                <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
                                    <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                ) : (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={48} color="#EF4444" />
                        <Text style={styles.errorText}>No user data available.</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF9FB',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF9FB',
        padding: 16,
        paddingTop: Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight || 0) + 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3E8FF',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileIcon: {
        backgroundColor: '#F3E8FF',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    profileText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 16,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3E8FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarBox: {
        alignItems: 'center',
        marginBottom: 16,
        position: 'relative',
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: '#F3E8FF',
        backgroundColor: '#F3E8FF',
        marginBottom: 16,
    },
    goldBadge: {
        position: 'absolute',
        top: 16,
        right: 30,
        backgroundColor: '#FCD34D',
        color: '#92400E',
        fontWeight: '700',
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 20,
        fontSize: 14,
        elevation: 2,
        transform: [{ rotate: '15deg' }],
    },
    name: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    bio: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    actions: {
        width: '100%',
        gap: 16,
    },
    actionBtn: {
        backgroundColor: '#F3E8FF',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E9D5FF',
    },
    actionText: {
        color: '#7C3AED',
        fontSize: 16,
        fontWeight: '600',
    },
    upgradeBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#EDE9FE',
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    upgradeTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'center',
    },
    upgradeTiersContainer: {
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    upgradeTiers: {
        flexDirection: 'row',
        paddingBottom: 8,
    },
    tier: {
        width: 200,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        position: 'relative',
        overflow: 'hidden',
        marginRight: 12,
    },
    tierGold: {
        backgroundColor: '#FEF9C3',
        borderColor: '#FDE047',
    },
    tierPlatinum: {
        backgroundColor: '#F0F9FF',
        borderColor: '#7DD3FC',
    },
    tierPlus: {
        backgroundColor: '#F5F3FF',
        borderColor: '#DDD6FE',
    },
    tierName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    tierPrice: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 12,
    },
    tierPeriod: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    tierFeatures: {
        marginBottom: 12,
    },
    tierFeature: {
        fontSize: 12,
        color: '#4B5563',
        marginBottom: 6,
    },
    tierPopular: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#7C3AED',
        color: 'white',
        fontSize: 10,
        fontWeight: '700',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderBottomLeftRadius: 8,
    },
    upgradeButton: {
        backgroundColor: '#7C3AED',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    upgradeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 24,
    },
    statCard: {
        width: 110,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    plusIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    getMore: {
        marginTop: 6,
        fontSize: 12,
        color: '#7C3AED',
        fontWeight: '600',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#6B7280',
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
        backgroundColor: '#7C3AED',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    age: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 8,
        textAlign: 'center',
    },
});