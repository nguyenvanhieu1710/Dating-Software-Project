import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

interface ChatInputProps {
    onSendMessage: (content: string, messageType: string) => void;
    onTypingStart: () => void;
    onTypingStop: () => void;
    isTyping: boolean;
    disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
    onSendMessage,
    onTypingStart,
    onTypingStop,
    isTyping,
    disabled = false
}) => {
    const [message, setMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const typingTimeoutRef = useRef<number | null>(null);
    const inputRef = useRef<TextInput>(null);

    // Typing indicator logic
    useEffect(() => {
        if (message.length > 0) {
            onTypingStart();

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
                onTypingStop();
            }, 2000);
        } else {
            onTypingStop();
        }

        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [message, onTypingStart, onTypingStop]);

    const handleSend = () => {
        if (message.trim() && !disabled) {
            onSendMessage(message.trim(), 'text');
            setMessage('');
            onTypingStop();
        }
    };

    // Handle keyboard events for desktop support
    const handleKeyPress = (event: any) => {
        if (Platform.OS === 'web') {
            // On web platform, handle Enter key
            if (event.nativeEvent.key === 'Enter') {
                if (event.nativeEvent.shiftKey) {
                    // Shift+Enter: Add new line (default behavior)
                    return;
                } else {
                    // Enter: Send message
                    event.preventDefault();
                    handleSend();
                }
            }
        }
    };

    const handleImagePicker = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert('Permission Required', 'Permission to access camera roll is required!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                const messageType = asset.type === 'video' ? 'video' : 'image';
                onSendMessage(asset.uri, messageType);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleCamera = async () => {
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert('Permission Required', 'Permission to access camera is required!');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                const messageType = asset.type === 'video' ? 'video' : 'image';
                onSendMessage(asset.uri, messageType);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo');
        }
    };

    const handleDocumentPicker = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                onSendMessage(result.assets[0].uri, 'file');
            }
        } catch (error) {
            console.error('Error picking document:', error);
            Alert.alert('Error', 'Failed to pick document');
        }
    };

    const handleVoiceRecord = () => {
        // Implement voice recording functionality
        Alert.alert('Coming Soon', 'Voice recording feature will be available soon!');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.inputContainer}>
                {/* Attachment Button */}
                <TouchableOpacity
                    style={styles.attachButton}
                    onPress={() => {
                        Alert.alert(
                            'Attach',
                            'Choose attachment type',
                            [
                                { text: 'Camera', onPress: handleCamera },
                                { text: 'Gallery', onPress: handleImagePicker },
                                { text: 'Document', onPress: handleDocumentPicker },
                                { text: 'Voice', onPress: handleVoiceRecord },
                                { text: 'Cancel', style: 'cancel' }
                            ]
                        );
                    }}
                    disabled={disabled}
                >
                    <Ionicons name="add" size={24} color="#007AFF" />
                </TouchableOpacity>

                {/* Text Input */}
                <View style={styles.textInputContainer}>
                    <TextInput
                        ref={inputRef}
                        style={styles.textInput}
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
                        placeholderTextColor="#999"
                        multiline
                        maxLength={1000}
                        editable={!disabled}
                        onKeyPress={handleKeyPress}
                        onFocus={() => {
                            if (message.length > 0) {
                                onTypingStart();
                            }
                        }}
                        onBlur={() => {
                            onTypingStop();
                        }}
                    />
                </View>

                {/* Send Button */}
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        (!message.trim() || disabled) && styles.sendButtonDisabled
                    ]}
                    onPress={handleSend}
                    disabled={!message.trim() || disabled}
                >
                    <Ionicons
                        name="send"
                        size={20}
                        color={message.trim() && !disabled ? "#007AFF" : "#999"}
                    />
                </TouchableOpacity>
            </View>

            {/* Typing Indicator */}
            {isTyping && (
                <View style={styles.typingIndicator}>
                    <Text style={styles.typingText}>Someone is typing...</Text>
                    <View style={styles.typingDots}>
                        <Animated.View style={[styles.dot, styles.dot1]} />
                        <Animated.View style={[styles.dot, styles.dot2]} />
                        <Animated.View style={[styles.dot, styles.dot3]} />
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    attachButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    textInputContainer: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        maxHeight: 100,
    },
    textInput: {
        fontSize: 16,
        lineHeight: 20,
        color: '#000',
        padding: 0,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    sendButtonDisabled: {
        backgroundColor: '#F0F0F0',
    },
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    typingText: {
        fontSize: 12,
        color: '#666',
        marginRight: 8,
    },
    typingDots: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#999',
        marginHorizontal: 2,
    },
    dot1: {
        opacity: 0.4,
    },
    dot2: {
        opacity: 0.6,
    },
    dot3: {
        opacity: 0.8,
    },
});

export default ChatInput; 