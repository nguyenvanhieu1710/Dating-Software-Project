import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';

const USER = {
    name: 'Bạn',
    age: 25,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Yêu mèo, thích du lịch, thích cà phê cuối tuần.',
    isGold: false,
};

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.avatarBox}>
                <Image source={{ uri: USER.avatar }} style={styles.avatar} />
                {USER.isGold && <Text style={styles.goldBadge}>GOLD</Text>}
            </View>
            <Text style={styles.name}>{USER.name}, {USER.age}</Text>
            <Text style={styles.bio}>{USER.bio}</Text>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionText}>Chỉnh sửa hồ sơ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionText}>Cài đặt</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.upgradeBtn]}>
                    <Text style={styles.upgradeText}>Nâng cấp tài khoản</Text>
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
        padding: 24,
    },
    avatarBox: {
        marginTop: 32,
        marginBottom: 16,
        alignItems: 'center',
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.light.card,
    },
    goldBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFD700',
        color: '#fff',
        fontWeight: 'bold',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 13,
        elevation: 2,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    bio: {
        fontSize: 15,
        color: Colors.light.text,
        marginBottom: 24,
        textAlign: 'center',
    },
    actions: {
        width: '100%',
        marginTop: 16,
        gap: 12,
    },
    actionBtn: {
        backgroundColor: Colors.light.accent,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 8,
    },
    actionText: {
        color: Colors.light.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    upgradeBtn: {
        backgroundColor: Colors.light.primary,
    },
    upgradeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 