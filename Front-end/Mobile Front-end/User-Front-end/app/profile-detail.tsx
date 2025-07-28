import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Colors } from '@/constants/Colors';

const USER = {
    name: 'Linh',
    age: 24,
    bio: 'Yêu mèo, thích du lịch, thích cà phê cuối tuần.',
    photos: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop',
    ],
    hobbies: ['Đọc sách', 'Du lịch', 'Âm nhạc', 'Thể thao'],
};

export default function ProfileDetailScreen() {
    return (
        <ScrollView style={styles.container}>
            <FlatList
                data={USER.photos}
                horizontal
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={styles.photo} />
                )}
                style={styles.photoList}
                showsHorizontalScrollIndicator={false}
            />
            <View style={styles.infoBox}>
                <Text style={styles.name}>{USER.name}, {USER.age}</Text>
                <Text style={styles.bio}>{USER.bio}</Text>
                <View style={styles.hobbyGroup}>
                    {USER.hobbies.map(hobby => (
                        <View key={hobby} style={styles.hobbyBadge}>
                            <Text style={styles.hobbyText}>{hobby}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity style={[styles.actionBtn, styles.pass]}>
                        <Text style={styles.actionIcon}>❌</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.superlike]}>
                        <Text style={styles.actionIcon}>⭐</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.like]}>
                        <Text style={styles.actionIcon}>❤️</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    photoList: {
        minHeight: 320,
        maxHeight: 320,
        marginBottom: 12,
    },
    photo: {
        width: 260,
        height: 320,
        borderRadius: 24,
        marginRight: 16,
        backgroundColor: Colors.light.card,
    },
    infoBox: {
        padding: 24,
        alignItems: 'center',
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
        marginBottom: 16,
        textAlign: 'center',
    },
    hobbyGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
        justifyContent: 'center',
    },
    hobbyBadge: {
        backgroundColor: Colors.light.accent,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginBottom: 8,
    },
    hobbyText: {
        color: Colors.light.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 8,
    },
    actionBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.accent,
        elevation: 2,
    },
    actionIcon: {
        fontSize: 28,
    },
    pass: {
        backgroundColor: '#F3E8FF',
    },
    superlike: {
        backgroundColor: '#C4B5FD',
    },
    like: {
        backgroundColor: '#7C3AED',
    },
}); 