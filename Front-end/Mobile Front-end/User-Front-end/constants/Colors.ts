/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#8B5CF6'; // Màu tím thống nhất
const tintColorDark = '#A78BFA'; // Light violet for dark mode

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    primary: '#8B5CF6', // Màu tím thống nhất
    secondary: '#A78BFA', // Light violet
    accent: '#F3E8FF', // Light purple background
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    card: '#F8FAFC',
    border: '#E2E8F0',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#A78BFA', // Light violet for dark mode
    secondary: '#8B5CF6', // Màu tím thống nhất
    accent: '#2D1B69',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    card: '#1F2937',
    border: '#374151',
  },
};
