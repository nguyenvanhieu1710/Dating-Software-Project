import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function SafetyCenterScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('guide');

    const renderGuideContent = () => (
        <View style={styles.contentSection}>
            <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>Hi, stay safe while dating!</Text>
                <Text style={styles.welcomeSubtext}>Learn about safety features and best practices</Text>
            </View>
            
            <View style={styles.categoryCard}>
                <Ionicons name="shield-checkmark" size={24} color="#8B5CF6" />
                <Text style={styles.categoryTitle}>Safety</Text>
                <Text style={styles.categoryDescription}>Essential safety tips for online dating</Text>
            </View>
            
            <View style={styles.categoryCard}>
                <Ionicons name="warning" size={24} color="#8B5CF6" />
                <Text style={styles.categoryTitle}>Harassment</Text>
                <Text style={styles.categoryDescription}>How to identify and report harassment</Text>
            </View>
            
            <View style={styles.categoryCard}>
                <Ionicons name="people" size={24} color="#8B5CF6" />
                <Text style={styles.categoryTitle}>In Real Life</Text>
                <Text style={styles.categoryDescription}>Meeting safely in person</Text>
            </View>
            
            <View style={styles.categoryCard}>
                <Ionicons name="flag" size={24} color="#8B5CF6" />
                <Text style={styles.categoryTitle}>Reporting</Text>
                <Text style={styles.categoryDescription}>How to report inappropriate behavior</Text>
            </View>
            
            <View style={styles.categoryCard}>
                <Ionicons name="heart" size={24} color="#8B5CF6" />
                <Text style={styles.categoryTitle}>Consent</Text>
                <Text style={styles.categoryDescription}>Understanding and respecting consent</Text>
            </View>
            
            <View style={styles.categoryCard}>
                <Ionicons name="airplane" size={24} color="#8B5CF6" />
                <Text style={styles.categoryTitle}>Travel</Text>
                <Text style={styles.categoryDescription}>Safety tips while traveling</Text>
            </View>
        </View>
    );

    const renderToolsContent = () => (
        <View style={styles.contentSection}>
            <TouchableOpacity style={styles.toolCard}>
                <Ionicons name="flag-outline" size={24} color="#8B5CF6" />
                <View style={styles.toolInfo}>
                    <Text style={styles.toolTitle}>How to Report</Text>
                    <Text style={styles.toolDescription}>Learn how to report users and content</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolCard}>
                <Ionicons name="lock-closed" size={24} color="#8B5CF6" />
                <View style={styles.toolInfo}>
                    <Text style={styles.toolTitle}>Privacy Settings</Text>
                    <Text style={styles.toolDescription}>Manage your privacy and visibility</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
        </View>
    );

    const renderResourcesContent = () => (
        <View style={styles.contentSection}>
            <TouchableOpacity style={styles.resourceCard}>
                <Ionicons name="globe" size={24} color="#8B5CF6" />
                <View style={styles.resourceInfo}>
                    <Text style={styles.resourceTitle}>Visit Our Website</Text>
                    <Text style={styles.resourceDescription}>More safety resources and support</Text>
                </View>
                <Ionicons name="open-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <View style={styles.emergencyCard}>
                <Ionicons name="call" size={24} color="#EF4444" />
                <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
                <Text style={styles.emergencyDescription}>If you're in immediate danger, contact local emergency services</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Safety Center</Text>
                <View style={styles.headerSpacer} />
            </View>
            
            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'guide' && styles.tabActive]}
                    onPress={() => setActiveTab('guide')}
                >
                    <Text style={[styles.tabText, activeTab === 'guide' && styles.tabTextActive]}>Guide</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'tools' && styles.tabActive]}
                    onPress={() => setActiveTab('tools')}
                >
                    <Text style={[styles.tabText, activeTab === 'tools' && styles.tabTextActive]}>Tools</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'resources' && styles.tabActive]}
                    onPress={() => setActiveTab('resources')}
                >
                    <Text style={[styles.tabText, activeTab === 'resources' && styles.tabTextActive]}>Resources</Text>
                </TouchableOpacity>
            </View>
            
            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {activeTab === 'guide' && renderGuideContent()}
                {activeTab === 'tools' && renderToolsContent()}
                {activeTab === 'resources' && renderResourcesContent()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingTop: Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight || 0) + 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    headerSpacer: {
        width: 40,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    tabActive: {
        backgroundColor: '#8B5CF6',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#fff',
    },
    content: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    contentSection: {
        padding: 20,
    },
    welcomeSection: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    welcomeSubtext: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    categoryCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginLeft: 12,
        marginBottom: 4,
        flex: 1,
    },
    categoryDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 36,
        lineHeight: 18,
    },
    toolCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    toolInfo: {
        flex: 1,
        marginLeft: 12,
    },
    toolTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    toolDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 18,
    },
    resourceCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    resourceInfo: {
        flex: 1,
        marginLeft: 12,
    },
    resourceTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    resourceDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 18,
    },
    emergencyCard: {
        backgroundColor: '#FEF2F2',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    emergencyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#DC2626',
        marginLeft: 12,
        marginBottom: 4,
        flex: 1,
    },
    emergencyDescription: {
        fontSize: 14,
        color: '#7F1D1D',
        marginLeft: 36,
        lineHeight: 18,
    },
});