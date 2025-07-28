import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function LoginScreen() {
    const router = useRouter();
    const { method } = useLocalSearchParams<{ method?: string }>();
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (method === 'phone') {
            if (!phone) return Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
            router.push('otp');
        } else {
            if (!email || !password) return Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
            // Giả lập đăng nhập thành công
            router.replace('(tabs)');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng nhập</Text>
            {method === 'phone' ? (
                <>
                    <Text style={styles.label}>Số điện thoại</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập số điện thoại"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />
                </>
            ) : (
                <>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                    <Text style={styles.label}>Mật khẩu</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập mật khẩu"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </>
            )}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>{method === 'phone' ? 'Nhận mã OTP' : 'Đăng nhập'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={() => router.push('register')}>
                <Text style={styles.linkButtonText}>Chưa có tài khoản? Đăng ký</Text>
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
        marginBottom: 24,
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