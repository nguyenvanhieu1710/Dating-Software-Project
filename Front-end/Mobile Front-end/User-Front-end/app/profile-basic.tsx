import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

const GENDERS = ['Nam', 'Nữ', 'Khác'];

export default function ProfileBasicScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [showPicker, setShowPicker] = useState(false);

    // Đơn giản hóa date picker cho demo (có thể thay bằng DateTimePicker thực tế)
    const handleContinue = () => {
        if (!name || !dob || !gender) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        router.push('profile-extra');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thông tin cơ bản</Text>
            <Text style={styles.label}>Tên của bạn</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập tên"
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.label}>Ngày sinh</Text>
            <TextInput
                style={styles.input}
                placeholder="dd/mm/yyyy"
                value={dob}
                onChangeText={setDob}
                keyboardType="numeric"
            />
            <Text style={styles.label}>Giới tính</Text>
            <View style={styles.genderGroup}>
                {GENDERS.map((g) => (
                    <TouchableOpacity
                        key={g}
                        style={[styles.genderButton, gender === g && styles.genderButtonActive]}
                        onPress={() => setGender(g)}
                    >
                        <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>{g}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
                <Text style={styles.buttonText}>Tiếp tục</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginBottom: 16,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: Colors.light.text,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: 10,
        padding: 14,
        marginBottom: 16,
        fontSize: 16,
        color: Colors.light.text,
        backgroundColor: Colors.light.card,
    },
    genderGroup: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    genderButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: Colors.light.accent,
    },
    genderButtonActive: {
        backgroundColor: Colors.light.primary,
    },
    genderText: {
        color: Colors.light.primary,
        fontWeight: '600',
    },
    genderTextActive: {
        color: '#fff',
    },
    button: {
        backgroundColor: Colors.light.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 