import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { FormInput } from './FormInput';

interface ProfessionalInfoSectionProps {
    formData: {
        job_title: string;
        company: string;
        school: string;
    };
    onUpdateField: (field: string, value: string) => void;
}

export const ProfessionalInfoSection: React.FC<ProfessionalInfoSectionProps> = ({
    formData,
    onUpdateField
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
                    Professional Information
                </Text>
                <FormInput
                    label="Job Title"
                    value={formData.job_title}
                    onChangeText={(text) => onUpdateField('job_title', text)}
                    placeholder="What do you do?"
                    maxLength={100}
                />
                <FormInput
                    label="Company"
                    value={formData.company}
                    onChangeText={(text) => onUpdateField('company', text)}
                    placeholder="Where do you work?"
                    maxLength={100}
                />
                <FormInput
                    label="School"
                    value={formData.school}
                    onChangeText={(text) => onUpdateField('school', text)}
                    placeholder="Where did you study?"
                    maxLength={100}
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