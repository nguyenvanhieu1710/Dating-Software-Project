import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function SplashScreen() {
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace({ pathname: '/onboarding' });
        }, 2000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <View style={styles.container}>
            <View style={styles.logoBox}>
                <Image source={require('@/assets/images/partial-react-logo.png')} style={styles.logo} />
            </View>
            <Text style={styles.title}>VioletDate</Text>
            <Text style={styles.subtitle}>Kết nối & Khám phá</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoBox: {
        backgroundColor: '#fff',
        borderRadius: 60,
        padding: 24,
        marginBottom: 24,
        elevation: 4,
    },
    logo: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#fff',
        opacity: 0.8,
    },
}); 