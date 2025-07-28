import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';

const PLANS = [
    {
        name: 'Plus',
        color: '#A78BFA',
        price: '99.000đ/tháng',
        features: [
            'Không giới hạn lượt thích',
            'Hoàn tác lượt vuốt',
            '1 Boost/tháng',
        ],
    },
    {
        name: 'Gold',
        color: '#FFD700',
        price: '199.000đ/tháng',
        features: [
            'Tất cả tính năng Plus',
            'Xem ai đã thích bạn',
            '5 Super Like/ngày',
            '2 Boost/tháng',
        ],
    },
    {
        name: 'Platinum',
        color: '#7C3AED',
        price: '299.000đ/tháng',
        features: [
            'Tất cả tính năng Gold',
            'Ưu tiên hiển thị hồ sơ',
            'Tin nhắn đầu tiên nổi bật',
            'Không quảng cáo',
        ],
    },
];

export default function PaywallScreen() {
    const [selected, setSelected] = useState('Gold');

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Nâng cấp tài khoản</Text>
            <Text style={styles.subtitle}>Trải nghiệm nhiều tính năng cao cấp hơn với các gói Plus, Gold, Platinum!</Text>
            <View style={styles.planList}>
                {PLANS.map(plan => (
                    <TouchableOpacity
                        key={plan.name}
                        style={[styles.planBox, selected === plan.name && { borderColor: plan.color, borderWidth: 2 }]}
                        onPress={() => setSelected(plan.name)}
                    >
                        <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                        <Text style={styles.planPrice}>{plan.price}</Text>
                        {plan.features.map(f => (
                            <Text key={f} style={styles.feature}>• {f}</Text>
                        ))}
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.upgradeBtn} onPress={() => alert('Chuyển sang giao diện thanh toán gốc!')}>
                <Text style={styles.upgradeText}>Nâng cấp ngay</Text>
            </TouchableOpacity>
            <Text style={styles.note}>Thanh toán qua App Store hoặc Google Play. Có thể hủy bất cứ lúc nào.</Text>
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
        fontSize: 26,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: Colors.light.icon,
        marginBottom: 20,
        textAlign: 'center',
    },
    planList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 24,
    },
    planBox: {
        flex: 1,
        backgroundColor: Colors.light.card,
        borderRadius: 18,
        padding: 18,
        alignItems: 'center',
        marginHorizontal: 4,
        elevation: 2,
    },
    planName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    planPrice: {
        fontSize: 15,
        color: Colors.light.text,
        marginBottom: 8,
        fontWeight: '600',
    },
    feature: {
        fontSize: 14,
        color: Colors.light.text,
        marginBottom: 2,
        textAlign: 'center',
    },
    upgradeBtn: {
        backgroundColor: Colors.light.primary,
        padding: 16,
        borderRadius: 24,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    upgradeText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    note: {
        fontSize: 13,
        color: Colors.light.icon,
        textAlign: 'center',
        marginTop: 8,
    },
}); 