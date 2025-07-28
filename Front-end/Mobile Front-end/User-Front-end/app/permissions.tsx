import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

export default function PermissionsScreen() {
    const router = useRouter();
    const [locationGranted, setLocationGranted] = useState(false);
    const [notificationGranted, setNotificationGranted] = useState(false);

    const handleLocation = () => {
        setLocationGranted(true);
        Alert.alert('Thành công', 'Đã cấp quyền truy cập vị trí!');
    };
    const handleNotification = () => {
        setNotificationGranted(true);
        Alert.alert('Thành công', 'Đã cấp quyền gửi thông báo!');
    };
    const handleDone = () => {
        if (!locationGranted || !notificationGranted) {
            Alert.alert('Vui lòng cấp đủ quyền', 'Bạn cần cấp quyền vị trí và thông báo để sử dụng ứng dụng.');
            return;
        }
        router.replace('(tabs)');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cấp quyền cho ứng dụng</Text>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Quyền truy cập vị trí</Text>
                <Text style={styles.cardDesc}>Để tìm kiếm và gợi ý người dùng ở gần bạn, ứng dụng cần quyền truy cập vị trí của bạn.</Text>
                <TouchableOpacity style={[styles.button, locationGranted && styles.buttonGranted]} onPress={handleLocation}>
                    <Text style={styles.buttonText}>{locationGranted ? 'Đã cấp quyền' : 'Cấp quyền vị trí'}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Quyền gửi thông báo</Text>
                <Text style={styles.cardDesc}>Để thông báo khi có tương hợp mới, tin nhắn mới, ứng dụng cần quyền gửi thông báo.</Text>
                <TouchableOpacity style={[styles.button, notificationGranted && styles.buttonGranted]} onPress={handleNotification}>
                    <Text style={styles.buttonText}>{notificationGranted ? 'Đã cấp quyền' : 'Cấp quyền thông báo'}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                <Text style={styles.doneButtonText}>Hoàn tất</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginBottom: 24,
        textAlign: 'center',
    },
    card: {
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.light.primary,
        marginBottom: 8,
    },
    cardDesc: {
        fontSize: 15,
        color: Colors.light.text,
        marginBottom: 12,
    },
    button: {
        backgroundColor: Colors.light.primary,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonGranted: {
        backgroundColor: Colors.light.success,
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    doneButton: {
        backgroundColor: Colors.light.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 