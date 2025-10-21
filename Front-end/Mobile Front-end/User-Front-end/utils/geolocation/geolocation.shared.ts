import { Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";
import { PermissionsAndroid } from "react-native";
import * as Location from "expo-location";
import { Buffer } from "buffer";

export interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

/**
 * Requests location permission based on the platform
 * @returns Promise<boolean> - Whether location permission was granted
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  // Web implementation using react-native-geolocation-service
  if (Platform.OS === "web") {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported in this browser");
      return false;
    }
    return true;
  }

  // Expo implementation for iOS and Android
  if (Platform.OS === "ios" || Platform.OS === "android") {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error requesting location permission with Expo:", error);
      return false;
    }
  }

  // Handle unsupported platforms (e.g., windows, macos)
  console.warn(`Location services not supported on platform: ${Platform.OS}`);
  return false;
};

/**
 * Gets current device location
 * @returns Promise<UserLocation> - Current device coordinates
 */
export const getCurrentLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    // Web implementation using react-native-geolocation-service
    if (Platform.OS === "web") {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
    // Expo implementation for iOS and Android
    else if (Platform.OS === "ios" || Platform.OS === "android") {
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
      })
        .then((location) => {
          resolve({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        })
        .catch((err) => reject(err));
    }
    // Handle unsupported platforms (e.g., windows, macos)
    else {
      reject(
        new Error(`Location services not supported on platform: ${Platform.OS}`)
      );
    }
  });
};

/**
 * Converts latitude & longitude to a human-readable address
 */
export const getReadableLocation = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const [reverseGeocode] = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (!reverseGeocode) return "Unknown location";

    const { name, street, district, city, region, country } = reverseGeocode;
    return `${name || street || ""}, ${district || city || region || ""}, ${
      country || ""
    }`
      .replace(/,\s*,/g, ",")
      .trim();
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return "Unknown location";
  }
};

/**
 * One-stop function: Get current coordinates AND readable address
 */
export const getCurrentReadableLocation = async (): Promise<UserLocation> => {
  try {
    const granted = await requestLocationPermission();
    if (!granted) throw new Error("Location permission not granted");

    const coords = await getCurrentLocation();
    const address = await getReadableLocation(
      coords.latitude,
      coords.longitude
    );

    return { ...coords, address };
  } catch (error) {
    console.error("Error getting readable location:", error);
    throw error;
  }
};

/**
 * Parses a GeoJSON Point string to extract latitude and longitude
 * @param geoJSON - GeoJSON Point string (e.g., "0101000020E6100000096F0F4240AA5A40946B0A6476862540")
 * @returns Object with latitude and longitude, or null if parsing fails
 */
export const parseGeoJSONLocation = (geoJSON: string): { latitude: number; longitude: number } | null => {
  try {
    // GeoJSON Point format: 0101000020E6100000<longitude><latitude>
    // Extract longitude and latitude from the hex string
    // Note: This is a simplified parsing for WKB (Well-Known Binary) format
    // In a real app, consider using a library like `wellknown` or `turf` for robust parsing
    const hex = geoJSON.replace(/^0101000020E6100000/, '');
    if (hex.length < 32) return null;

    // Extract 8 bytes for longitude and 8 bytes for latitude (little-endian double)
    const lonHex = hex.slice(0, 16);
    const latHex = hex.slice(16, 32);

    // Convert hex to Buffer and then to double
    const lonBuffer = Buffer.from(lonHex, 'hex');
    const latBuffer = Buffer.from(latHex, 'hex');
    
    const longitude = lonBuffer.readDoubleLE(0);
    const latitude = latBuffer.readDoubleLE(0);

    return { latitude, longitude };
  } catch (error) {
    console.error("Error parsing GeoJSON:", error);
    return null;
  }
};

/**
 * Calculates distance between two coordinates using Haversine formula
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};
