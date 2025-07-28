import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';

const USER = {
    name: 'Bạn',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
};
const MATCHED = {
    name: 'Linh',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
};

export default function MatchScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>It's a Match!</Text>
            <View style={styles.avatarsBox}>
                <Image source={{ uri: USER.avatar }} style={[styles.avatar, styles.avatarLeft]} />
                <View style={styles.heartBox}>
                    <Text style={styles.heart}>💜</Text>
                </View>
                <Image source={{ uri: MATCHED.avatar }} style={[styles.avatar, styles.avatarRight]} />
            </View>
            <Text style={styles.subtitle}>Bạn và {MATCHED.name} đã thích nhau!</Text>
            <View style={styles.actions}>
                <TouchableOpacity style={[styles.actionBtn, styles.msgBtn]}>
                    <Text style={styles.actionText}>Gửi tin nhắn</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionText}>Tiếp tục vuốt</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
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
        marginHorizontal: 4,
        elevation: 4,
    },
    heart: {
        fontSize: 32,
        color: '#fff',
    },
    subtitle: {
        fontSize: 18,
        color: Colors.light.text,
        marginBottom: 32,
        textAlign: 'center',
    },
    actions: {
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'center',
    },
    actionBtn: {
        backgroundColor: Colors.light.accent,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 24,
        alignItems: 'center',
    },
    msgBtn: {
        backgroundColor: Colors.light.primary,
    },
    actionText: {
        color: Colors.light.primary,
        fontSize: 16,
        fontWeight: '600',
    },
}); 