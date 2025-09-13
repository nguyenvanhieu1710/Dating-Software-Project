import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import MatchService from '@/services/matchService';

export default function MatchScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [match, setMatch] = useState<any>(null);

    useEffect(() => {
        const fetchLatestMatch = async () => {
            try {
                const matches = await MatchService.getMatches();
                if (matches.length > 0) {
                    const latestMatch = matches[0]; // Get the most recent match
                    // Fetch the full match details
                    const matchDetails = await MatchService.getMatch(latestMatch.id);
                    setMatch(matchDetails);
                }
                setError(null);
            } catch (err) {
                console.error('Failed to fetch match:', err);
                setError('Không thể tải thông tin match. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        fetchLatestMatch();
    }, []);

    const handleContinueSwiping = () => {
        router.back();
    };

    const handleSendMessage = () => {
        if (match) {
            router.push(`/(tabs)/messages/${match.id}`);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.safeArea, styles.centerContent]}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
                <Text style={styles.loadingText}>Đang tải thông tin match...</Text>
            </SafeAreaView>
        );
    }

    if (error || !match) {
        return (
            <SafeAreaView style={[styles.safeArea, styles.centerContent]}>
                <Ionicons name="sad-outline" size={48} color={Colors.light.text} />
                <Text style={styles.errorText}>{error || 'Không tìm thấy match nào'}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
                    <Text style={styles.retryButtonText}>Quay lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const matchedUser = match.user1Id === 'current-user-id' ? match.user2 : match.user1;
    const userAvatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop';
    const matchedUserAvatar = matchedUser?.photos?.[0] || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop';

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
            <View style={styles.container}>
                <Text style={styles.title}>It's a Match!</Text>
                <View style={styles.avatarsBox}>
                    <Image 
                        source={{ uri: userAvatar }} 
                        style={[styles.avatar, styles.avatarLeft]} 
                        defaultSource={{ uri: 'https://via.placeholder.com/90' }}
                    />
                    <View style={styles.heartBox}>
                        <Ionicons name="heart" size={32} color="#fff" />
                    </View>
                    <Image 
                        source={{ uri: matchedUserAvatar }} 
                        style={[styles.avatar, styles.avatarRight]} 
                        defaultSource={{ uri: 'https://via.placeholder.com/90' }}
                    />
                </View>
                <Text style={styles.subtitle}>
                    Bạn và {matchedUser?.name || 'người dùng'} đã thích nhau!
                </Text>
                <View style={styles.actions}>
                    <TouchableOpacity 
                        style={[styles.actionBtn, styles.msgBtn]} 
                        onPress={handleSendMessage}
                        disabled={!match}
                    >
                        <Text style={styles.actionText}>Gửi tin nhắn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.actionBtn} 
                        onPress={handleContinueSwiping}
                    >
                        <Text style={styles.actionText}>Tiếp tục vuốt</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        paddingTop: Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight || 0) + 24,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        color: Colors.light.text,
        fontSize: 16,
    },
    errorText: {
        marginTop: 16,
        color: Colors.light.danger,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        padding: 12,
        backgroundColor: Colors.light.primary,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginBottom: 16,
        textAlign: 'center',
    },
    avatarsBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 4,
        borderColor: Colors.light.primary,
        backgroundColor: Colors.light.card,
    },
    avatarLeft: {
        marginRight: -20,
        zIndex: 2,
    },
    avatarRight: {
        marginLeft: -20,
        zIndex: 2,
    },
    heartBox: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
    },
    subtitle: {
        fontSize: 20,
        color: Colors.light.text,
        marginBottom: 32,
        textAlign: 'center',
    },
    actions: {
        width: '100%',
        paddingHorizontal: 24,
    },
    actionBtn: {
        backgroundColor: Colors.light.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    msgBtn: {
        backgroundColor: Colors.light.secondary,
    },
    actionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});