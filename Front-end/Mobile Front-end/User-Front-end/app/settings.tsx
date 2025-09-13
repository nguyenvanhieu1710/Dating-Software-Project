import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, SafeAreaView, StatusBar, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = React.useState(true);
    const [location, setLocation] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(false);

    const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );

    const SettingItem = ({ 
        label, 
        icon, 
        onPress, 
        hasSwitch = false, 
        switchValue = false, 
        onSwitchChange = () => {},
        isDanger = false
    }: { 
        label: string; 
        icon?: string; 
        onPress?: () => void; 
        hasSwitch?: boolean;
        switchValue?: boolean;
        onSwitchChange?: (value: boolean) => void;
        isDanger?: boolean;
    }) => (
        <TouchableOpacity 
            style={[styles.settingItem, isDanger && styles.dangerItem]} 
            onPress={onPress}
            disabled={hasSwitch}
        >
            <View style={styles.settingItemLeft}>
                {icon && <Ionicons name={icon as any} size={20} color={isDanger ? Colors.light.error : Colors.light.primary} style={styles.settingIcon} />}
                <Text style={[styles.settingText, isDanger && styles.dangerText]}>{label}</Text>
            </View>
            {hasSwitch ? (
                <Switch
                    value={switchValue}
                    onValueChange={onSwitchChange}
                    trackColor={{ false: '#E5E7EB', true: Colors.light.primary }}
                    thumbColor={switchValue ? '#fff' : '#9CA3AF'}
                />
            ) : (
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
            
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Account Section */}
                <SettingSection title="Account">
                    <SettingItem 
                        label="Edit Profile" 
                        icon="person-outline"
                        onPress={() => {}}
                    />
                    <SettingItem 
                        label="Change Password" 
                        icon="key-outline"
                        onPress={() => {}}
                    />
                    <SettingItem 
                        label="Phone Number" 
                        icon="phone-portrait-outline"
                        onPress={() => {}}
                    />
                    <SettingItem 
                        label="Delete Account" 
                        icon="trash-outline"
                        onPress={() => {}}
                        isDanger
                    />
                </SettingSection>

                {/* Preferences Section */}
                <SettingSection title="Preferences">
                    <SettingItem 
                        label="Dark Mode" 
                        icon="moon-outline"
                        hasSwitch
                        switchValue={darkMode}
                        onSwitchChange={setDarkMode}
                    />
                    <SettingItem 
                        label="Push Notifications" 
                        icon="notifications-outline"
                        hasSwitch
                        switchValue={notifications}
                        onSwitchChange={setNotifications}
                    />
                    <SettingItem 
                        label="Location Services" 
                        icon="location-outline"
                        hasSwitch
                        switchValue={location}
                        onSwitchChange={setLocation}
                    />
                </SettingSection>

                {/* Discovery Section */}
                <SettingSection title="Discovery Settings">
                    <SettingItem 
                        label="Show My Profile" 
                        icon="eye-outline"
                        hasSwitch
                        switchValue={true}
                    />
                    <SettingItem 
                        label="Show My Distance" 
                        icon="navigate-outline"
                        hasSwitch
                        switchValue={true}
                    />
                    <SettingItem 
                        label="Show My Age" 
                        icon="calendar-outline"
                        hasSwitch
                        switchValue={true}
                    />
                </SettingSection>

                {/* Support Section */}
                <SettingSection title="Support">
                    <SettingItem 
                        label="Help Center" 
                        icon="help-circle-outline"
                        onPress={() => {}}
                    />
                    <SettingItem 
                        label="Contact Us" 
                        icon="chatbubbles-outline"
                        onPress={() => {}}
                    />
                    <SettingItem 
                        label="Privacy Policy" 
                        icon="shield-checkmark-outline"
                        onPress={() => {}}
                    />
                    <SettingItem 
                        label="Terms of Service" 
                        icon="document-text-outline"
                        onPress={() => {}}
                    />
                </SettingSection>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={() => {}}>
                    <Ionicons name="log-out-outline" size={20} color="#DC2626" style={styles.logoutIcon} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>App Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: Platform.OS === 'ios' ? 10 : 16,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
    },
    section: {
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginHorizontal: 16,
        overflow: 'hidden',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        padding: 16,
        paddingBottom: 8,
    },
    sectionContent: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIcon: {
        marginRight: 12,
        width: 24,
        textAlign: 'center',
    },
    settingText: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '500',
    },
    dangerItem: {
        borderLeftWidth: 3,
        borderLeftColor: Colors.light.error,
    },
    dangerText: {
        color: Colors.light.error,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEE2E2',
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
        marginBottom: 24,
    },
    logoutIcon: {
        marginRight: 8,
    },
    logoutText: {
        color: '#DC2626',
        fontSize: 16,
        fontWeight: '600',
    },
    versionText: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 14,
        marginTop: 8,
    },
});