import React, { useState, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Animated, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { Colors } from '@/constants/Colors';
import { State } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { User } from '@/services/userApi';
import { useRouter } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.25;

// Mock data as fallback
const MOCK_USERS: User[] = [
    {
      id: '1',
      name: 'Quynh Nhu',
      age: 21,
      distance: 1,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      bio: 'Cat lover, enjoys traveling, and loves weekend coffee.',
      photos: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop',
      ],
    },
    {
      id: '2',
      name: 'Ha',
      age: 27,
      distance: 5,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
      bio: 'Designer, enjoys drawing and listening to indie music.',
      photos: [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      ],
    },
    {
      id: '3',
      name: 'Minh',
      age: 23,
      distance: 1,
      avatar: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop',
      bio: 'Enjoys sports, runs every morning.',
      photos: [
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop',
      ],
    },
  ];

export default function ExploreDetailScreen() {
    const [users, setUsers] = useState<User[]>([]);
    const [current, setCurrent] = useState(0);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const swipeAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

  const user = users[current];

    // Fetch users from API
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          setIsLoading(true);
          // Uncomment this when your API is ready
          // const data = await getDiscoveryUsers();
          // setUsers(data);
          
          // For now, using mock data with delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          setUsers(MOCK_USERS);
        } catch (err) {
          console.error('Error fetching users:', err);
          setError('Failed to load user list. Please try again.');
          setUsers(MOCK_USERS); // Fallback to mock data
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchUsers();
    }, []);

    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationX: swipeAnim } }],
        { useNativeDriver: true }
    );

    const onHandlerStateChange = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            const { translationX } = event.nativeEvent;

            if (Math.abs(translationX) > SWIPE_THRESHOLD) {
                // Swipe threshold met
                const direction = translationX > 0 ? 'right' : 'left';
                handleSwipe(direction);
            } else {
                // Return to center
                Animated.spring(swipeAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            }
        }
    };

    const handleSwipe = (direction: 'left' | 'right' | 'superlike') => {
        // Nếu match (demo: nếu là Like vào user đầu tiên) thì mở màn hình match
        if ((direction === 'right' || direction === 'superlike') && user && user.id === '1') {
            return;
        }

        const targetValue = direction === 'left' ? -screenWidth * 1.5 : screenWidth * 1.5;
        const rotateValue = direction === 'left' ? -30 : 30;

        Animated.parallel([
            Animated.timing(swipeAnim, {
                toValue: targetValue,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
                toValue: rotateValue,
                duration: 250,
                useNativeDriver: true,
            })
        ]).start(() => {
            // Reset animations and move to next card
            swipeAnim.setValue(0);
            rotateAnim.setValue(0);
            setCurrentPhotoIndex(0);
            setCurrent((prev) => (prev + 1) % users.length);
        });
    };

    const handlePhotoNavigation = (direction: 'left' | 'right') => {
        if (direction === 'left' && currentPhotoIndex > 0) {
          setCurrentPhotoIndex(currentPhotoIndex - 1);
        } else if (direction === 'right' && currentPhotoIndex < user.photos.length - 1) {
          setCurrentPhotoIndex(currentPhotoIndex + 1);
        }
      };
    
      const handleRewind = () => {
        setCurrent((prev) => (prev - 1 + users.length) % users.length);
        setCurrentPhotoIndex(0);
      };
    
      const handleBoost = () => {
        router.push('/paywall');
      };
    
      const handleProfileDetail = () => {
        router.push('/profile-detail');
      };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Ionicons name="exit" size={24} color="#8B5CF6" />
                </View>
                <View>
                    <Text>Explore Name</Text>
                </View>
                <View style={styles.headerButtons}>
                    <TouchableOpacity style={styles.headerBtn}>
                        <Ionicons name="flash" size={16} color="#8B5CF6" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerBtn}>
                        <Ionicons name="exit" size={16} color="#8B5CF6" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Main Content */}
            <GestureHandlerRootView style={styles.mainContainer}>
                <View style={styles.cardContainer}>
                    <PanGestureHandler
                        onGestureEvent={onGestureEvent}
                        onHandlerStateChange={onHandlerStateChange}
                    >
                        <Animated.View
                            style={[
                                styles.card,
                                {
                                    transform: [
                                        { translateX: swipeAnim },
                                        {
                                            rotate: rotateAnim.interpolate({
                                                inputRange: [-30, 0, 30],
                                                outputRange: ['-30deg', '0deg', '30deg']
                                            })
                                        }
                                    ],
                                },
                            ]}
                        >
                            <Image
                                source={{ uri: user.photos[currentPhotoIndex] }}
                                style={styles.cardImage}
                            />

                            {/* Photo Progress Indicator */}
                            <View style={styles.photoProgressContainer}>
                                {user.photos.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.photoProgressBar,
                                            index === currentPhotoIndex && styles.photoProgressActive
                                        ]}
                                    />
                                ))}
                            </View>

                            {/* Photo Navigation Overlay - Tap to navigate */}
                            <View style={styles.photoNavigation}>
                                <TouchableOpacity
                                    style={styles.photoNavLeft}
                                    onPress={() => handlePhotoNavigation('left')}
                                    disabled={currentPhotoIndex === 0}
                                />
                                <TouchableOpacity
                                    style={styles.photoNavRight}
                                    onPress={() => handlePhotoNavigation('right')}
                                    disabled={currentPhotoIndex === user.photos.length - 1}
                                />
                            </View>

                            {/* User Info Overlay */}
                            <View style={styles.userInfoOverlay}>
                                <View style={styles.userInfoLeft}>
                                    <View style={styles.locationTag}>
                                        <Ionicons name="location" size={12} color="#fff" />
                                        <Text style={styles.locationText}>{user.distance} km away</Text>
                                    </View>
                                    <Text style={styles.userName}>{user.name}, {user.age}</Text>
                                    <Text style={styles.userDistance}>{user.bio}</Text>
                                </View>
                                <TouchableOpacity style={styles.detailBtn} onPress={handleProfileDetail}>
                                    <Ionicons name="arrow-up" size={20} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </PanGestureHandler>
                </View>

                {/* Action Buttons - Cố định ở dưới */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={[styles.actionBtn, styles.rewindBtn]} onPress={handleRewind}>
                        <Ionicons name="refresh" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.passBtn]} onPress={() => handleSwipe('left')}>
                        <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.superlikeBtn]} onPress={() => handleSwipe('superlike')}>
                        <Ionicons name="star" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.likeBtn]} onPress={() => handleSwipe('right')}>
                        <Ionicons name="heart" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.boostBtn]} onPress={handleBoost}>
                        <Ionicons name="rocket" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </GestureHandlerRootView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingTop: Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight || 0) + 15,
        backgroundColor: '#fff',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8B5CF6', // Màu tím thống nhất
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 15,
    },
    headerBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderColor: 'gray',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: "100%",
        height: "100%",
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    photoNavigation: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
    },
    photoNavLeft: {
        flex: 1, // Chiếm nửa bên trái
        height: '100%',
    },
    photoNavRight: {
        flex: 1, // Chiếm nửa bên phải
        height: '100%',
    },
    photoProgressContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        gap: 4,
        zIndex: 5,
    },
    photoProgressBar: {
        flex: 1,
        height: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 2,
    },
    photoProgressActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    userInfoOverlay: {
        position: 'absolute',
        bottom: 70,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: 20,
        paddingBottom: 30,
    },
    userInfoLeft: {
        flex: 1,
    },
    locationTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8B5CF6', // Màu tím thống nhất
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },

    locationText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    userDistance: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    detailBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
    },

    actionButtons: {
        position: 'absolute', // Đè lên card container
        bottom: 0, // Cố định ở dưới
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        paddingVertical: 20,
        gap: 15,
        zIndex: 10, // Đảm bảo đè lên card
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    actionBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    rewindBtn: {
        backgroundColor: '#8B5CF6', // Màu tím thống nhất
    },
    passBtn: {
        backgroundColor: '#8B5CF6', // Màu tím thống nhất
    },
    superlikeBtn: {
        backgroundColor: '#8B5CF6', // Màu tím thống nhất
    },
    likeBtn: {
        backgroundColor: '#8B5CF6', // Màu tím thống nhất
    },
    boostBtn: {
        backgroundColor: '#8B5CF6', // Màu tím thống nhất
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#EF4444',
        textAlign: 'center',
        marginBottom: 20,
    },
    noUsersText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
        color: '#4B5563',
    },
    subText: {
        marginTop: 8,
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
});