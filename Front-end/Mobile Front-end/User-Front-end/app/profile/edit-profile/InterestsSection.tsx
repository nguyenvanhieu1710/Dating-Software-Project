import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { SelectableItem } from './SelectableItem';

interface InterestsSectionProps {
    interests: string[];
    selectedInterests: string[];
    onToggleInterest: (interest: string) => void;
}

export const InterestsSection: React.FC<InterestsSectionProps> = ({
    interests,
    selectedInterests,
    onToggleInterest
}) => {
    const theme = useTheme();
    return (
        <Card style={styles.card} mode="elevated">
            <Card.Content>
                <Text variant="titleMedium" style={[styles.title, {
                    fontFamily: theme.fonts.bodyLarge.fontFamily
                }]}>
                    Interests
                </Text>
                <View style={styles.container}>
                    {interests.map((interest) => (
                        <SelectableItem
                            key={interest}
                            label={interest}
                            selected={selectedInterests.includes(interest)}
                            onPress={() => onToggleInterest(interest)}
                        />
                    ))}
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 12,
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
});