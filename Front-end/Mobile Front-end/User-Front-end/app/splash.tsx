import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/onboarding');
        }, 2000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
            <View style={styles.container}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop' }}
                    style={styles.logo}
                />
                <Text style={styles.title}>Vibe</Text>
                <Text style={styles.subtitle}>Find your true love</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight || 0) + 24,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.light.text,
        textAlign: 'center',
    },
}); 