import React, { useRef, useImperativeHandle } from "react";
import {
  Animated,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IconButton, Text, useTheme } from "react-native-paper";
import { User } from "@/services/userApi";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const SWIPE_THRESHOLD = screenWidth * 0.25;

export type SwipeCardHandle = {
  swipe: (direction: "left" | "right" | "superlike") => void;
};

type Props = {
  user: User;
  photoIndex: number;
  onPhotoNav: (dir: "left" | "right") => void;
  onOpenProfile: () => void;
  onSwiped: (direction: "left" | "right" | "superlike") => void; // called after animation
};

const SwipeCard = React.forwardRef<SwipeCardHandle, Props>(
  ({ user, photoIndex, onPhotoNav, onOpenProfile, onSwiped }, ref) => {
    const theme = useTheme();
    const swipeAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // expose imperative swipe function so parent buttons can trigger animation
    useImperativeHandle(ref, () => ({
      swipe: (direction: "left" | "right" | "superlike") => {
        performSwipe(direction);
      },
    }));

    const onGestureEvent = Animated.event(
      [{ nativeEvent: { translationX: swipeAnim } }],
      { useNativeDriver: true }
    );

    const onHandlerStateChange = (event: any) => {
      if (event.nativeEvent.state === State.END) {
        const { translationX } = event.nativeEvent;
        if (Math.abs(translationX) > SWIPE_THRESHOLD) {
          const direction = translationX > 0 ? "right" : "left";
          performSwipe(direction);
        } else {
          Animated.spring(swipeAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      }
    };

    const performSwipe = (direction: "left" | "right" | "superlike") => {
      const targetValue =
        direction === "left" ? -screenWidth * 1.5 : screenWidth * 1.5;
      const rotateValue = direction === "left" ? -30 : 30;

      Animated.parallel([
        Animated.timing(swipeAnim, {
          toValue: targetValue,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: rotateValue,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // reset values for next card
        swipeAnim.setValue(0);
        rotateAnim.setValue(0);
        onSwiped(direction);
      });
    };
    const rotate = rotateAnim.interpolate({
      inputRange: [-30, 0, 30],
      outputRange: ["-30deg", "0deg", "30deg"],
    });

    return (
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={{
            width: screenWidth,
            height: screenHeight - 180,
            borderRadius: 20,
            overflow: "hidden",
            transform: [{ translateX: swipeAnim }, { rotate }],
            backgroundColor: "#000",
          }}
        >
          <Image
            source={{ uri: user?.photos?.[photoIndex] }}
            style={{ width: "100%", height: "100%", resizeMode: "cover" }}
          />

          {/* Photo progress */}
          <View
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              right: 20,
              flexDirection: "row",
              zIndex: 5,
            }}
          >
            {(user.photos || []).map((_, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: 3,
                  marginHorizontal: 2,
                  borderRadius: 2,
                  backgroundColor:
                    i === photoIndex
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </View>

          {/* Photo nav (left/right halves) */}
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
              style={{ flex: 1 }}
              onPress={() => onPhotoNav("left")}
            />
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => onPhotoNav("right")}
            />
          </View>

          {/* User info overlay */}
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 70,
              padding: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#8B5CF6",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  alignSelf: "flex-start",
                  marginBottom: 8,
                }}
              >
                <Ionicons name="location" size={12} color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "600",
                    marginLeft: 6,
                    fontFamily: theme.fonts.bodyLarge.fontFamily,
                  }}
                >
                  Near you
                </Text>
              </View>

              <Text
                style={{
                  color: "#fff",
                  fontSize: 24,
                  fontWeight: "700",
                  marginBottom: 4,
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                }}
              >
                {user.name}, {user.age}
              </Text>
              <Text
                style={{
                  color: "#fff",
                  opacity: 0.95,
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                }}
              >
                {user.bio}
              </Text>
            </View>

            <IconButton
              icon={() => <Ionicons name="arrow-up" size={20} color="#000" />}
              containerColor="#fff"
              onPress={onOpenProfile}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginLeft: 12,
              }}
            />
          </View>
        </Animated.View>
      </PanGestureHandler>
    );
  }
);
export default SwipeCard;
