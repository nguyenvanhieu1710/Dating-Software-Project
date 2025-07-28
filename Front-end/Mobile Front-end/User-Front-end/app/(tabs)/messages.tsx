import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';

const MATCHES = [
    { id: '1', name: 'Linh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
    { id: '2', name: 'Hà', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop' },
    { id: '3', name: 'Minh', avatar: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=100&h=100&fit=crop' },
    { id: '4', name: 'Lan', avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop' },
];

const CHATS = [
    { id: '1', name: 'Linh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', lastMsg: 'Chào bạn!', time: '2 phút trước' },
    { id: '2', name: 'Hà', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', lastMsg: 'Hẹn gặp cuối tuần nhé!', time: '1 giờ trước' },
    { id: '3', name: 'Minh', avatar: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=100&h=100&fit=crop', lastMsg: 'Bạn thích nghe nhạc gì?', time: '3 giờ trước' },
];

export default function MessagesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tin nhắn</Text>
            <Text style={styles.sectionTitle}>Tương hợp mới</Text>
            <FlatList
                data={MATCHES}
                horizontal
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.matchBox}>
                        <Image source={{ uri: item.avatar }} style={styles.matchAvatar} />
                        <Text style={styles.matchName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                style={styles.matchList}
                showsHorizontalScrollIndicator={false}
            />
            <Text style={styles.sectionTitle}>Đoạn chat</Text>
            <ScrollView style={styles.chatList}>
                {CHATS.map(chat => (
                    <TouchableOpacity key={chat.id} style={styles.chatBox}>
                        <Image source={{ uri: chat.avatar }} style={styles.chatAvatar} />
                        <View style={styles.chatInfo}>
                            <Text style={styles.chatName}>{chat.name}</Text>
                            <Text style={styles.chatMsg}>{chat.lastMsg}</Text>
                        </View>
                        <Text style={styles.chatTime}>{chat.time}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.icon,
        marginTop: 16,
        marginBottom: 8,
    },
    matchList: {
        minHeight: 110,
    },
    matchBox: {
        alignItems: 'center',
        marginRight: 16,
    },
    matchAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginBottom: 6,
        backgroundColor: Colors.light.card,
    },
    matchName: {
        fontSize: 13,
        color: Colors.light.text,
        fontWeight: '500',
    },
    chatList: {
        marginTop: 8,
    },
    chatBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        elevation: 1,
    },
    chatAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        backgroundColor: Colors.light.accent,
    },
    chatInfo: {
        flex: 1,
    },
    chatName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.primary,
    },
    chatMsg: {
        fontSize: 14,
        color: Colors.light.text,
    },
    chatTime: {
        fontSize: 12,
        color: Colors.light.icon,
        marginLeft: 8,
    },
}); 