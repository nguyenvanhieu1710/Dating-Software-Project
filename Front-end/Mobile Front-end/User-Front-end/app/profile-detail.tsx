import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

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
    const router = useRouter();
    const handleHome = () => {
        router.push('/');
    };
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF9FB" />
            <View style={{ flex: 1 }}>
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.name}>{USER.name}, {USER.age}</Text>
                        </View>
                        <TouchableOpacity onPress={handleHome}>
                            <Ionicons name="arrow-down" size={24} color="#6D28D9" />
                        </TouchableOpacity>
                    </View>
                    {/* Photo */}
                    <View style={styles.photoContainer}>
                        <Image source={{ uri: USER.photos[0] }} style={styles.photo} />
                        {/* Photo Progress Indicator */}
                        <View style={styles.photoProgressContainer}>
                            {USER.photos.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.photoProgressBar,
                                        index === 0 && styles.photoProgressActive
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
                    {/* Info Box */}
                    <View style={styles.infoBox}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>About me</Text>
                            <Text style={styles.aboutMe}>{USER.bio}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Hobbies</Text>
                            <View style={styles.hobbyGroup}>
                                {USER.hobbies.map((hobby, index) => (
                                    <View key={index} style={styles.tag}>
                                        <Text style={styles.tagText}>{hobby}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Details</Text>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Age</Text>
                                <Text style={styles.detailValue}>{USER.age}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Name</Text>
                                <Text style={styles.detailValue}>{USER.name}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Fixed Action Buttons */}
                <View style={styles.actionsContainer}>
                    <View style={styles.actions}>
                        <TouchableOpacity style={[styles.actionBtn, styles.pass]}>
                            <Ionicons name="close" size={28} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, styles.superlike]}>
                            <Ionicons name="star" size={28} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, styles.like]}>
                            <Ionicons name="heart" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6D28D9',
        marginBottom: 8,
        textAlign: 'center',
    },
    photoContainer: {
        height: 400,
        position: 'relative',
    },
    photo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    photoProgressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        zIndex: 2,
    },
    photoProgressBar: {
        height: 4,
        width: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 2,
        borderRadius: 2,
    },
    photoProgressActive: {
        backgroundColor: '#FFF',
    },
    infoBox: {
        padding: 20,
        backgroundColor: '#FFF',
        margin: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    section: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3E8FF',
        paddingBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#6D28D9',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionContent: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 22,
    },
    tag: {
        backgroundColor: '#F3E8FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        color: '#6D28D9',
        fontSize: 13,
        fontWeight: '500',
    },
    actionsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
        paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    actionBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    pass: {
        backgroundColor: '#FF6B6B',
    },
    superlike: {
        backgroundColor: '#4CC9F0',
    },
    like: {
        backgroundColor: '#7C3AED',
    },
    aboutMe: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 22,
        marginBottom: 16,
    },
    hobbyGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
        justifyContent: 'center',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailLabel: {
        color: '#6B7280',
        fontSize: 14,
        width: '40%',
    },
    detailValue: {
        color: '#1F2937',
        fontSize: 14,
        fontWeight: '500',
        width: '55%',
        textAlign: 'right',
    },
});