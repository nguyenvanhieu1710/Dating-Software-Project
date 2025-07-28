import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

const MAX_PHOTOS = 6;
const MIN_PHOTOS = 2;

export default function ProfilePhotosScreen() {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);

    // Dummy function for demo (thay bằng image picker thực tế nếu cần)
    const handleAddPhoto = () => {
        if (photos.length >= MAX_PHOTOS) return;
        setPhotos([...photos, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop']);
    };

    const handleRemovePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    const handleContinue = () => {
        if (photos.length < MIN_PHOTOS) {
            Alert.alert('Cần ít nhất 2 ảnh', 'Vui lòng chọn tối thiểu 2 ảnh để tiếp tục.');
            return;
        }
        router.push('profile-basic');
    };

    // Đổi vị trí ảnh (kéo thả đơn giản)
    const movePhoto = (from: number, to: number) => {
        if (to < 0 || to >= photos.length) return;
        const newPhotos = [...photos];
        const [moved] = newPhotos.splice(from, 1);
        newPhotos.splice(to, 0, moved);
        setPhotos(newPhotos);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tải lên ảnh đại diện</Text>
            <Text style={styles.subtitle}>Chọn ít nhất 2 ảnh để hồ sơ của bạn hấp dẫn hơn!</Text>
            <FlatList
                data={photos}
                horizontal
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.photoBox}>
                        <Image source={{ uri: item }} style={styles.photo} />
                        <View style={styles.photoActions}>
                            <TouchableOpacity onPress={() => movePhoto(index, index - 1)} disabled={index === 0}>
                                <Text style={styles.actionText}>{'←'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => movePhoto(index, index + 1)} disabled={index === photos.length - 1}>
                                <Text style={styles.actionText}>{'→'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleRemovePhoto(index)}>
                                <Text style={[styles.actionText, { color: Colors.light.error }]}>X</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListFooterComponent={
                    photos.length < MAX_PHOTOS ? (
                        <TouchableOpacity style={styles.addBox} onPress={handleAddPhoto}>
                            <Text style={styles.addText}>+</Text>
                        </TouchableOpacity>
                    ) : null
                }
                style={styles.photoList}
                showsHorizontalScrollIndicator={false}
            />
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
                <Text style={styles.buttonText}>Tiếp tục</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: Colors.light.icon,
        marginBottom: 16,
        textAlign: 'center',
    },
    photoList: {
        marginBottom: 24,
        minHeight: 140,
    },
    photoBox: {
        marginRight: 12,
        alignItems: 'center',
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 16,
        marginBottom: 8,
        backgroundColor: Colors.light.card,
    },
    photoActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionText: {
        fontSize: 18,
        color: Colors.light.primary,
        marginHorizontal: 4,
    },
    addBox: {
        width: 100,
        height: 100,
        borderRadius: 16,
        backgroundColor: Colors.light.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    addText: {
        fontSize: 40,
        color: Colors.light.primary,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: Colors.light.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 