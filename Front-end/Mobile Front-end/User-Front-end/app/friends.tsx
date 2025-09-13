import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface UserItem {
    id: string;
    name: string;
    avatar: string | null;
    status: 'online' | 'offline' | 'add';
}

const USERS = [
    { id: '1', name: 'Alex', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', status: 'online' },
    { id: '2', name: 'Sarah', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', status: 'online' },
    { id: '3', name: 'Mike', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', status: 'offline' },
    { id: '4', name: 'Emma', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', status: 'online' },
    { id: '5', name: 'John', avatar: 'https://randomuser.me/api/portraits/men/5.jpg', status: 'offline' },
    { id: '6', name: 'Add', avatar: null, status: 'add' },
];

const renderItem = ({ item }: { item: UserItem }) => {
    if (item.status === 'add') {
        return (
            <TouchableOpacity style={styles.addFriendButton}>
                <Ionicons name="person-add" size={24} color="#6D28D9" />
                <Text style={styles.addFriendText}>Add</Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.friendItem}>
            <View style={styles.avatarContainer}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                {item.status === 'online' && <View style={styles.onlineBadge} />}
            </View>
            <Text style={styles.friendName} numberOfLines={1}>{item.name}</Text>
        </View>
    );
};

export default function FriendsScreen() {
    const router = useRouter();
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Friends</Text>
                    <TouchableOpacity style={styles.settingsButton}>
                        <Ionicons name="settings-outline" size={24} color="#6D28D9" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content}>
                {/* Double Date Friends */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Double Date Friends</Text>
                    <FlatList
                        data={USERS}
                        numColumns={3}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        scrollEnabled={false}
                        contentContainerStyle={styles.friendsGrid}
                    />
                    <Text style={styles.sectionSubtitle}>
                        Invite up to 3 friends to pair up on Double Date
                    </Text>
                </View>

                {/* Invites */}
                <View style={[styles.section, styles.invitesSection]}>
                    <Text style={styles.sectionTitle}>Invites</Text>
                    <View style={styles.emptyState}>
                        <Ionicons name="people-outline" size={48} color="#D1D5DB" />
                        <Text style={styles.emptyStateText}>
                            You'll see your Double Date friends here
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Invite Friends Button */}
            <TouchableOpacity style={styles.inviteButton}>
                <Ionicons name="person-add" size={20} color="#FFFFFF" />
                <Text style={styles.inviteButtonText}>Invite Friends</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
    },
    settingsButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 12,
    },
    friendsGrid: {
        justifyContent: 'space-between',
    },
    friendItem: {
        width: '30%',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 8,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F3F4F6',
    },
    onlineBadge: {
        position: 'absolute',
        right: 4,
        bottom: 4,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    friendName: {
        fontSize: 14,
        color: '#374151',
        textAlign: 'center',
        maxWidth: '100%',
    },
    addFriendButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    addFriendText: {
        marginTop: 4,
        fontSize: 12,
        color: '#6D28D9',
        fontWeight: '500',
    },
    invitesSection: {
        flex: 1,
    },
    emptyState: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
    },
    emptyStateText: {
        marginTop: 12,
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    inviteButton: {
        flexDirection: 'row',
        backgroundColor: '#6D28D9',
        padding: 16,
        borderRadius: 12,
        margin: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6D28D9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    inviteButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});