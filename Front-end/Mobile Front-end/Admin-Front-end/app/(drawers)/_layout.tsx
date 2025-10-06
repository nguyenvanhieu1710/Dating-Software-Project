import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { drawerScreens } from "../../config/screens.config";

export default function MyDrawer() {
  const theme = useTheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerActiveTintColor: theme.colors.primary,
          drawerInactiveTintColor: '#6B7280',
          drawerStyle: {
            backgroundColor: theme.colors.background,
            width: 300,
          },
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontFamily: theme.fonts.titleLarge.fontFamily,
            fontWeight: 'bold',
          },
          drawerLabelStyle: {
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          },

        }}
      >
        {drawerScreens.map(({ name, label, title, icon }) => (
          <Drawer.Screen
            key={name}
            name={name}
            options={{
              drawerLabel: label,
              title,
              drawerIcon: ({ color, size }) => (
                <Ionicons name={icon as any} size={size} color={color} />
              ),
            }}
          />
        ))}       
      </Drawer>
    </GestureHandlerRootView>
  );
}
