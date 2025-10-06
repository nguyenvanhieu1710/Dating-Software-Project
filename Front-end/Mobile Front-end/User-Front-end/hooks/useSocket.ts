import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
    id: number;
    content: string;
    sender_id: number;
    sent_at: string;
    read_at?: string | null;
    deleted_at?: string | null;
    message_type: 'text' | 'image' | 'video' | 'file' | 'audio';
    match_id: number;
    first_name: string;
    gender: string;
    dob: string;
    message_direction: 'sent' | 'received';
    sender: {
        id: number;
        first_name: string;
        gender: string;
        avatar_url?: string;
    };
}

interface TypingData {
    userId: number;
    matchId: number;
}

interface SocketHookReturn {
    socket: Socket | null;
    isConnected: boolean;
    isTyping: boolean;
    typingUsers: number[];
    connect: () => Promise<void>;
    disconnect: () => void;
    joinMatch: (matchId: number) => void;
    leaveMatch: () => void;
    sendMessage: (content: string, messageType: string) => void;
    startTyping: () => void;
    stopTyping: () => void;
    onNewMessage: (callback: (message: Message) => void) => void;
    onUserTyping: (callback: (data: TypingData) => void) => void;
    onUserStopTyping: (callback: (data: TypingData) => void) => void;
    onUserOnline: (callback: (userId: number) => void) => void;
    onUserOffline: (callback: (userId: number) => void) => void;
}

// Get WebSocket URL from environment variables
const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

// Validate WebSocket URL
if (!SOCKET_URL) {
    console.error('❌ WebSocket URL is not set. Please set EXPO_PUBLIC_SOCKET_URL in your .env file');
}

const MAX_RETRY_ATTEMPTS = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second

