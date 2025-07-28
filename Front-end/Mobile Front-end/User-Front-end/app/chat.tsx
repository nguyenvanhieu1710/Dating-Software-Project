import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, Alert, Modal } from 'react-native';
import { Colors } from '@/constants/Colors';

const USER = {
    name: 'Linh',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
};

const INIT_MESSAGES = [
    { id: '1', fromMe: false, text: 'Chào bạn!' },
    { id: '2', fromMe: true, text: 'Chào Linh! Rất vui được làm quen.' },
    { id: '3', fromMe: false, text: 'Bạn thích nghe nhạc gì?' },
];

export default function ChatScreen() {
    const [messages, setMessages] = useState(INIT_MESSAGES);
    const [input, setInput] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { id: Date.now().toString(), fromMe: true, text: input }]);
        setInput('');
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const handleMenu = (action: string) => {
        setMenuVisible(false);
        if (action === 'profile') Alert.alert('Xem hồ sơ', 'Chuyển đến hồ sơ người dùng!');
        if (action === 'unmatch') Alert.alert('Hủy tương hợp', 'Bạn đã hủy tương hợp!');
        if (action === 'report') Alert.alert('Báo cáo', 'Đã gửi báo cáo!');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={{ uri: USER.avatar }} style={styles.avatar} />
                <Text style={styles.name}>{USER.name}</Text>
                <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
                    <Text style={styles.menuIcon}>⋮</Text>
                </TouchableOpacity>
            </View>
            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.msgBox, item.fromMe ? styles.msgMe : styles.msgOther]}>
                        <Text style={styles.msgText}>{item.text}</Text>
                    </View>
                )}
                contentContainerStyle={styles.msgList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
            {/* Input */}
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tin nhắn..."
                    value={input}
                    onChangeText={setInput}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                    <Text style={styles.sendText}>Gửi</Text>
                </TouchableOpacity>
            </View>
            {/* Menu */}
            <Modal visible={menuVisible} transparent animationType="fade">
                <TouchableOpacity style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
                    <View style={styles.menuModal}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenu('profile')}>
                            <Text style={styles.menuItemText}>Xem hồ sơ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenu('unmatch')}>
                            <Text style={styles.menuItemText}>Hủy tương hợp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenu('report')}>
                            <Text style={[styles.menuItemText, { color: Colors.light.error }]}>Báo cáo</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: Colors.light.primary,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 8,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
        backgroundColor: Colors.light.card,
    },
    name: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        flex: 1,
    },
    menuBtn: {
        padding: 8,
    },
    menuIcon: {
        fontSize: 24,
        color: '#fff',
    },
    msgList: {
        padding: 16,
        paddingBottom: 0,
    },
    msgBox: {
        maxWidth: '75%',
        borderRadius: 18,
        padding: 12,
        marginBottom: 10,
    },
    msgMe: {
        backgroundColor: Colors.light.primary,
        alignSelf: 'flex-end',
    },
    msgOther: {
        backgroundColor: Colors.light.accent,
        alignSelf: 'flex-start',
    },
    msgText: {
        color: '#fff',
        fontSize: 15,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderTopWidth: 1,
        borderColor: Colors.light.border,
        backgroundColor: Colors.light.background,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: 20,
        padding: 12,
        fontSize: 15,
        marginRight: 8,
        backgroundColor: Colors.light.card,
        color: Colors.light.text,
    },
    sendBtn: {
        backgroundColor: Colors.light.primary,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 18,
    },
    sendText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    menuOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'flex-end',
    },
    menuModal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        gap: 12,
    },
    menuItem: {
        paddingVertical: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: Colors.light.primary,
        fontWeight: '500',
    },
}); 