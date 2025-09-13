import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
    id: number;
    content: string;
    sender_id: number;
    sent_at: string;
    read_at?: string;
    message_type: 'text' | 'image' | 'video' | 'file' | 'audio';
    sender: {
        first_name: string;
        gender: string;
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

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:5000';

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
            // Get auth token from storage
            const token = await AsyncStorage.getItem('authToken');

            if (!token) {
                throw new Error('No authentication token found');
            }

            // Create socket connection with auth
            const newSocket = io(SOCKET_URL, {
                auth: {
                    token: token
                },
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                timeout: 20000,
            });

            // Connection events
            newSocket.on('connect', () => {
                console.log('Socket connected');
                setIsConnected(true);
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
                setTypingUsers([]);
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setIsConnected(false);
            });

            // Message events
            newSocket.on('new_message', (message: Message) => {
                console.log('New message received:', message);
                messageCallbacks.current.forEach(callback => callback(message));
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
        if (socket && isConnected) {
            socket.emit('join_match', matchId);
            setCurrentMatchId(matchId);
            console.log('Joined match:', matchId);
        }
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