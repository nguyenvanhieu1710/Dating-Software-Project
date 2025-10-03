import React from 'react';
import { Surface, Text } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => {
  const theme = useTheme();

  return (
    <Surface
      style={{
        marginBottom: 24,
        borderRadius: 12,
        marginHorizontal: 16,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
      }}
      elevation={0}
    >
      <Text
        variant="labelLarge"
        style={{
          color: theme.colors.onSurfaceVariant,
          fontFamily: theme.fonts.bodyLarge.fontFamily,
          fontSize: 14,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          padding: 16,
          paddingBottom: 8,
        }}
      >
        {title}
      </Text>
      <Surface
        style={{
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
        }}
        elevation={0}
      >
        {children}
      </Surface>
    </Surface>
  );
};