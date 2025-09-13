import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

const ONBOARDING_STEPS = [
    {
        title: 'Find Your Match',
        subtitle: 'Discover people who share your interests',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop',
    },
    {
        title: 'Real Connections',
        subtitle: 'Build meaningful relationships',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    },
    {
        title: 'Start Your Journey',
        subtitle: 'Ready to find the love of your life?',
        image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=300&fit=crop',
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            router.push('/login');
        }
    };

    const handleSkip = () => {
        router.push('/login');
    };

    const currentStepData = ONBOARDING_STEPS[currentStep];

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
            <View style={styles.container}>
                <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                <View style={styles.content}>
                    <Image source={{ uri: currentStepData.image }} style={styles.image} />
                    <Text style={styles.title}>{currentStepData.title}</Text>
                    <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>
                </View>

                <View style={styles.footer}>
                    <View style={styles.dots}>
                        {ONBOARDING_STEPS.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    index === currentStep && styles.dotActive
                                ]}
                            />
                        ))}
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleNext}>
                        <Text style={styles.buttonText}>
                            {currentStep === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Continue'}
                        </Text>
                    </TouchableOpacity>
                </View>
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
        paddingTop: Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight || 0) + 24,
    },
    skipButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight || 0) + 24,
        right: 20,
        zIndex: 1,
    },
    skipText: {
        color: Colors.light.primary,
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: Colors.light.text,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        padding: 24,
    },
    dots: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 32,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.light.border,
        marginHorizontal: 4,
    },
    dotActive: {
        backgroundColor: Colors.light.primary,
    },
    button: {
        backgroundColor: Colors.light.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 