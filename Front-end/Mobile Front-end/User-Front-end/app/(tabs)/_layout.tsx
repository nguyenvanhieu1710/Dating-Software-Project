import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useTheme } from 'react-native-paper';

const tabs = [
  {
    name: 'index',
    title: 'Home',
    icon: 'flame',
  },
  {
    name: 'explore',
    title: 'Explore',
    icon: 'compass',
  },
  {
    name: 'likes',
    title: 'Likes',
    icon: 'heart',
  },
  {
    name: 'messages',
    title: 'Chats',
    icon: 'chatbubbles',
  },
  {
    name: 'profile',
    title: 'Profile',
    icon: 'person',
  },
];

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#9CA3AF', // Màu xám nhạt
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#E0E0E0',
            paddingBottom: 5,
            paddingTop: 5,
            height: 80,
          },
          default: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#E0E0E0',
            paddingBottom: 5,
            paddingTop: 5,
            height: 80,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          fontFamily: theme.fonts.bodyLarge.fontFamily,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? tab.icon : `${tab.icon}-outline` as any}
                size={24}
                color={focused ? theme.colors.primary : color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}