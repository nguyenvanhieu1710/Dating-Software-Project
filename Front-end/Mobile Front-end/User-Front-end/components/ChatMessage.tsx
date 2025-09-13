import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatMessageProps {
    message: {
        id: number;
        content: string;
        sender_id: number;
        sent_at: string;
        read_at?: string | null;
        message_type: 'text' | 'image' | 'video' | 'file' | 'audio';
        sender: {
            first_name: string;
            gender: string;
        };
    };
    currentUserId: number;
    onLongPress?: (messageId: number) => void;
    onReaction?: (messageId: number, reactionType: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    currentUserId,
    onLongPress,
    onReaction
}) => {
    const isOwnMessage = message.sender_id === currentUserId;
    const isRead = message.read_at !== null;

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderMessageContent = () => {
        switch (message.message_type) {
            case 'text':
                return (
                    <Text style={[
                        styles.messageText,
                        isOwnMessage ? styles.ownMessageText : styles.otherMessageText
                    ]}>
                        {message.content}
                    </Text>
                );

            case 'image':
                return (
                    <Image
                        source={{ uri: message.content }}
                        style={styles.messageImage}
                        resizeMode="cover"
                    />
                );

            case 'video':
                return (
                    <View style={styles.videoContainer}>
                        <Ionicons name="play-circle" size={40} color="#fff" />
                        <Text style={styles.videoText}>Video</Text>
                    </View>
                );

            case 'file':
                return (
                    <View style={styles.fileContainer}>
                        <Ionicons name="document" size={24} color="#666" />
                        <Text style={styles.fileText}>File</Text>
                    </View>
                );

            case 'audio':
                return (
                    <View style={styles.audioContainer}>
                        <Ionicons name="play" size={20} color="#666" />
                        <Text style={styles.audioText}>Audio</Text>
                    </View>
                );

            default:
                return (
                    <Text style={[
                        styles.messageText,
                        isOwnMessage ? styles.ownMessageText : styles.otherMessageText
                    ]}>
                        {message.content}
                    </Text>
                );
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.messageContainer,
                isOwnMessage ? styles.ownMessage : styles.otherMessage
            ]}
            onLongPress={() => onLongPress?.(message.id)}
            activeOpacity={0.8}
        >
            {!isOwnMessage && (
                <Text style={styles.senderName}>{message.sender.first_name}</Text>
            )}

            <View style={[
                styles.messageBubble,
                isOwnMessage ? styles.ownBubble : styles.otherBubble
            ]}>
                {renderMessageContent()}

                <View style={styles.messageFooter}>
                    <Text style={styles.messageTime}>
                        {formatTime(message.sent_at)}
                    </Text>

                    {isOwnMessage && (
                        <View style={styles.readStatus}>
                            {isRead ? (
                                <Ionicons name="checkmark-done" size={16} color="#4CAF50" />
                            ) : (
                                <Ionicons name="checkmark" size={16} color="#999" />
                            )}
                        </View>
                    )}
                </View>
            </View>

            {onReaction && (
                <TouchableOpacity
                    style={styles.reactionButton}
                    onPress={() => onReaction(message.id, 'like')}
                >
                    <Ionicons name="heart-outline" size={16} color="#666" />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    messageContainer: {
        marginVertical: 4,
        paddingHorizontal: 16,
    },
    ownMessage: {
        alignItems: 'flex-end',
    },
    otherMessage: {
        alignItems: 'flex-start',
    },
    senderName: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
        marginLeft: 8,
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 18,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    ownBubble: {
        backgroundColor: '#007AFF',
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#F0F0F0',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    ownMessageText: {
        color: '#FFFFFF',
    },
    otherMessageText: {
        color: '#000000',
    },
    messageImage: {
        width: 200,
        height: 150,
        borderRadius: 12,
    },
    videoContainer: {
        width: 200,
        height: 120,
        backgroundColor: '#000',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoText: {
        color: '#fff',
        marginTop: 8,
        fontSize: 14,
    },
    fileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    fileText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
    audioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    audioText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 4,
    },
    messageTime: {
        fontSize: 11,
        color: '#999',
        marginRight: 4,
    },
    readStatus: {
        marginLeft: 4,
    },
    reactionButton: {
        position: 'absolute',
        bottom: -8,
        right: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
});

export default ChatMessage; 