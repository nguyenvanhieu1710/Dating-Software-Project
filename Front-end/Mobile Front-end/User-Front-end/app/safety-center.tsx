// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { Colors } from '@/constants/Colors';

// export default function SafetyCenterScreen() {
//     const router = useRouter();
//     const [activeTab, setActiveTab] = useState('guide');

//     const renderGuideContent = () => (
//         <View style={styles.contentSection}>
//             <View style={styles.welcomeSection}>
//                 <Text style={styles.welcomeText}>Hi, stay safe while dating!</Text>
//                 <Text style={styles.welcomeSubtext}>Learn about safety features and best practices</Text>
//             </View>
            
//             <View style={styles.categoryCard}>
//                 <Ionicons name="shield-checkmark" size={24} color="#8B5CF6" />
//                 <Text style={styles.categoryTitle}>Safety</Text>
//                 <Text style={styles.categoryDescription}>Essential safety tips for online dating</Text>
//             </View>
            
//             <View style={styles.categoryCard}>
//                 <Ionicons name="warning" size={24} color="#8B5CF6" />
//                 <Text style={styles.categoryTitle}>Harassment</Text>
//                 <Text style={styles.categoryDescription}>How to identify and report harassment</Text>
//             </View>
            
//             <View style={styles.categoryCard}>
//                 <Ionicons name="people" size={24} color="#8B5CF6" />
//                 <Text style={styles.categoryTitle}>In Real Life</Text>
//                 <Text style={styles.categoryDescription}>Meeting safely in person</Text>
//             </View>
            
//             <View style={styles.categoryCard}>
//                 <Ionicons name="flag" size={24} color="#8B5CF6" />
//                 <Text style={styles.categoryTitle}>Reporting</Text>
//                 <Text style={styles.categoryDescription}>How to report inappropriate behavior</Text>
//             </View>
            
//             <View style={styles.categoryCard}>
//                 <Ionicons name="heart" size={24} color="#8B5CF6" />
//                 <Text style={styles.categoryTitle}>Consent</Text>
//                 <Text style={styles.categoryDescription}>Understanding and respecting consent</Text>
//             </View>
            
//             <View style={styles.categoryCard}>
//                 <Ionicons name="airplane" size={24} color="#8B5CF6" />
//                 <Text style={styles.categoryTitle}>Travel</Text>
//                 <Text style={styles.categoryDescription}>Safety tips while traveling</Text>
//             </View>
//         </View>
//     );

//     const renderToolsContent = () => (
//         <View style={styles.contentSection}>
//             <TouchableOpacity style={styles.toolCard}>
//                 <Ionicons name="flag-outline" size={24} color="#8B5CF6" />
//                 <View style={styles.toolInfo}>
//                     <Text style={styles.toolTitle}>How to Report</Text>
//                     <Text style={styles.toolDescription}>Learn how to report users and content</Text>
//                 </View>
//                 <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
//             </TouchableOpacity>
            
//             <TouchableOpacity style={styles.toolCard}>
//                 <Ionicons name="lock-closed" size={24} color="#8B5CF6" />
//                 <View style={styles.toolInfo}>
//                     <Text style={styles.toolTitle}>Privacy Settings</Text>
//                     <Text style={styles.toolDescription}>Manage your privacy and visibility</Text>
//                 </View>
//                 <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
//             </TouchableOpacity>
//         </View>
//     );

//     const renderResourcesContent = () => (
//         <View style={styles.contentSection}>
//             <TouchableOpacity style={styles.resourceCard}>
//                 <Ionicons name="globe" size={24} color="#8B5CF6" />
//                 <View style={styles.resourceInfo}>
//                     <Text style={styles.resourceTitle}>Visit Our Website</Text>
//                     <Text style={styles.resourceDescription}>More safety resources and support</Text>
//                 </View>
//                 <Ionicons name="open-outline" size={20} color="#9CA3AF" />
//             </TouchableOpacity>
            
//             <View style={styles.emergencyCard}>
//                 <Ionicons name="call" size={24} color="#EF4444" />
//                 <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
//                 <Text style={styles.emergencyDescription}>If you're in immediate danger, contact local emergency services</Text>
//             </View>
//         </View>
//     );

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
            
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//                     <Ionicons name="arrow-back" size={24} color="#1F2937" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Safety Center</Text>
//                 <View style={styles.headerSpacer} />
//             </View>
            
