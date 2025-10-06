import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { FormInput } from './FormInput';

interface BioSectionProps {
    bio: string;
    onUpdateBio: (bio: string) => void;
}

export const BioSection: React.FC<BioSectionProps> = ({
    bio,
    onUpdateBio
}) => {
    const theme = useTheme();
    return (
        <Card style={styles.card} mode="elevated">
            <Card.Content>
                <Text variant="titleMedium" style={[styles.title, {
                    fontFamily: theme.fonts.bodyLarge.fontFamily
                }]}>
                    About Me
                </Text>
                <FormInput
                    label="Bio"
                    value={bio}
                    onChangeText={onUpdateBio}
                    placeholder="Tell others about yourself..."
                    multiline
                    numberOfLines={4}
                    maxLength={500}
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