import React from 'react';
import { Text, Surface } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

interface ProfileInfoSectionProps {
  title: string;
  children: React.ReactNode;
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({ title, children }) => {
  const theme = useTheme();

  return (
    <Surface
      style={{
        marginBottom: 20,
        shadowColor: 'transparent',
        paddingBottom: 16,
      }}
    >
      <Text
        variant="titleSmall"
        style={{
          fontSize: 16,
          fontWeight: '700',
          marginBottom: 12,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          color: theme.colors.primary,
          fontFamily: theme.fonts.bodyLarge.fontFamily,
        }}
      >
        {title}
      </Text>
      {children}
    </Surface>
  );
};

export default ProfileInfoSection;