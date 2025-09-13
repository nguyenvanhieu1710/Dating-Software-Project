import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import ChatMessage from "../components/ChatMessage";
import ChatInput from '../components/ChatInput';
import { useSocket } from '../hooks/useSocket';
import { getMatchById, getMatchMessages, sendMessage, Message as ApiMessage } from '@/services/matchApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Match {
    id: number;
    user1_id: number;
    user2_id: number;
    other_user: {
        id: number;
        first_name: string;
        gender: string;
    };
}

const ChatScreen: React.FC = () => {
    const { matchId } = useLocalSearchParams();
    const router = useRouter();

    const [messages, setMessages] = useState<ApiMessage[]>([]);
    const [match, setMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUsers, setTypingUsers] = useState<number[]>([]);

    const flatListRef = useRef<FlatList>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Socket hook
    const {
        socket,
        isConnected,
        connect,
        disconnect,
        joinMatch,
        leaveMatch,
        sendMessage: socketSendMessage,
        startTyping,
        stopTyping,
        onNewMessage,
        onUserTyping,
        onUserStopTyping,
    } = useSocket();

    // Initialize socket connection - DISABLED FOR NOW
    useEffect(() => {
        // Temporarily disable socket connection to avoid authentication errors
        console.log('Socket connection disabled for testing');
        
        // const initSocket = async () => {
        //     try {
        //         await connect();
        //     } catch (error) {
        //         console.error('Failed to connect socket:', error);
        //         Alert.alert('Connection Error', 'Failed to connect to chat server');
        //     }
        // };

        // initSocket();

        // return () => {
        //     disconnect();
        // };
    }, []);

    // Join match room when connected - DISABLED FOR NOW
    useEffect(() => {
        // Temporarily disable match room joining
        console.log('Match room joining disabled for testing');
        
        // if (isConnected && matchId) {
        //     joinMatch(Number(matchId));
        // }

        // return () => {
        //     leaveMatch();
        // };
    }, [matchId]);

    // Load initial data
    useEffect(() => {
        if (matchId) {
            loadMatchData();
            loadMessages();
        }
    }, [matchId]);

    // Socket event listeners - DISABLED FOR NOW
    useEffect(() => {
        // Temporarily disable socket event listeners
        console.log('Socket event listeners disabled for testing');
        
        // onNewMessage((message: ApiMessage) => {
        //     setMessages(prev => [...prev, message]);
        //     scrollToBottom();
        // });

        // onUserTyping((data) => {
        //     if (data.matchId === Number(matchId)) {
        //         setTypingUsers(prev => [...prev, data.userId]);
        //     }
        // });

        // onUserStopTyping((data) => {
        //     if (data.matchId === Number(matchId)) {
        //         setTypingUsers(prev => prev.filter(id => id !== data.userId));
        //     }
        // });

        return () => {
            // Cleanup listeners if needed
        };
    }, [matchId]);

    const handleBack = () => {
        router.push('/messages');
    };

    const loadMatchData = async () => {
        try {
            // Use matchApi instead of direct fetch
            const matchData = await getMatchById(Number(matchId));
            if (matchData) {
                setMatch({
                    id: matchData.id,
                    user1_id: matchData.user1_id,
                    user2_id: matchData.user2_id,
                    other_user: {
                        id: matchData.other_user_id,
                        first_name: matchData.first_name,
                        gender: matchData.gender
                    }
                });
            }
        } catch (error) {
            console.error('Failed to load match data:', error);
        }
    };

    const loadMessages = async () => {
        try {
            setLoading(true);
            const messagesData = await getMatchMessages(Number(matchId), 50, 0);
            setMessages(messagesData.reverse()); // Reverse to show newest at bottom
            scrollToBottom();
        } catch (error) {
            console.error('Failed to load messages:', error);
            Alert.alert('Error', 'Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadMessages();
        setRefreshing(false);
    };

    const handleSendMessage = async (content: string, messageType: string) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getAuthToken()}`,
                },
                body: JSON.stringify({
                    match_id: Number(matchId),
                    content,
                    message_type: messageType,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Message will be added via socket broadcast
                console.log('Message sent successfully');
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            Alert.alert('Error', 'Failed to send message');
        }
    };

    const handleTypingStart = () => {
        startTyping();
        setIsTyping(true);
    };

    const handleTypingStop = () => {
        stopTyping();
        setIsTyping(false);
    };

    const scrollToBottom = () => {
        if (flatListRef.current && messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    const handleMessageLongPress = (messageId: number) => {
        Alert.alert(
            'Message Options',
            'What would you like to do?',
            [
                { text: 'Copy', onPress: () => copyMessage(messageId) },
                { text: 'Delete', onPress: () => deleteMessage(messageId), style: 'destructive' },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const copyMessage = (messageId: number) => {
        const message = messages.find(m => m.id === messageId);
        if (message) {
            // Implement copy to clipboard
            Alert.alert('Copied', 'Message copied to clipboard');
        }
    };

    const deleteMessage = async (messageId: number) => {
        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/messages/${messageId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${await getAuthToken()}`,
                    },
                }
            );

            if (response.ok) {
                setMessages(prev => prev.filter(m => m.id !== messageId));
            } else {
                throw new Error('Failed to delete message');
            }
        } catch (error) {
            console.error('Failed to delete message:', error);
            Alert.alert('Error', 'Failed to delete message');
        }
    };

    const getAuthToken = async () => {
        // Get token from AsyncStorage
        return 'your-auth-token';
    };

    const renderMessage = ({ item }: { item: ApiMessage }) => (
        <ChatMessage
            message={item}
            currentUserId={currentUserId || 0}
            onLongPress={handleMessageLongPress}
        />
    );

    const renderTypingIndicator = () => {
        if (typingUsers.length > 0) {
            return (
                <View style={styles.typingIndicator}>
                    <Text style={styles.typingText}>
                        {match?.other_user.first_name} is typing...
                    </Text>
                </View>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading messages...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => handleBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{match?.other_user.first_name}</Text>
                    <Text style={styles.headerSubtitle}>
                        {isConnected ? 'Online' : 'Offline'}
                    </Text>
                </View>

                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#8B5CF6" />
                </TouchableOpacity>
            </View>

            {/* Messages List */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id.toString()}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                onContentSizeChange={scrollToBottom}
                onLayout={scrollToBottom}
            />

            {/* Typing Indicator */}
            {renderTypingIndicator()}

            {/* Chat Input */}
            <ChatInput
                onSendMessage={handleSendMessage}
                onTypingStart={handleTypingStart}
                onTypingStop={handleTypingStop}
                isTyping={isTyping}
                disabled={!isConnected}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        backgroundColor: '#fff',
    },
    backButton: {
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    moreButton: {
        marginLeft: 12,
    },
    messagesList: {
        flex: 1,
    },
    messagesContainer: {
        paddingVertical: 8,
    },
    typingIndicator: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    typingText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
});

export default ChatScreen; 