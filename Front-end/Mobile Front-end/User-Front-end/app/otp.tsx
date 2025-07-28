import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function OtpScreen() {
    const router = useRouter();
    const [otp, setOtp] = useState('');

    const handleVerify = () => {
        if (otp.length !== 6) return Alert.alert('Lỗi', 'Vui lòng nhập đủ 6 số');
        // Giả lập xác thực thành công
        router.replace('profile-photos');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nhập mã OTP</Text>
            <Text style={styles.subtitle}>Mã xác thực đã được gửi về số điện thoại của bạn.</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập mã OTP"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
            />
            <TouchableOpacity style={styles.button} onPress={handleVerify}>
                <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={() => Alert.alert('Đã gửi lại mã OTP!')}>
                <Text style={styles.linkButtonText}>Gửi lại mã</Text>
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
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: Colors.light.icon,
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: 10,
        padding: 14,
        marginBottom: 16,
        fontSize: 20,
        color: Colors.light.text,
        backgroundColor: Colors.light.card,
        textAlign: 'center',
        letterSpacing: 16,
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
    linkButton: {
        alignItems: 'center',
        marginTop: 16,
    },
    linkButtonText: {
        color: Colors.light.primary,
        fontSize: 15,
        fontWeight: '500',
    },
}); 