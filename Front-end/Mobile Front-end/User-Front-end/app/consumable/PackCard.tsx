import React from 'react';
import { Card, Text, TouchableRipple } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

type PackCardProps = {
  qty: number;
  price: string;
  bonus?: string;
  selected: boolean;
  onPress: () => void;
  type: 'superlike' | 'boost';
};

export default function PackCard({ qty, price, bonus, selected, onPress, type }: PackCardProps) {
    const theme = useTheme();
  return (
    <TouchableRipple onPress={onPress} style={{ marginBottom: 10, borderRadius: 10 }}>
      <Card
        mode="outlined"
        style={{
          borderColor: selected ? '#8B5CF6' : '#ddd',
          backgroundColor: selected ? '#F5F3FF' : '#fff',
        }}
      >
        <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="titleMedium" style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>
            {qty} {type === 'superlike' ? 'Super Likes' : 'Boosts'}
          </Text>
          <Text variant="titleMedium" style={{ fontFamily: theme.fonts.bodyLarge.fontFamily }}>{price}</Text>
        </Card.Content>
        {bonus ? (
          <Card.Content>
            <Text variant="bodySmall" style={{ color: '#8B5CF6', fontFamily: theme.fonts.bodyLarge.fontFamily }}>
              {bonus}
            </Text>
          </Card.Content>
        ) : null}
      </Card>
    </TouchableRipple>
  );
}
