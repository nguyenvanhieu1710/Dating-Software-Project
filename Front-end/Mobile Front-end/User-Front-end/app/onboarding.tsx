import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function OnboardingScreen() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chào mừng đến với VioletDate!</Text>
            <Text style={styles.subtitle}>Kết nối, khám phá và tìm kiếm một nửa của bạn.</Text>
            <View style={styles.buttonGroup}>
                <TouchableOpacity style={[styles.button, styles.phone]} onPress={() => router.push('/login', { params: { method: 'phone' } })}>
                    <Text style={styles.buttonText}>Đăng nhập bằng Số điện thoại</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.facebook]} onPress={() => { }}>
                    <Text style={styles.buttonText}>Đăng nhập bằng Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.google]} onPress={() => { }}>
                    <Text style={styles.buttonText}>Đăng nhập bằng Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/login', { params: { method: 'email' } })}>
                    <Text style={styles.linkButtonText}>Đăng nhập bằng Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/register')}>
                    <Text style={styles.linkButtonText}>Tạo tài khoản mới</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.links}>
                <Text style={styles.linkText} onPress={() => Linking.openURL('https://example.com/terms')}>Điều khoản dịch vụ</Text>
                <Text style={styles.linkText}> | </Text>
                <Text style={styles.linkText} onPress={() => Linking.openURL('https://example.com/privacy')}>Chính sách bảo mật</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: Colors.light.icon,
        marginBottom: 32,
        textAlign: 'center',
    },
    buttonGroup: {
        width: '100%',
        marginBottom: 24,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    phone: {
        backgroundColor: Colors.light.primary,
    },
    facebook: {
        backgroundColor: '#1877F3',
    },
    google: {
        backgroundColor: '#EA4335',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    linkButton: {
        alignItems: 'center',
        marginBottom: 8,
    },
    linkButtonText: {
        color: Colors.light.primary,
        fontSize: 15,
        fontWeight: '500',
    },
    links: {
        flexDirection: 'row',
        marginTop: 16,
    },
    linkText: {
        color: Colors.light.icon,
        textDecorationLine: 'underline',
        fontSize: 13,
        marginHorizontal: 2,
    },
}); 