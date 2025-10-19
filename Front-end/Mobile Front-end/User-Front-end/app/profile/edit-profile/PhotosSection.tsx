import React from "react";
import { Card, Text, useTheme } from "react-native-paper";
import PhotoGrid from "./PhotoGrid";

interface PhotoItem {
  id: number;
  url: string;
}

interface PhotosSectionProps {
  photos: PhotoItem[];
  maxPhotos?: number;
  onAddPhoto: () => void;
  onDeletePhoto: (index: number) => void;
  isUploading?: boolean;
}

const PhotosSection: React.FC<PhotosSectionProps> = ({
  photos,
  maxPhotos = 5,
  onAddPhoto,
  onDeletePhoto,
  isUploading = false,
}) => {
  const theme = useTheme();
  return (
    <Card
      style={{
        marginBottom: 12,
        backgroundColor: "#FFFFFF",
      }}
      mode="elevated"
    >
      <Card.Content>
        <Text
          variant="titleMedium"
          style={{
            fontWeight: "bold",
            marginBottom: 12,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Photos ({photos.length}/{maxPhotos})
        </Text>
        <PhotoGrid
          photos={photos}
          maxPhotos={maxPhotos}
          onAddPhoto={onAddPhoto}
          onDeletePhoto={onDeletePhoto}
          isUploading={isUploading}
        />
      </Card.Content>
    </Card>
  );
};

export default PhotosSection;