//             {/* Tabs */}
//             <View style={styles.tabs}>
//                 <TouchableOpacity
//                     style={[styles.tab, activeTab === 'guide' && styles.tabActive]}
//                     onPress={() => setActiveTab('guide')}
//                 >
//                     <Text style={[styles.tabText, activeTab === 'guide' && styles.tabTextActive]}>Guide</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={[styles.tab, activeTab === 'tools' && styles.tabActive]}
//                     onPress={() => setActiveTab('tools')}
//                 >
//                     <Text style={[styles.tabText, activeTab === 'tools' && styles.tabTextActive]}>Tools</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={[styles.tab, activeTab === 'resources' && styles.tabActive]}
//                     onPress={() => setActiveTab('resources')}
//                 >
//                     <Text style={[styles.tabText, activeTab === 'resources' && styles.tabTextActive]}>Resources</Text>
//                 </TouchableOpacity>
//             </View>
            
//             {/* Content */}
//             <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//                 {activeTab === 'guide' && renderGuideContent()}
//                 {activeTab === 'tools' && renderToolsContent()}
//                 {activeTab === 'resources' && renderResourcesContent()}
//             </ScrollView>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: Colors.light.background,
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//         paddingVertical: 15,
//         paddingTop: Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight || 0) + 15,
//         backgroundColor: '#fff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#F3F4F6',
//     },
//     backButton: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: '#F9FAFB',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     headerTitle: {
//         fontSize: 20,
//         fontWeight: '700',
//         color: '#1F2937',
//     },
//     headerSpacer: {
//         width: 40,
//     },
//     tabs: {
//         flexDirection: 'row',
//         backgroundColor: '#fff',
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#F3F4F6',
//     },
//     tab: {
//         flex: 1,
//         paddingVertical: 12,
//         paddingHorizontal: 16,
//         borderRadius: 20,
//         alignItems: 'center',
//         marginHorizontal: 4,
//     },
//     tabActive: {
//         backgroundColor: '#8B5CF6',
//     },
//     tabText: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: '#6B7280',
//     },
//     tabTextActive: {
//         color: '#fff',
//     },
//     content: {
//         flex: 1,
//         backgroundColor: '#F9FAFB',
//     },
//     contentSection: {
//         padding: 20,
//     },
//     welcomeSection: {
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 20,
//         marginBottom: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 8,
//         elevation: 2,
//     },
//     welcomeText: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: '#1F2937',
//         marginBottom: 8,
//     },
//     welcomeSubtext: {
//         fontSize: 14,
//         color: '#6B7280',
//         lineHeight: 20,
//     },
//     categoryCard: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         padding: 16,
//         marginBottom: 12,
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//         elevation: 1,
//         borderWidth: 1,
//         borderColor: '#F3F4F6',
//     },
//     categoryTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#1F2937',
//         marginLeft: 12,
//         marginBottom: 4,
//         flex: 1,
//     },
//     categoryDescription: {
//         fontSize: 14,
//         color: '#6B7280',
//         marginLeft: 36,
//         lineHeight: 18,
//     },
//     toolCard: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         padding: 16,
//         marginBottom: 12,
//         flexDirection: 'row',
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//         elevation: 1,
//         borderWidth: 1,
//         borderColor: '#F3F4F6',
//     },
//     toolInfo: {
//         flex: 1,
//         marginLeft: 12,
//     },
//     toolTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#1F2937',
//         marginBottom: 4,
//     },
//     toolDescription: {
//         fontSize: 14,
//         color: '#6B7280',
//         lineHeight: 18,
//     },
//     resourceCard: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         padding: 16,
//         marginBottom: 12,
//         flexDirection: 'row',
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//         elevation: 1,
//         borderWidth: 1,
//         borderColor: '#F3F4F6',
//     },
//     resourceInfo: {
//         flex: 1,
//         marginLeft: 12,
//     },
//     resourceTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#1F2937',
//         marginBottom: 4,
//     },
//     resourceDescription: {
//         fontSize: 14,
//         color: '#6B7280',
//         lineHeight: 18,
//     },
//     emergencyCard: {
//         backgroundColor: '#FEF2F2',
//         borderRadius: 12,
//         padding: 16,
//         marginTop: 8,
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         borderWidth: 1,
//         borderColor: '#FECACA',
//     },
//     emergencyTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#DC2626',
//         marginLeft: 12,
//         marginBottom: 4,
//         flex: 1,
//     },
//     emergencyDescription: {
//         fontSize: 14,
//         color: '#7F1D1D',
//         marginLeft: 36,
//         lineHeight: 18,
//     },
// });

