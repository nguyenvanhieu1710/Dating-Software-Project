import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';

interface SelectableItemProps {
    label: string;
    selected: boolean;
    onPress: () => void;
}

const SelectableItem: React.FC<SelectableItemProps> = ({ 
    label, 
    selected, 
    onPress 
}) => {
    const theme = useTheme();
    return (
        <Chip
            selected={selected}
            onPress={onPress}
            style={[
                styles.chip,
                selected && styles.selectedChip,               
            ]}
            textStyle={[
                styles.chipText,
                selected && styles.selectedText,
                {
                    fontFamily: theme.fonts.bodyLarge.fontFamily
                }
            ]}
            mode="outlined"
            selectedColor="#8B5CF6"                
        >
            {label}
        </Chip>
    );
};

export default SelectableItem;

const styles = StyleSheet.create({
    chip: {
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: '#F0F0F0',
        borderColor: '#E8E8E8',
    },
    selectedChip: {
        backgroundColor: '#FFEBEE',
        borderColor: '#8B5CF6',
    },
    chipText: {
        color: '#666',
    },
    selectedText: {
        color: '#8B5CF6',
        fontWeight: '600',
    },
});