import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, HelperText } from 'react-native-paper';

interface FormInputProps {
    label: string;
    value: string;
    onChangeText?: (text: string) => void;
    placeholder: string;
    editable?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
    maxLength?: number;
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    numberOfLines = 1,
    editable = true,
    keyboardType = 'default',
    maxLength
}) => {
    return (
        <View style={styles.container}>
            <TextInput
                label={label}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                multiline={multiline}
                numberOfLines={numberOfLines}
                editable={editable}
                keyboardType={keyboardType}
                maxLength={maxLength}
                mode="outlined"
                style={[
                    styles.input,
                    multiline && styles.multilineInput
                ]}
                disabled={!editable}
                outlineStyle={styles.outline}
                theme={{
                    colors: {
                        placeholder: '#9B9B9B',
                    }
                }}
            />
            {!editable && (
                <HelperText type="info" style={styles.helperText}>
                    This field cannot be edited
                </HelperText>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#FAFAFA',
    },
    multilineInput: {
        minHeight: 100,
    },
    outline: {
        borderRadius: 10,
        borderColor: '#E8E8E8',
    },
    helperText: {
        fontSize: 12,
        fontStyle: 'italic',
    },
});