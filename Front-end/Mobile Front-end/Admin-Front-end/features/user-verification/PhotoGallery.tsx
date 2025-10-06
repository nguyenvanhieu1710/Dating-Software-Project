import * as React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { useTheme, IconButton } from "react-native-paper";

type Props = {
  photos: string[];
};

export default function PhotoGallery({ photos }: Props) {
  const theme = useTheme();
  const [selectedPhoto, setSelectedPhoto] = React.useState<string | null>(null);

  return (
    <>
      <View
        style={{
          backgroundColor: theme.colors.surfaceVariant,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: theme.colors.onSurface,
            marginBottom: 12,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          Evidence Photos ({photos.length})
        </Text>

        {photos.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              minHeight: 100,
            }}
          >
            {photos.map((photo, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: "100%",
                  aspectRatio: 1,
                  borderRadius: 8,
                  overflow: "hidden",
                  backgroundColor: theme.colors.surface,
                }}
                onPress={() => setSelectedPhoto(photo)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: photo }}
                  style={{ width: "100%", height: "100%", resizeMode: "cover" }}
                />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View
            style={{
              padding: 20,
              alignItems: "center",
              backgroundColor: theme.colors.surface,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.onSurfaceVariant,
                textAlign: "center",
                fontFamily: theme.fonts.bodyLarge.fontFamily,
              }}
            >
              No photos available
            </Text>
          </View>
        )}
      </View>

      {/* Full Screen Photo Modal */}
      <Modal
        visible={selectedPhoto !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            activeOpacity={1}
            onPress={() => setSelectedPhoto(null)}
          >
            {selectedPhoto && (
              <Image
                source={{ uri: selectedPhoto }}
                style={{
                  width: Dimensions.get("window").width * 0.95,
                  height: Dimensions.get("window").height * 0.8,
                  resizeMode: "contain",
                }}
              />
            )}
          </TouchableOpacity>
          <IconButton
            icon="close"
            size={28}
            iconColor="#fff"
            style={{
              position: "absolute",
              top: 40,
              right: 20,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            onPress={() => setSelectedPhoto(null)}
          />
        </View>
      </Modal>
    </>
  );
}
