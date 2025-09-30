// src/theme/paperTheme.ts
import {
    MD3LightTheme as DefaultLight,
    MD3DarkTheme as DefaultDark,
  } from "react-native-paper";
  
  // Theme Light
  export const myLightTheme = {
    ...DefaultLight,
    colors: {
      ...DefaultLight.colors,
      primary: "#8b5cf6",   // màu chính 
      secondary: "#06b6d4", // màu phụ
      tertiary: "#f59e0b",  // accent (CTA, cảnh báo nhẹ)
      background: "#FFFFFF",
      surface: "#F8F9FA",
      text: "#000000",
    },
    fonts: {
      ...DefaultLight.fonts,
      bodyLarge: {
        ...DefaultLight.fonts.bodyLarge,
        fontFamily: "SpaceMono", // font bạn preload ở bước 4
      },
      titleLarge: {
        ...DefaultLight.fonts.titleLarge,
        fontFamily: "SpaceMono",
      },
    },
  };
  
  // Theme Dark
  export const myDarkTheme = {
    ...DefaultDark,
    colors: {
      ...DefaultDark.colors,
      primary: "#8b5cf6",   // giữ nguyên tím chính để đồng bộ
      secondary: "#06b6d4", // cyan cho điểm nhấn
      tertiary: "#f59e0b",  // accent vàng
      background: "#121212",
      surface: "#1E1E1E",
      text: "#FFFFFF",
    },
    fonts: {
      ...DefaultDark.fonts,
      bodyLarge: {
        ...DefaultDark.fonts.bodyLarge,
        fontFamily: "SpaceMono",
      },
      titleLarge: {
        ...DefaultDark.fonts.titleLarge,
        fontFamily: "SpaceMono",
      },
    },
  };
  