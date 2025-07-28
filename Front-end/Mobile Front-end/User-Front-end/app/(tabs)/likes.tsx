import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { Colors } from '@/constants/Colors';

const USERS = [
    { id: '1', name: 'Linh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
    { id: '2', name: 'Hà', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop' },
    { id: '3', name: 'Minh', avatar: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=200&h=200&fit=crop' },
    { id: '4', name: 'Lan', avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=200&h=200&fit=crop' },
    { id: '5', name: 'Hương', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop' },
    { id: '6', name: 'Tú', avatar: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=200&h=200&fit=crop' },
];

export default function LikesScreen() {
    // Đổi isGold thành true để xem giao diện Gold/Platinum
    const [isGold, setIsGold] = useState(false);

    const renderItem = ({ item }: { item: typeof USERS[0] }) => (
        <View style={styles.avatarBox}>
            <Image
                source={{ uri: item.avatar }}
                style={[styles.avatar, !isGold && styles.avatarBlur]}
                blurRadius={isGold ? 0 : 12}
            />
            <Text style={styles.name}>{isGold ? item.name : 'Ẩn'}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ai đã thích bạn?</Text>
            <FlatList
                data={USERS}
                numColumns={3}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.grid}
            />
            {!isGold && (
                <View style={styles.paywall}>
                    <Text style={styles.paywallTitle}>Nâng cấp lên Gold để xem ai đã thích bạn!</Text>
                    <TouchableOpacity style={styles.upgradeBtn} onPress={() => setIsGold(true)}>
                        <Text style={styles.upgradeText}>Nâng cấp ngay</Text>
                    </TouchableOpacity>
                </View>
            )}
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
        marginBottom: 16,
        textAlign: 'center',
    },
    grid: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarBox: {
        alignItems: 'center',
        margin: 8,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 6,
        backgroundColor: Colors.light.card,
    },
    avatarBlur: {
        opacity: 0.5,
    },
    name: {
        fontSize: 14,
        color: Colors.light.text,
        fontWeight: '500',
    },
    paywall: {
        backgroundColor: Colors.light.accent,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginTop: 8,
    },
    paywallTitle: {
        fontSize: 16,
        color: Colors.light.primary,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
    },
    upgradeBtn: {
        backgroundColor: Colors.light.primary,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 24,
    },
    upgradeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 