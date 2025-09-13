import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const USERS = [
    { id: '1', name: 'Linh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
    { id: '2', name: 'Hà', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop' },
    { id: '3', name: 'Minh', avatar: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=200&h=200&fit=crop' },
    { id: '4', name: 'Lan', avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=200&h=200&fit=crop' },
    { id: '5', name: 'Hương', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop' },
    { id: '6', name: 'Tú', avatar: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=200&h=200&fit=crop' },
];

export default function LikesScreen() {
    const [isGold, setIsGold] = useState(false);

    const handleSeeWhoLikesYou = () => {
        router.push('/subscriptions');
    };

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
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF9FB" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="heart" size={24} color="#6D28D9" />
                        <Text style={styles.logoText}>Likes</Text>
                    </View>
                </View>
                {/* Tabs */}
                <View style={styles.filterContainer}>
                    <Text style={styles.likesCount}>5 likes</Text>
                </View>
                {/* Filter */}
                <View style={styles.filterContainer}>
                    <View style={styles.filterButton}>
                        <Ionicons name="filter" size={16} color="#7C3AED" />
                        <Text style={styles.filterText}>Filters</Text>
                    </View>
                    <View style={styles.filterPill}>
                        <Ionicons name="location" size={14} color="#7C3AED" />
                        <Text style={styles.filterPillText}>Nearby</Text>
                    </View>
                    <View style={styles.filterPill}>
                        <Ionicons name="document-text" size={14} color="#7C3AED" />
                        <Text style={styles.filterPillText}>With Bio</Text>
                    </View>
                </View>
                {/* Upgrade Text */}
                {!isGold && (
                    <View style={styles.paywall}>
                        <Text style={styles.paywallTitle}>Upgrade to Gold to see people who have already liked you.</Text>
                    </View>
                )}
                <FlatList
                    data={USERS}
                    numColumns={3}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.grid}
                />
                <TouchableOpacity style={styles.upgradeBtn} onPress={() => handleSeeWhoLikesYou()}>
                    <Text style={styles.upgradeText}>See Who Likes You</Text>
                </TouchableOpacity>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#6D28D9',
        marginLeft: 8,
    },
    grid: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    avatarBox: {
        alignItems: 'center',
        margin: 8,
        width: 100,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 8,
        backgroundColor: '#F3E8FF',
        borderWidth: 2,
        borderColor: '#EDE9FE',
    },
    avatarBlur: {
        opacity: 0.7,
    },
    name: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '600',
        textAlign: 'center',
    },
    paywall: {
        backgroundColor: '#F5F3FF',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        marginVertical: 16,
        borderWidth: 1,
        borderColor: '#EDE9FE',
    },
    paywallTitle: {
        fontSize: 16,
        color: '#6D28D9',
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
        lineHeight: 22,
    },
    upgradeBtn: {
        backgroundColor: '#7C3AED',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 30,
        elevation: 3,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        marginTop: 8,
        marginBottom: 24,
    },
    upgradeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        paddingHorizontal: 4,
        flexWrap: 'wrap',
        gap: 8,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3E8FF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E9D5FF',
        marginRight: 8,
    },
    filterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(124, 58, 237, 0.2)',
    },
    filterText: {
        color: '#7C3AED',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    filterPillText: {
        color: '#7C3AED',
        fontSize: 13,
        fontWeight: '500',
        marginLeft: 4,
    },
    likesCount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    topPicks: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },
});