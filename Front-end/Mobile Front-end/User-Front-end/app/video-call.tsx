import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image, Animated, Easing } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useLocalSearchParams } from "expo-router";

export default function CallScreen() {
  const { roomID, userID, userName, matchId, otherUserId } = useLocalSearchParams();
  const domain = "hieu-videoconf-002.app.100ms.live";
  const roomIdOf100ms = "irt-zufj-wgc";
  const meetingUrl = `https://${domain}/meeting/${roomIdOf100ms}`;

  const spinValue = new Animated.Value(0);
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await WebBrowser.openBrowserAsync(meetingUrl, {
          showTitle: true,
          toolbarColor: "#8b5cf6",
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        });
      } catch (error) {
        console.warn("Error opening browser:", error);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/2910/2910768.png",
          }}
          style={styles.logo}
        />
      </Animated.View>

      <Text style={styles.title}>Preparing your meeting...</Text>
      <Text style={styles.subtitle}>Please wait a few seconds</Text>

      <ActivityIndicator size="large" color="#8b5cf6" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
    tintColor: "#8b5cf6",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 24,
  },
  spinner: {
    marginTop: 10,
  },
});
