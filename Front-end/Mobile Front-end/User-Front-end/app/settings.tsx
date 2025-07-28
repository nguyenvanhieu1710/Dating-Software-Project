import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function SettingsScreen() {
    const [distance, setDistance] = React.useState(10);
    const [age, setAge] = React.useState([18, 30]);
    const [notif, setNotif] = React.useState(true);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Cài đặt</Text>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tùy chọn khám phá</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Khoảng cách tối đa</Text>
                    <Text style={styles.value}>{distance} km</Text>
                </View>
                <View style={styles.sliderBox}>
                    <TouchableOpacity onPress={() => setDistance(Math.max(1, distance - 1))} style={styles.sliderBtn}><Text>-</Text></TouchableOpacity>
                    <View style={styles.sliderTrack}><View style={[styles.sliderFill, { width: `${distance * 2}%` }]} /></View>
                    <TouchableOpacity onPress={() => setDistance(Math.min(50, distance + 1))} style={styles.sliderBtn}><Text>+</Text></TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Độ tuổi</Text>
                    <Text style={styles.value}>{age[0]} - {age[1]}</Text>
                </View>
                <View style={styles.sliderBox}>
                    <TouchableOpacity onPress={() => setAge([Math.max(18, age[0] - 1), age[1]])} style={styles.sliderBtn}><Text>-</Text></TouchableOpacity>
                    <View style={styles.sliderTrack}><View style={[styles.sliderFill, { width: `${(age[0] - 18) * 5}%` }]} /></View>
                    <TouchableOpacity onPress={() => setAge([Math.min(age[1], age[0] + 1), age[1]])} style={styles.sliderBtn}><Text>+</Text></TouchableOpacity>
                    <Text style={{ marginHorizontal: 8 }}>/</Text>
                    <TouchableOpacity onPress={() => setAge([age[0], Math.max(age[0], age[1] - 1)])} style={styles.sliderBtn}><Text>-</Text></TouchableOpacity>
                    <View style={styles.sliderTrack}><View style={[styles.sliderFill, { width: `${(age[1] - 18) * 5}%` }]} /></View>
                    <TouchableOpacity onPress={() => setAge([age[0], Math.min(50, age[1] + 1)])} style={styles.sliderBtn}><Text>+</Text></TouchableOpacity>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tài khoản & Thông báo</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Nhận thông báo</Text>
                    <Switch value={notif} onValueChange={setNotif} trackColor={{ true: Colors.light.primary, false: Colors.light.border }} />
                </View>
                <TouchableOpacity style={styles.linkRow} onPress={() => Alert.alert('Cập nhật số điện thoại/email!')}>
                    <Text style={styles.linkText}>Cập nhật số điện thoại / email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkRow} onPress={() => Alert.alert('Đổi mật khẩu!')}>
                    <Text style={styles.linkText}>Đổi mật khẩu</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Khác</Text>
                <TouchableOpacity style={styles.linkRow} onPress={() => Alert.alert('Trợ giúp!')}>
                    <Text style={styles.linkText}>Trợ giúp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkRow} onPress={() => Alert.alert('Điều khoản dịch vụ!')}>
                    <Text style={styles.linkText}>Điều khoản dịch vụ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkRow} onPress={() => Alert.alert('Đăng xuất!')}>
                    <Text style={[styles.linkText, { color: Colors.light.warning }]}>Đăng xuất</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkRow} onPress={() => Alert.alert('Xóa tài khoản!')}>
                    <Text style={[styles.linkText, { color: Colors.light.error }]}>Xóa tài khoản</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginBottom: 16,
        textAlign: 'center',
    },
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.icon,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    label: {
        fontSize: 15,
        color: Colors.light.text,
    },
    value: {
        fontSize: 15,
        color: Colors.light.primary,
        fontWeight: '600',
    },
    sliderBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sliderBtn: {
        backgroundColor: Colors.light.accent,
        borderRadius: 16,
        padding: 8,
        marginHorizontal: 4,
    },
    sliderTrack: {
        flex: 1,
        height: 6,
        backgroundColor: Colors.light.border,
        borderRadius: 3,
        marginHorizontal: 4,
        overflow: 'hidden',
    },
    sliderFill: {
        height: 6,
        backgroundColor: Colors.light.primary,
        borderRadius: 3,
    },
    linkRow: {
        paddingVertical: 12,
    },
    linkText: {
        fontSize: 15,
        color: Colors.light.primary,
        fontWeight: '500',
    },
}); 