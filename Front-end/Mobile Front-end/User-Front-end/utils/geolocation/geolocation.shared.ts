import { Platform } from 'react-native';
import Geolocation from "react-native-geolocation-service";
import { PermissionsAndroid } from "react-native";

export interface UserLocation {
  latitude: number;
  longitude: number;
}

/**
 * Requests location permission based on the platform
 * @returns Promise<boolean> - Whether location permission was granted
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  // Web implementation
  if (Platform.OS === 'web') {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported in this browser");
      return false;
    }
    return true;
  }

  // iOS implementation
  if (Platform.OS === 'ios') {
    try {
      const result = await Geolocation.requestAuthorization("whenInUse");
      return result === "granted";
    } catch (error) {
      console.error("Error requesting location permission:", error);
      return false;
    }
  }

  // Android implementation
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error("Error requesting location permission:", error);
      return false;
    }
  }

  return false;
};

/**
 * Gets current device location
 * @returns Promise<UserLocation> - Current device coordinates
 */
export const getCurrentLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    // Web implementation
    if (Platform.OS === 'web') {
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
    // Native (iOS/Android) implementation
    else {
      Geolocation.getCurrentPosition(
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
  });
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