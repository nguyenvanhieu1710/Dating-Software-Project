import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { FormInput } from './FormInput';

interface LocationSectionProps {
    location: string;
    onUseMyLocation: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
    location,
    onUseMyLocation
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
                    Location Information
                </Text>
                <FormInput
                    label="Current Location"
                    value={location}
                    placeholder="Your current location coordinates"
                    editable={false}
                />
                <Button
                    mode="outlined"
                    icon="map-marker"
                    onPress={onUseMyLocation}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                    labelStyle={[
                        styles.buttonLabel,
                        {
                            fontFamily: theme.fonts.bodyLarge.fontFamily,
                        },
                    ]}
                    buttonColor="#F8F4FF"
                    textColor="#8B5CF6"
                >
                    Use My Current Location
                </Button>
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
    button: {
        marginTop: 8,
        borderColor: '#8B5CF6',
        borderWidth: 2,
        borderStyle: 'dashed',
    },
    buttonContent: {
        paddingVertical: 4,
    },
    buttonLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
});