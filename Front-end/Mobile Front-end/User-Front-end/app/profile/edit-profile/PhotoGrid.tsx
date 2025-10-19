import React from "react";
import { View, Image } from "react-native";
import {
  Card,
  IconButton,
  Text,
  ActivityIndicator,
  TouchableRipple,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

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

const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  maxPhotos = 5,
  onAddPhoto,
  onDeletePhoto,
  isUploading = false,
}) => {
  return (
    <View style={{ marginTop: 10 }}>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        {photos.map((photo, index) => (
          <Card
            key={index}
            style={{
              width: "30%",
              aspectRatio: 1,
              marginRight: "3%",
              marginBottom: 10,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: photo.url }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
                backgroundColor: "#F0F0F0",
              }}
            />
            <IconButton
              icon="close-circle"
              iconColor="#EF4444"
              size={24}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                margin: 0,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
              onPress={() => onDeletePhoto(index)}
            />
          </Card>
        ))}
        {photos.length < maxPhotos && (
          <TouchableRipple
            onPress={onAddPhoto}
            borderless
            style={{
              width: "30%",
              aspectRatio: 1,
              marginRight: "3%",
              marginBottom: 10,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <Card
              mode="outlined"
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#A78BFA",
                borderStyle: "dashed",
                backgroundColor: "#F5F3FF",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Card.Content
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 8,
                }}
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color="#7C3AED" />
                ) : (
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: "#8B5CF6",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <Ionicons name="add" size={28} color="#fff" />
                    </View>
                    <Text
                      variant="bodySmall"
                      style={{
                        color: "#7C3AED",
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      Add Photo
                    </Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          </TouchableRipple>
        )}
      </View>
      {photos.length === 0 && (
        <Text
          variant="bodyMedium"
          style={{
            fontSize: 14,
            color: "#9B9B9B",
            textAlign: "center",
            marginTop: 10,
            fontStyle: "italic",
          }}
        >
          Add photos to get more matches
        </Text>
      )}
    </View>
  );
};

export default PhotoGrid;