export const useSocket = (): SocketHookReturn => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUsers, setTypingUsers] = useState<number[]>([]);
    const [currentMatchId, setCurrentMatchId] = useState<number | null>(null);

    const messageCallbacks = useRef<((message: Message) => void)[]>([]);
    const typingCallbacks = useRef<((data: TypingData) => void)[]>([]);
    const stopTypingCallbacks = useRef<((data: TypingData) => void)[]>([]);
    const onlineCallbacks = useRef<((userId: number) => void)[]>([]);
    const offlineCallbacks = useRef<((userId: number) => void)[]>([]);

    const connect = useCallback(async () => {
        try {
            if (!SOCKET_URL) {
                console.error('❌ Cannot connect: WebSocket URL is not set');
                return;
            }

            const token = await AsyncStorage.getItem('auth_token');
            if (!token) {
                console.error('❌ No authentication token found');
                return;
            }

            console.log('🔑 Connecting to WebSocket with token:', token ? '✅ Token found' : '❌ No token');
            console.log('🔗 WebSocket URL:', SOCKET_URL);

            // Disconnect existing socket if any
            if (socket) {
                console.log('🔌 Disconnecting existing socket...');
                socket.disconnect();
            }

            // Create socket connection with auth
            console.log('🔄 Creating socket connection...');
            const newSocket = io(SOCKET_URL, {
                auth: {
                    token: token
                },
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: MAX_RETRY_ATTEMPTS,
                reconnectionDelay: INITIAL_RETRY_DELAY,
                timeout: 20000,
                autoConnect: true,
                forceNew: true,
                withCredentials: true
            });
            
            // Enable debug logging
            if (__DEV__) {
                newSocket.onAny((event, ...args) => {
                    console.log(`🔌 [${event}]`, args);
                });
            }

            // Debug: Log socket instance
            console.log('🔌 Socket instance created:', newSocket ? '✅ Success' : '❌ Failed');

            // Connection events
            newSocket.on('connect', () => {
                console.log('✅ Socket connected - ID:', newSocket.id);
                console.log('🔌 Socket connected to:', SOCKET_URL);
                console.log('🔌 Socket auth:', newSocket.auth);
                setIsConnected(true);
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
                setTypingUsers([]);
            });

            newSocket.on('connect_error', (error: Error) => {
                console.error('❌ Socket connection error:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
                setIsConnected(false);
            });

            // Message events
            newSocket.on('new_message', (message: any) => {
                const content = typeof message.content === 'string' ? 
                    message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '') : 
                    '[binary content]';
                    
                console.log('📩 New message received:', {
                    id: message.id,
                    matchId: message.match_id || 'unknown',
                    senderId: message.sender_id || 'unknown',
                    content
                });
                
                // Convert to Message type before passing to callbacks
                const senderGender = message.sender?.gender || 'other';
                const typedMessage: Message = {
                    id: message.id,
                    content: message.content,
                    sender_id: message.sender_id,
                    sent_at: message.sent_at || new Date().toISOString(),
                    message_type: message.message_type || 'text',
                    // Add other required Message properties
                    sender: {
                        id: message.sender_id,
                        first_name: message.sender?.first_name || 'User',
                        gender: senderGender,
                        avatar_url: message.sender?.avatar_url,
                    },
                    // Add any other required Message properties
                    match_id: message.match_id,
                    read_at: message.read_at,
                    deleted_at: message.deleted_at,
                    first_name: message.sender?.first_name || 'User',
                    gender: senderGender,
                    dob: message.sender?.dob || '',
                    message_direction: 'received' // This will be updated based on current user
                };
                
                messageCallbacks.current.forEach(callback => callback(typedMessage));
            });

            newSocket.on('message_deleted', (data: { message_id: number }) => {
                console.log('Message deleted:', data);
                // Handle message deletion in UI
            });

            // Typing events
            newSocket.on('user_typing', (data: TypingData) => {
                console.log('User typing:', data);
                setTypingUsers(prev => [...prev, data.userId]);
                typingCallbacks.current.forEach(callback => callback(data));
            });

            newSocket.on('user_stop_typing', (data: TypingData) => {
                console.log('User stop typing:', data);
                setTypingUsers(prev => prev.filter(id => id !== data.userId));
                stopTypingCallbacks.current.forEach(callback => callback(data));
            });

            // Online/Offline events
            newSocket.on('user_online', (data: { userId: number }) => {
                console.log('User online:', data.userId);
                onlineCallbacks.current.forEach(callback => callback(data.userId));
            });

            newSocket.on('user_offline', (data: { userId: number }) => {
                console.log('User offline:', data.userId);
                offlineCallbacks.current.forEach(callback => callback(data.userId));
            });

            // Error handling
            newSocket.on('error', (error) => {
                console.error('Socket error:', error);
            });

            setSocket(newSocket);

        } catch (error) {
            console.error('Failed to connect socket:', error);
            throw error;
        }
    }, []);

    const disconnect = useCallback(() => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
            setIsConnected(false);
            setTypingUsers([]);
            setCurrentMatchId(null);
        }
    }, [socket]);

    const joinMatch = useCallback((matchId: number) => {
        console.log('🔵 Setting up WebSocket for match:', matchId);
        
        if (!socket || !isConnected) {
            console.log('🔌 Socket not connected, connecting first...');
            connect().then(() => {
                // Add a small delay to ensure the socket is properly connected
                setTimeout(() => {
                    if (socket && isConnected) {
                        console.log('🚪 Joining match room:', matchId);
                        socket.emit('join_match', { matchId });
                        setCurrentMatchId(matchId);
                    } else {
                        console.error('❌ Cannot join match: Socket not connected after connect()');
                    }
                }, 500);
            }).catch(error => {
                console.error('❌ Error connecting to WebSocket:', error);
            });
            return;
        }

        console.log('🚪 Joining match room:', matchId);
        socket.emit('join_match', { matchId });

        setCurrentMatchId(matchId);
    }, [socket, isConnected]);

    const leaveMatch = useCallback(() => {
        if (socket && isConnected) {
            socket.emit('leave_match');
            setCurrentMatchId(null);
            console.log('Left current match');
        }
    }, [socket, isConnected]);

    const sendMessage = useCallback((content: string, messageType: string = 'text') => {
        if (socket && isConnected && currentMatchId) {
            // Send via REST API instead of socket for persistence
            // Socket will receive the message via broadcast
            console.log('Sending message:', { content, messageType, matchId: currentMatchId });
        }
    }, [socket, isConnected, currentMatchId]);

    const startTyping = useCallback(() => {
        if (socket && isConnected && currentMatchId && !isTyping) {
            socket.emit('typing_start', currentMatchId);
            setIsTyping(true);
        }
    }, [socket, isConnected, currentMatchId, isTyping]);

    const stopTyping = useCallback(() => {
        if (socket && isConnected && currentMatchId && isTyping) {
            socket.emit('typing_stop', currentMatchId);
            setIsTyping(false);
        }
    }, [socket, isConnected, currentMatchId, isTyping]);

    // Event listeners
    const onNewMessage = useCallback((callback: (message: Message) => void) => {
        messageCallbacks.current.push(callback);
    }, []);

    const onUserTyping = useCallback((callback: (data: TypingData) => void) => {
        typingCallbacks.current.push(callback);
    }, []);

    const onUserStopTyping = useCallback((callback: (data: TypingData) => void) => {
        stopTypingCallbacks.current.push(callback);
    }, []);

    const onUserOnline = useCallback((callback: (userId: number) => void) => {
        onlineCallbacks.current.push(callback);
    }, []);

    const onUserOffline = useCallback((callback: (userId: number) => void) => {
        offlineCallbacks.current.push(callback);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
            messageCallbacks.current = [];
            typingCallbacks.current = [];
            stopTypingCallbacks.current = [];
            onlineCallbacks.current = [];
            offlineCallbacks.current = [];
        };
    }, [disconnect]);

    return {
        socket,
        isConnected,
        isTyping,
        typingUsers,
        connect,
        disconnect,
        joinMatch,
        leaveMatch,
        sendMessage,
        startTyping,
        stopTyping,
        onNewMessage,
        onUserTyping,
        onUserStopTyping,
        onUserOnline,
        onUserOffline,
    };
}; 