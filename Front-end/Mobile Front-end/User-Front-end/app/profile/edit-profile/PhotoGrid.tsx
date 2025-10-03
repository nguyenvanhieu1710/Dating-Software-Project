import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card, IconButton, Text, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface PhotoItem {
    id: number;
    url: string;
}

interface PhotoGridProps {
    photos: PhotoItem[];
    maxPhotos?: number;
    onAddPhoto: () => void;
    onDeletePhoto: (index: number) => void;
    isUploading?: boolean;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
    photos,
    maxPhotos = 5,
    onAddPhoto,
    onDeletePhoto,
    isUploading = false
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {photos.map((photo, index) => (
                    <Card key={index} style={styles.photoCard}>
                        <Image
                            source={{ uri: photo.url }}
                            style={styles.photoImage}
                            onError={(error) => {
                                console.error('Image load error:', error);
                            }}
                        />
                        <IconButton
                            icon="close-circle"
                            iconColor="#EF4444"
                            size={24}
                            style={styles.deleteButton}
                            onPress={() => onDeletePhoto(index)}
                        />
                    </Card>
                ))}
                {photos.length < maxPhotos && (
                    <Card
                        style={styles.addCard}
                        onPress={onAddPhoto}
                        mode="outlined"
                    >
                        <Card.Content style={styles.addCardContent}>
                            {isUploading ? (
                                <ActivityIndicator size="small" color="#8B5CF6" />
                            ) : (
                                <>
                                    <Ionicons name="add" size={32} color="#8B5CF6" />
                                    <Text variant="bodySmall" style={styles.addText}>
                                        Add Photo
                                    </Text>
                                </>
                            )}
                        </Card.Content>
                    </Card>
                )}
            </View>
            {photos.length === 0 && (
                <Text variant="bodyMedium" style={styles.hint}>
                    Add photos to get more matches
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    photoCard: {
        width: '30%',
        aspectRatio: 1,
        marginRight: '3%',
        marginBottom: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    photoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        backgroundColor: '#F0F0F0',
    },
    deleteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    addCard: {
        width: '30%',
        aspectRatio: 1,
        marginRight: '3%',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#8B5CF6',
        borderStyle: 'dashed',
        backgroundColor: '#F8F4FF',
    },
    addCardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addText: {
        color: '#8B5CF6',
        marginTop: 4,
        textAlign: 'center',
    },
    hint: {
        fontSize: 14,
        color: '#9B9B9B',
        textAlign: 'center',
        marginTop: 10,
        fontStyle: 'italic',
    },
});