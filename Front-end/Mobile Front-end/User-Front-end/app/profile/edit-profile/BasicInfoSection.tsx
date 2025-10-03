import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { FormInput } from './FormInput';

interface BasicInfoSectionProps {
    formData: {
        first_name: string;
        email: string;
        phone_number: string;
        dob: string;
        gender: string;
    };
    onUpdateField: (field: string, value: string) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
    formData,
    onUpdateField
}) => {
    const theme = useTheme();
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch {
            return dateString;
        }
    };

    const calculateAge = (dob: string) => {
        if (!dob) return '';
        try {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age.toString();
        } catch {
            return '';
        }
    };

    return (
        <Card style={styles.card} mode="elevated">
            <Card.Content>
                <Text variant="titleMedium" style={[styles.title, {
                    fontFamily: theme.fonts.bodyLarge.fontFamily
                }]}>
                    Basic Information
                </Text>
                <FormInput
                    label="First Name"
                    value={formData.first_name}
                    onChangeText={(text) => onUpdateField('first_name', text)}
                    placeholder="Enter your first name"
                    maxLength={50}
                />
                <FormInput
                    label="Email"
                    value={formData.email}
                    onChangeText={(text) => onUpdateField('email', text)}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    maxLength={100}
                />
                <FormInput
                    label="Phone Number"
                    value={formData.phone_number}
                    onChangeText={(text) => onUpdateField('phone_number', text)}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    maxLength={20}
                />
                <FormInput
                    label="Date of Birth"
                    value={formData.dob ? formatDate(formData.dob) : ''}
                    placeholder="Date of birth"
                    // editable={false}
                />
                {formData.dob && (
                    <View style={styles.ageContainer}>
                        <Text variant="bodyMedium" style={[styles.ageText, {
                            fontFamily: theme.fonts.bodyLarge.fontFamily
                        }]}>
                            Age: {calculateAge(formData.dob)} years old
                        </Text>
                    </View>
                )}
                <FormInput
                    label="Gender"
                    value={formData.gender}
                    onChangeText={(text) => onUpdateField('gender', text)}
                    placeholder="Your gender"
                    maxLength={20}
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
    ageContainer: {
        marginTop: 8,
        marginBottom: 16,
        padding: 8,
        backgroundColor: '#EEF2FF',
        borderRadius: 6,
    },
    ageText: {
        color: '#4F46E5',
        fontWeight: '500',
    },
});