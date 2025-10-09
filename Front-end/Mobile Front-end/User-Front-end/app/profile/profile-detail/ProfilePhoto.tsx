import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { useTheme } from "react-native-paper";
import { IPhoto } from "@/types/photo";

interface ProfilePhotoProps {
  photos?: IPhoto[];
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ photos = [] }) => {
  const theme = useTheme();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handlePhotoNavigation = (direction: "left" | "right") => {
    if (direction === "left" && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    } else if (direction === "right" && currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  if (!photos || photos.length === 0) {
    return (
      <View
        style={{
          height: 400,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.surface,
        }}
      >
        <Text
          style={{
            color: theme.colors.onSurfaceVariant,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          No photos available
        </Text>
      </View>
    );
  }

  const getFullImageUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
    return `${BASE_URL}${url}`;
  };

  return (
    <View
      style={{
        height: 400,
        position: "relative",
        backgroundColor: theme.colors.background,
      }}
    >
      <Image
        source={{
          uri: getFullImageUrl(photos[currentPhotoIndex].url),
        }}
        style={{
          width: "100%",
          height: "100%",
          resizeMode: "cover",
          backgroundColor: theme.colors.surface,
        }}
      />
      {photos.length > 1 && (
        <View>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                height: "100%",
              }}
              onPress={() => handlePhotoNavigation("left")}
              disabled={currentPhotoIndex === 0}
            />
            <TouchableOpacity
              style={{
                flex: 1,
                height: "100%",
              }}
              onPress={() => handlePhotoNavigation("right")}
              disabled={currentPhotoIndex === photos.length - 1}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
              zIndex: 2,
            }}
          >
            {photos.map((_, index) => (
              <View
                key={index}
                style={{
                  height: 4,
                  width: 24,
                  marginHorizontal: 2,
                  borderRadius: theme.roundness,
                  backgroundColor:
                    index === currentPhotoIndex
                      ? theme.colors.primary
                      : theme.colors.onSurfaceDisabled,
                }}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};
