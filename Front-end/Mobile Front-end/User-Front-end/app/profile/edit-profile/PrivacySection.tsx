import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { ToggleOption } from './ToggleOption';

interface PrivacySectionProps {
    hideAge: boolean;
    hideDistance: boolean;
    onUpdatePrivacy: (field: 'hideAge' | 'hideDistance', value: boolean) => void;
}

export const PrivacySection: React.FC<PrivacySectionProps> = ({
    hideAge,
    hideDistance,
    onUpdatePrivacy
}) => {
    const theme = useTheme();
    return (
        <Card style={styles.card} mode="elevated">
            <Card.Content>
                <Text variant="titleMedium" style={[
                    styles.title,
                    {
                        fontFamily: theme.fonts.bodyLarge.fontFamily,
                    },
                ]}>
                    Privacy Settings
                </Text>
                <ToggleOption
                    label="Hide My Age"
                    value={hideAge}
                    onValueChange={(value) => onUpdatePrivacy('hideAge', value)}
                    description="Other users won't see your age"
                />
                <ToggleOption
                    label="Hide My Distance"
                    value={hideDistance}
                    onValueChange={(value) => onUpdatePrivacy('hideDistance', value)}
                    description="Other users won't see distance from you"
                />
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
});