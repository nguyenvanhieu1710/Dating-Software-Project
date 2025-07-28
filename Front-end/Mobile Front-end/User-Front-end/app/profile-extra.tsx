import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

const HOBBIES = ['Đọc sách', 'Du lịch', 'Âm nhạc', 'Thể thao', 'Nấu ăn', 'Chụp ảnh', 'Xem phim', 'Game', 'Mua sắm', 'Khác'];

export default function ProfileExtraScreen() {
    const router = useRouter();
    const [bio, setBio] = useState('');
    const [job, setJob] = useState('');
    const [school, setSchool] = useState('');
    const [hobbies, setHobbies] = useState<string[]>([]);

    const toggleHobby = (hobby: string) => {
        setHobbies((prev) =>
            prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
        );
    };

    const handleContinue = () => {
        // Bio, job, school là tùy chọn, chỉ cần chọn ít nhất 1 sở thích
        if (hobbies.length === 0) {
            alert('Vui lòng chọn ít nhất 1 sở thích');
            return;
        }
        router.push('permissions');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Thông tin thêm</Text>
            <Text style={styles.label}>Giới thiệu bản thân (Bio)</Text>
            <TextInput
                style={[styles.input, { height: 60 }]}
                placeholder="Giới thiệu ngắn về bạn..."
                value={bio}
                onChangeText={setBio}
                multiline
            />
            <Text style={styles.label}>Công việc</Text>
            <TextInput
                style={styles.input}
                placeholder="Công việc hiện tại"
                value={job}
                onChangeText={setJob}
            />
            <Text style={styles.label}>Trường học</Text>
            <TextInput
                style={styles.input}
                placeholder="Trường bạn từng học"
                value={school}
                onChangeText={setSchool}
            />
            <Text style={styles.label}>Sở thích</Text>
            <View style={styles.hobbyGroup}>
                {HOBBIES.map((hobby) => (
                    <TouchableOpacity
                        key={hobby}
                        style={[styles.hobbyButton, hobbies.includes(hobby) && styles.hobbyButtonActive]}
                        onPress={() => toggleHobby(hobby)}
                    >
                        <Text style={[styles.hobbyText, hobbies.includes(hobby) && styles.hobbyTextActive]}>{hobby}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
                <Text style={styles.buttonText}>Tiếp tục</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.light.background,
        padding: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginBottom: 16,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: Colors.light.text,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: 10,
        padding: 14,
        marginBottom: 16,
        fontSize: 16,
        color: Colors.light.text,
        backgroundColor: Colors.light.card,
    },
    hobbyGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
    },
    hobbyButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: Colors.light.accent,
        marginBottom: 8,
    },
    hobbyButtonActive: {
        backgroundColor: Colors.light.primary,
    },
    hobbyText: {
        color: Colors.light.primary,
        fontWeight: '600',
    },
    hobbyTextActive: {
        color: '#fff',
    },
    button: {
        backgroundColor: Colors.light.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 