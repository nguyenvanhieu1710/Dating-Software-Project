import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getMatches, Match } from '@/services/matchApi';

export default function MessagesScreen() {
    const router = useRouter();
    const [matches, setMatches] = useState<Match[]>([]);
    const [conversations, setConversations] = useState<Match[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch matches and conversations from API
    useEffect(() => {
        const fetchMatchesAndConversations = async () => {
            try {
                setIsLoading(true);
                const matchesData = await getMatches();
                console.log('Matches data:', matchesData);
                
                setMatches(matchesData);
                
                // Filter matches that have messages for conversations
                const conversationsData = matchesData.filter(match => match.message_count > 0);
                setConversations(conversationsData);
                
            } catch (err) {
                console.error('Error fetching matches and conversations:', err);
                setError('Failed to load conversations. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatchesAndConversations();
    }, []);

    const handleMatchPress = (matchId: number) => {
        router.push({
            pathname: '/chat',
            params: { matchId: matchId.toString() }
        });
    };
    const navigateToFriends = () => {
        router.push('/friends');
    };
    const navigateToSafetyCenter = () => {
        router.push('/safety-center');
    };
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF9FB" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <View style={styles.logoTextContainer}>
                            <Ionicons name="chatbubbles" size={24} color="#6D28D9" />
                            <Text style={styles.logoText}>Chats</Text>
                        </View>
                        <View style={styles.headerIcons}>
                            <TouchableOpacity style={styles.iconButton} onPress={() => navigateToFriends()}>
                                <Ionicons name="people" size={24} color="#6D28D9" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => navigateToSafetyCenter()}>
                                <Ionicons name="shield-checkmark" size={24} color="#6D28D9" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                
                {/* Search bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#6D28D9" />
                    <Text style={styles.searchText}>Search</Text>
                </View>
                
                <View style={styles.contentContainer}>
                    {/* New Matches */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>New Matches</Text>
                        <View style={styles.matchesContainer}>
                            {isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color="#6D28D9" />
                                    <Text style={styles.loadingText}>Loading matches...</Text>
                                </View>
                            ) : matches.length > 0 ? (
                                <FlatList
                                    data={matches}
                                    horizontal
                                    keyExtractor={item => `${Math.min(item.user1_id, item.user2_id)}-${Math.max(item.user1_id, item.user2_id)}`}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.matchBox} onPress={() => handleMatchPress(item.id)}>
                                            <Image source={{ uri: item.avatar || `https://picsum.photos/100/100?random=${item.id}` }} style={styles.matchAvatar} />
                                            <Text style={styles.matchName}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.matchList}
                                />
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="heart-outline" size={32} color="#9CA3AF" />
                                    <Text style={styles.emptyText}>No new matches yet</Text>
                                    <Text style={styles.emptySubText}>Keep swiping to find new connections!</Text>
                                </View>
                            )}
                        </View>
                    </View>
                    
                    {/* Messages */}
                    <View style={styles.messagesSection}>
                        <Text style={styles.sectionTitle}>Messages</Text>
                        <View style={styles.chatListContainer}>
                            {isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color="#6D28D9" />
                                    <Text style={styles.loadingText}>Loading conversations...</Text>
                                </View>
                            ) : conversations.length > 0 ? (
                                <FlatList
                                    data={conversations}
                                    keyExtractor={item => `${Math.min(item.user1_id, item.user2_id)}-${Math.max(item.user1_id, item.user2_id)}`}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity key={item.id} style={styles.chatItem} onPress={() => handleMatchPress(item.id)}>
                                            <Image source={{ uri: item.avatar || `https://picsum.photos/100/100?random=${item.id}` }} style={styles.chatAvatar} />
                                            <View style={styles.chatContent}>
                                                <View style={styles.chatHeader}>
                                                    <Text style={styles.chatName}>{item.name}</Text>
                                                    <Text style={styles.chatTime}>{item.timeAgo}</Text>
                                                </View>
                                                <Text style={styles.chatMessage} numberOfLines={1}>
                                                    {item.message_count > 0 ? 'Tap to view conversation' : 'Start a conversation'}
                                                </Text>
                                                {item.message_count > 0 && (
                                                    <View style={styles.messageCountBadge}>
                                                        <Text style={styles.messageCountText}>{item.message_count}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    showsVerticalScrollIndicator={false}
                                />
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="chatbubbles-outline" size={48} color="#9CA3AF" />
                                    <Text style={styles.emptyText}>No conversations yet</Text>
                                    <Text style={styles.emptySubText}>Start matching to begin conversations!</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
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
    contentContainer: {
        flex: 1,
        paddingBottom: 16,        
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    logoTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#6D28D9',
        marginLeft: 12,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    iconButton: {
        marginHorizontal: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3E8FF',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
    },
    searchText: {
        color: '#7C3AED',
        fontSize: 16,
        marginLeft: 10,
        opacity: 0.8,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },
    matchesContainer: {
        height: 120,
        marginBottom: 8,
    },
    matchList: {
        paddingVertical: 8,
    },
    matchBox: {
        alignItems: 'center',
        marginRight: 16,
    },
    matchAvatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: '#7C3AED',
        marginBottom: 8,
    },
    matchName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4B5563',
    },
    messagesSection: {
        flex: 1,
        marginTop: 8,
    },
    chatListContainer: {
        flex: 1,
        marginTop: 8,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3E8FF',
    },
    chatAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 12,
    },
    chatContent: {
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    chatName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    chatTime: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    chatMessage: {
        fontSize: 14,
        color: '#6B7280',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        marginTop: 8,
        fontSize: 14,
        color: '#6B7280',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '600',
        color: '#4B5563',
    },
    emptySubText: {
        marginTop: 4,
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    messageCountBadge: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: '#6D28D9',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    messageCountText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
});