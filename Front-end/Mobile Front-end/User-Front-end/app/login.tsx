import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView, StatusBar, Platform, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import AuthService, { LoginCredentials } from '../services/authService';
import { setCurrentUserId } from '../services/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const router = useRouter();
    const { method } = useLocalSearchParams<{ method?: string }>();
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (method === 'phone') {
            if (!phone) return Alert.alert('Error', 'Please enter your phone number');            
        } else {
            if (!email || !password) {
                return Alert.alert('Error', 'Please enter email and password');
            }
            
            try {
                setIsLoading(true);
                const credentials: LoginCredentials = { email, password };
                const authResponse = await AuthService.login(credentials);
                console.log("Login response: ", authResponse);
                
                // The token is already saved by AuthService.login()
                // We can verify it's there
                const token = await AsyncStorage.getItem('auth_token');
                console.log("Stored token exists:", !!token);
                
                // Store user ID for API calls
                if (authResponse.data && authResponse.data.user) {
                    await setCurrentUserId(authResponse.data.user.id);
                    console.log("User ID: ", authResponse.data.user.id);
                    
                    // Also store user data in AsyncStorage for quick access
                    await AsyncStorage.setItem('user_data', JSON.stringify(authResponse.data.user));
                } else {
                    console.log("No user data in response");
                }
                
                // Navigate immediately after successful login
                router.replace('/(tabs)');
            } catch (error: any) {
                console.error('Login error:', error);
                Alert.alert(
                    'Login Error',
                    error.message || 'Login failed. Please check your credentials.'
                );
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
            <KeyboardAvoidingView 
                style={styles.keyboardAvoid} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {/* Header Section */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Ionicons name="heart" size={60} color="#FFFFFF" />
                            <Text style={styles.appName}>Dating App</Text>
                        </View>
                        <Text style={styles.welcomeText}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Sign in to continue your journey to find love</Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Sign In</Text>
                        
                        {method === 'phone' ? (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Phone Number</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="call-outline" size={20} color="#9B9B9B" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your phone number"
                                        keyboardType="phone-pad"
                                        value={phone}
                                        onChangeText={setPhone}
                                        placeholderTextColor="#9B9B9B"
                                    />
                                </View>
                            </View>
                        ) : (
                            <>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Email</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="mail-outline" size={20} color="#9B9B9B" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter your email"
                                            keyboardType="email-address"
                                            value={email}
                                            onChangeText={setEmail}
                                            autoCapitalize="none"
                                            placeholderTextColor="#9B9B9B"
                                        />
                                    </View>
                                </View>
                                
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Password</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="lock-closed-outline" size={20} color="#9B9B9B" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter your password"
                                            secureTextEntry={!showPassword}
                                            value={password}
                                            onChangeText={setPassword}
                                            placeholderTextColor="#9B9B9B"
                                        />
                                        <TouchableOpacity 
                                            style={styles.eyeIcon} 
                                            onPress={() => setShowPassword(!showPassword)}
                                        >
                                            <Ionicons 
                                                name={showPassword ? "eye-outline" : "eye-off-outline"} 
                                                size={20} 
                                                color="#9B9B9B" 
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                
                                <TouchableOpacity style={styles.forgotPassword}>
                                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </>
                        )}
                        
                        <TouchableOpacity 
                            style={[styles.button, isLoading && styles.buttonDisabled]} 
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text style={styles.buttonText}>
                                    {method === 'phone' ? 'Get OTP Code' : 'Sign In'}
                                </Text>
                            )}
                        </TouchableOpacity>
                        
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>
                        
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-google" size={20} color="#8B5CF6" />
                            <Text style={styles.socialButtonText}>Sign in with Google</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/register')}>
                            <Text style={styles.linkButtonText}>Don't have an account? </Text>
                            <Text style={styles.linkButtonTextBold}>Sign up now</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#8B5CF6',
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    header: {
        backgroundColor: '#8B5CF6',
        paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 40,
        paddingBottom: 40,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 8,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        opacity: 0.9,
        lineHeight: 22,
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 24,
        marginTop: -10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 32,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#374151',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        height: '100%',
    },
    eyeIcon: {
        padding: 4,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: 8,
        marginBottom: 8,
    },
    forgotPasswordText: {
        color: '#8B5CF6',
        fontSize: 14,
        fontWeight: '500',
    },
    button: {
        backgroundColor: '#8B5CF6',
        borderRadius: 12,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: '#CCCCCC',
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#9CA3AF',
        fontSize: 14,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        height: 56,
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
    },
    socialButtonText: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    linkButtonText: {
        color: '#6B7280',
        fontSize: 15,
    },
    linkButtonTextBold: {
        color: '#8B5CF6',
        fontSize: 15,
        fontWeight: '600',
    },
});