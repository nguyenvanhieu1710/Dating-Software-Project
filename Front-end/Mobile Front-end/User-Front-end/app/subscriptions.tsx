import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function Subscriptions() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('gold');

    const subscriptionPlans = {
        plus: {
            price: '$4.99/month',
            features: [
                { icon: 'heart', title: 'Unlimited Likes', description: 'Like as many profiles as you want' },
                { icon: 'refresh', title: 'Rewind', description: 'Undo your last swipe' },
                { icon: 'star-outline', title: '1 Super Like/week', description: 'Stand out with Super Likes' },
                { icon: 'eye-off', title: 'Hide Ads', description: 'Browse without interruptions' }
            ]
        },
        gold: {
            price: '$9.99/month',
            features: [
                { icon: 'heart', title: 'Unlimited Likes', description: 'Like as many profiles as you want' },
                { icon: 'eye', title: 'See Who Likes You', description: 'Know who already liked you' },
                { icon: 'star', title: '5 Super Likes/week', description: 'More chances to stand out' },
                { icon: 'refresh', title: 'Rewind', description: 'Undo your last swipe' },
                { icon: 'rocket', title: '1 Boost/month', description: 'Be a top profile in your area' }
            ]
        },
        platinum: {
            price: '$19.99/month',
            features: [
                { icon: 'heart', title: 'All Gold Features', description: 'Everything from Gold plan' },
                { icon: 'chatbubble', title: 'Message Before Matching', description: 'Send a message with Super Like' },
                { icon: 'trending-up', title: 'Priority Likes', description: 'Your likes are seen first' },
                { icon: 'star', title: '10 Super Likes/week', description: 'Maximum Super Likes' },
                { icon: 'rocket', title: '2 Boosts/month', description: 'Double the visibility' }
            ]
        }
    };

    const getCurrentPlan = () => subscriptionPlans[activeTab as keyof typeof subscriptionPlans];

    const renderContent = () => {
        const currentPlan = getCurrentPlan();
        
        return (
            <View style={styles.contentSection}>
                {currentPlan.features.map((feature, index) => (
                    <View key={index} style={styles.featureCard}>
                        <Ionicons name={feature.icon as any} size={24} color="#8B5CF6" />
                        <View style={styles.featureInfo}>
                            <Text style={styles.featureTitle}>{feature.title}</Text>
                            <Text style={styles.featureDescription}>{feature.description}</Text>
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Subscriptions</Text>
                <View style={styles.headerSpacer} />
            </View>
            
            {/* Tabs Gold & Platinum & Plus */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'gold' && styles.tabActive]}
                    onPress={() => setActiveTab('gold')}
                >
                    <Text style={[styles.tabText, activeTab === 'gold' && styles.tabTextActive]}>Gold</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'platinum' && styles.tabActive]}
                    onPress={() => setActiveTab('platinum')}
                >
                    <Text style={[styles.tabText, activeTab === 'platinum' && styles.tabTextActive]}>Platinum</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'plus' && styles.tabActive]}
                    onPress={() => setActiveTab('plus')}
                >
                    <Text style={[styles.tabText, activeTab === 'plus' && styles.tabTextActive]}>Plus</Text>
                </TouchableOpacity>
            </View>
            
            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {renderContent()}
            </ScrollView>
            
            {/* Button Buy */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Subscribe for {getCurrentPlan().price}</Text>
                </TouchableOpacity>
            </View>
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
    featureCard: {
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
    featureInfo: {
        flex: 1,
        marginLeft: 12,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 18,
    },
    footer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    button: {
        backgroundColor: '#8B5CF6',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});