import React, { useState, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    SafeAreaView, 
    StatusBar, 
    Platform, 
    Animated, 
    Dimensions,
    Alert,
    Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SafetyCenterScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('guide');
    const [completedCategories, setCompletedCategories] = useState(new Set());
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, [activeTab]);

    const handleCategoryPress = (categoryName: string) => {
        setCompletedCategories(prev => new Set(prev).add(categoryName));
        // Navigate to detailed category page
        Alert.alert(
            categoryName,
            `Opening ${categoryName} safety guide...`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Continue", onPress: () => console.log(`Navigate to ${categoryName}`) }
            ]
        );
    };

    const handleEmergencyCall = () => {
        Alert.alert(
            "Emergency Contacts",
            "Are you sure you want to call emergency services?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Call 911", onPress: () => Linking.openURL("tel:911") }
            ]
        );
    };

    const renderGuideContent = () => (
        <Animated.View 
            style={[
                styles.contentSection,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}
        >
            {/* Hero Section */}
            <LinearGradient
                colors={['#8B5CF6', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroSection}
            >
                <View style={styles.heroContent}>
                    <Ionicons name="shield-checkmark" size={32} color="#fff" style={styles.heroIcon} />
                    <Text style={styles.heroTitle}>Stay Safe While Dating</Text>
                    <Text style={styles.heroSubtitle}>
                        Your safety is our priority. Learn essential tips for a secure dating experience.
                    </Text>
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            {completedCategories.size}/6 guides completed
                        </Text>
                        <View style={styles.progressBar}>
                            <View 
                                style={[
                                    styles.progressFill, 
                                    { width: `${(completedCategories.size / 6) * 100}%` }
                                ]} 
                            />
                        </View>
                    </View>
                </View>
            </LinearGradient>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>99.8%</Text>
                    <Text style={styles.statLabel}>Safe Matches</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>24/7</Text>
                    <Text style={styles.statLabel}>Support</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>2M+</Text>
                    <Text style={styles.statLabel}>Protected Users</Text>
                </View>
            </View>

            {/* Safety Categories */}
            <Text style={styles.sectionTitle}>Safety Guides</Text>
            
            {[
                {
                    icon: 'shield-checkmark',
                    title: 'Basic Safety',
                    description: 'Essential safety tips for online dating beginners',
                    color: '#10B981',
                    gradient: ['#10B981', '#34D399']
                },
                {
                    icon: 'warning',
                    title: 'Spot Red Flags',
                    description: 'How to identify and handle suspicious behavior',
                    color: '#F59E0B',
                    gradient: ['#F59E0B', '#FCD34D']
                },
                {
                    icon: 'people',
                    title: 'Meeting in Person',
                    description: 'Safe practices for first dates and meetups',
                    color: '#8B5CF6',
                    gradient: ['#8B5CF6', '#A78BFA']
                },
                {
                    icon: 'flag',
                    title: 'Report & Block',
                    description: 'How to report inappropriate behavior effectively',
                    color: '#EF4444',
                    gradient: ['#EF4444', '#F87171']
                },
                {
                    icon: 'heart',
                    title: 'Consent Matters',
                    description: 'Understanding boundaries and respectful dating',
                    color: '#EC4899',
                    gradient: ['#EC4899', '#F472B6']
                },
                {
                    icon: 'airplane',
                    title: 'Travel Safety',
                    description: 'Dating safely while traveling or with travelers',
                    color: '#06B6D4',
                    gradient: ['#06B6D4', '#67E8F9']
                }
            ].map((category, index) => (
                <TouchableOpacity
                    key={category.title}
                    style={styles.modernCategoryCard}
                    onPress={() => handleCategoryPress(category.title)}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={category.gradient as [string, string]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.categoryGradient}
                    >
                        <View style={styles.categoryIconContainer}>
                            <Ionicons name={category.icon as any} size={28} color="#fff" />
                        </View>
                    </LinearGradient>
                    
                    <View style={styles.categoryContent}>
                        <View style={styles.categoryHeader}>
                            <Text style={styles.modernCategoryTitle}>{category.title}</Text>
                            {completedCategories.has(category.title) && (
                                <View style={styles.completedBadge}>
                                    <Ionicons name="checkmark" size={12} color="#fff" />
                                </View>
                            )}
                        </View>
                        <Text style={styles.modernCategoryDescription}>
                            {category.description}
                        </Text>
                    </View>
                    
                    <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                </TouchableOpacity>
            ))}
        </Animated.View>
    );

    const renderToolsContent = () => (
        <Animated.View 
            style={[
                styles.contentSection,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}
        >
            <Text style={styles.sectionTitle}>Safety Tools</Text>
            
            <TouchableOpacity style={styles.modernToolCard} activeOpacity={0.8}>
                <LinearGradient
                    colors={['#8B5CF6', '#8B5CF6']}
                    style={styles.toolIconGradient}
                >
                    <Ionicons name="flag-outline" size={24} color="#fff" />
                </LinearGradient>
                <View style={styles.toolContent}>
                    <Text style={styles.modernToolTitle}>Report User</Text>
                    <Text style={styles.modernToolDescription}>
                        Quickly report suspicious or inappropriate behavior
                    </Text>
                </View>
                <View style={styles.toolBadge}>
                    <Text style={styles.toolBadgeText}>Fast</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modernToolCard} activeOpacity={0.8}>
                <LinearGradient
                    colors={['#8B5CF6', '#A78BFA']}
                    style={styles.toolIconGradient}
                >
                    <Ionicons name="lock-closed" size={24} color="#fff" />
                </LinearGradient>
                <View style={styles.toolContent}>
                    <Text style={styles.modernToolTitle}>Privacy Controls</Text>
                    <Text style={styles.modernToolDescription}>
                        Manage who can see your profile and contact you
                    </Text>
                </View>
                <View style={[styles.toolBadge, { backgroundColor: '#E5E7EB' }]}>
                    <Text style={[styles.toolBadgeText, { color: '#6B7280' }]}>Essential</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modernToolCard} activeOpacity={0.8}>
                <LinearGradient
                    colors={['#10B981', '#34D399']}
                    style={styles.toolIconGradient}
                >
                    <Ionicons name="location" size={24} color="#fff" />
                </LinearGradient>
                <View style={styles.toolContent}>
                    <Text style={styles.modernToolTitle}>Share Location</Text>
                    <Text style={styles.modernToolDescription}>
                        Share your date location with trusted contacts
                    </Text>
                </View>
                <View style={[styles.toolBadge, { backgroundColor: '#DBEAFE' }]}>
                    <Text style={[styles.toolBadgeText, { color: '#1D4ED8' }]}>New</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modernToolCard} activeOpacity={0.8}>
                <LinearGradient
                    colors={['#F59E0B', '#FCD34D']}
                    style={styles.toolIconGradient}
                >
                    <Ionicons name="time" size={24} color="#fff" />
                </LinearGradient>
                <View style={styles.toolContent}>
                    <Text style={styles.modernToolTitle}>Check-in Timer</Text>
                    <Text style={styles.modernToolDescription}>
                        Set automatic check-ins during dates for peace of mind
                    </Text>
                </View>
                <View style={[styles.toolBadge, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.toolBadgeText, { color: '#92400E' }]}>Popular</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    const renderResourcesContent = () => (
        <Animated.View 
            style={[
                styles.contentSection,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}
        >
            <Text style={styles.sectionTitle}>Support & Resources</Text>

            <TouchableOpacity style={styles.modernResourceCard} activeOpacity={0.8}>
                <LinearGradient
                    colors={['#06B6D4', '#67E8F9']}
                    style={styles.resourceIconGradient}
                >
                    <Ionicons name="globe" size={24} color="#fff" />
                </LinearGradient>
                <View style={styles.resourceContent}>
                    <Text style={styles.modernResourceTitle}>Safety Hub</Text>
                    <Text style={styles.modernResourceDescription}>
                        Comprehensive safety guides and community resources
                    </Text>
                </View>
                <Ionicons name="open-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.modernResourceCard} activeOpacity={0.8}>
                <LinearGradient
                    colors={['#EC4899', '#F472B6']}
                    style={styles.resourceIconGradient}
                >
                    <Ionicons name="chatbubbles" size={24} color="#fff" />
                </LinearGradient>
                <View style={styles.resourceContent}>
                    <Text style={styles.modernResourceTitle}>24/7 Support Chat</Text>
                    <Text style={styles.modernResourceDescription}>
                        Get immediate help from our safety experts
                    </Text>
                </View>
                <View style={styles.onlineIndicator}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.onlineText}>Online</Text>
                </View>
            </TouchableOpacity>

            {/* Emergency Section */}
            <View style={styles.emergencySection}>
                <LinearGradient
                    colors={['#8B5CF6', '#8B5CF6']}
                    style={styles.emergencyGradient}
                >
                    <View style={styles.emergencyContent}>
                        <Ionicons name="warning" size={28} color="#fff" />
                        <Text style={styles.emergencyTitle}>Emergency Support</Text>
                        <Text style={styles.emergencyDescription}>
                            If you're in immediate danger, contact local emergency services
                        </Text>
                        <TouchableOpacity 
                            style={styles.emergencyButton}
                            onPress={handleEmergencyCall}
                        >
                            <Ionicons name="call" size={20} color="#EF4444" />
                            <Text style={styles.emergencyButtonText}>Call Emergency Services</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>

            {/* Crisis Resources */}
            <View style={styles.crisisSection}>
                <Text style={styles.crisisTitle}>Crisis Resources</Text>
                <View style={styles.crisisLinks}>
                    <TouchableOpacity style={styles.crisisLink}>
                        <Text style={styles.crisisLinkText}>National Sexual Assault Hotline</Text>
                        <Text style={styles.crisisLinkNumber}>1-800-656-4673</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.crisisLink}>
                        <Text style={styles.crisisLinkText}>National Domestic Violence Hotline</Text>
                        <Text style={styles.crisisLinkNumber}>1-800-799-7233</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
            
            {/* Modern Header */}
            <LinearGradient
                colors={['#8B5CF6', '#8B5CF6']}
                style={styles.modernHeader}
            >
                <TouchableOpacity style={styles.modernBackButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.modernHeaderTitle}>Safety Center</Text>
                <TouchableOpacity style={styles.helpButton}>
                    <Ionicons name="help-circle" size={24} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>
            
            {/* Modern Tabs */}
            <View style={styles.modernTabs}>
                {[
                    { key: 'guide', label: 'Guide', icon: 'book' },
                    { key: 'tools', label: 'Tools', icon: 'construct' },
                    { key: 'resources', label: 'Resources', icon: 'library' }
                ].map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.modernTab, activeTab === tab.key && styles.modernTabActive]}
                        onPress={() => setActiveTab(tab.key)}
                        activeOpacity={0.8}
                    >
                        <Ionicons 
                            name={tab.icon as any} 
                            size={18} 
                            color={activeTab === tab.key ? '#8B5CF6' : '#6B7280'} 
                        />
                        <Text style={[
                            styles.modernTabText, 
                            activeTab === tab.key && styles.modernTabTextActive
                        ]}>
                            {tab.label}
                        </Text>
                        {activeTab === tab.key && <View style={styles.tabIndicator} />}
                    </TouchableOpacity>
                ))}
            </View>
            
            {/* Content */}
            <ScrollView 
                style={styles.content} 
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
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
        backgroundColor: '#F9FAFB',
    },
    modernHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    modernBackButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modernHeaderTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
    },
    helpButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modernTabs: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    modernTab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        position: 'relative',
    },
    modernTabActive: {
        // Active state handled by indicator
    },
    modernTabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginTop: 4,
    },
    modernTabTextActive: {
        color: '#8B5CF6',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: -1,
        width: '100%',
        height: 3,
        backgroundColor: '#8B5CF6',
        borderRadius: 2,
    },
    content: {
        flex: 1,
    },
    contentSection: {
        paddingBottom: 30,
    },
    heroSection: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },
    heroContent: {
        padding: 24,
        alignItems: 'center',
    },
    heroIcon: {
        marginBottom: 12,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
    },
    progressContainer: {
        width: '100%',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 8,
    },
    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    statsContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 20,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: '#8B5CF6',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginHorizontal: 20,
        marginTop: 30,
        marginBottom: 16,
    },
    modernCategoryCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    categoryGradient: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    categoryIconContainer: {
        // Icon container styles handled by gradient
    },
    categoryContent: {
        flex: 1,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    modernCategoryTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    completedBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modernCategoryDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    modernToolCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    toolIconGradient: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    toolContent: {
        flex: 1,
    },
    modernToolTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    modernToolDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 18,
    },
    toolBadge: {
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    toolBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    modernResourceCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    resourceIconGradient: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    resourceContent: {
        flex: 1,
    },
    modernResourceTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    modernResourceDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 18,
    },
    onlineIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        marginRight: 4,
    },
    onlineText: {
        fontSize: 12,
        color: '#10B981',
        fontWeight: '600',
    },
    emergencySection: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },
    emergencyGradient: {
        padding: 20,
    },
    emergencyContent: {
        alignItems: 'center',
    },
    emergencyTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
        marginTop: 8,
        marginBottom: 8,
    },
    emergencyDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 16,
    },
    emergencyButton: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
    },
    emergencyButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#EF4444',
        marginLeft: 8,
    },
    crisisSection: {
        marginHorizontal: 20,
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    crisisTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
    },
    crisisLinks: {
        gap: 12,
    },
    crisisLink: {
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    crisisLinkText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 4,
    },
    crisisLinkNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
});