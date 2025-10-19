import React from 'react';
import { View } from 'react-native';
import { TouchableRipple, Switch, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

interface SettingItemProps {
  label: string;
  icon?: string;
  onPress?: () => void;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  isDanger?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  label,
  icon,
  onPress,
  hasSwitch = false,
  switchValue = false,
  onSwitchChange = () => {},
  isDanger = false,
}) => {
  const theme = useTheme();

  return (
    <TouchableRipple
      onPress={hasSwitch ? undefined : onPress}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        ...(isDanger && { borderLeftWidth: 3, borderLeftColor: theme.colors.error }),
      }}
      rippleColor="#808080"
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}
      >
        {icon && (
          <Ionicons
            name={icon as any}
            size={20}
            color={isDanger ? theme.colors.error : theme.colors.primary}
            style={{ marginRight: 12, width: 24, textAlign: 'center' }}
          />
        )}
        <Text
          variant="bodyLarge"
          style={{
            color: isDanger ? theme.colors.error : theme.colors.onSurface,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
            fontSize: 16,
            fontWeight: '500',
          }}
        >
          {label}
        </Text>
        {hasSwitch ? (
          <Switch
          style={{marginLeft: 'auto'}}
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#E5E7EB', true: theme.colors.primary }}
            thumbColor={switchValue ? '#fff' : '#9CA3AF'}
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        )}
      </View>
    </TouchableRipple>
  );
};

export default SettingItem;