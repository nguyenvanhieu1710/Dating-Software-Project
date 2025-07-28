import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Animated, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

const USERS = [
  {
    id: '1',
    name: 'Linh',
    age: 24,
    distance: 2,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Yêu mèo, thích du lịch, thích cà phê cuối tuần.',
  },
  {
    id: '2',
    name: 'Hà',
    age: 27,
    distance: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    bio: 'Designer, thích vẽ và nghe nhạc indie.',
  },
  {
    id: '3',
    name: 'Minh',
    age: 23,
    distance: 1,
    avatar: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop',
    bio: 'Thích thể thao, chạy bộ mỗi sáng.',
  },
];

const { width } = Dimensions.get('window');

export default function DiscoveryScreen() {
  const [current, setCurrent] = useState(0);
  const [swipeAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  const user = USERS[current];

  const handleSwipe = (direction: 'left' | 'right' | 'superlike') => {
    // Nếu match (demo: nếu là Super Like hoặc Like vào user đầu tiên) thì mở màn hình match
    if ((direction === 'right' || direction === 'superlike') && user && user.id === '1') {
      router.push('match');
      return;
    }
    Animated.timing(swipeAnim, {
      toValue: direction === 'left' ? -width : width,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      swipeAnim.setValue(0);
      setCurrent((prev) => (prev + 1) % USERS.length);
    });
  };

  const handleRewind = () => {
    setCurrent((prev) => (prev - 1 + USERS.length) % USERS.length);
  };

  const handleBoost = () => {
    router.push('paywall');
  };

  if (!user) return <View style={styles.container}><Text>Hết hồ sơ để khám phá!</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.deckContainer}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateX: swipeAnim }],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('profile-detail')}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </TouchableOpacity>
          <View style={styles.infoBox}>
            <Text style={styles.name}>{user.name}, {user.age}</Text>
            <Text style={styles.distance}>{user.distance} km gần bạn</Text>
            <Text style={styles.bio}>{user.bio}</Text>
          </View>
        </Animated.View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.rewind]} onPress={handleRewind}>
          <Text style={styles.actionIcon}>↩️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.pass]} onPress={() => handleSwipe('left')}>
          <Text style={styles.actionIcon}>❌</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.superlike]} onPress={() => handleSwipe('superlike')}>
          <Text style={styles.actionIcon}>⭐</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.like]} onPress={() => handleSwipe('right')}>
          <Text style={styles.actionIcon}>❤️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.boost]} onPress={handleBoost}>
          <Text style={styles.actionIcon}>⚡</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = 420;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: Colors.light.card,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 6,
    shadowColor: Colors.light.primary,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    marginBottom: 16,
  },
  avatar: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    resizeMode: 'cover',
  },
  infoBox: {
    padding: 18,
    alignItems: 'flex-start',
    width: '100%',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  distance: {
    fontSize: 15,
    color: Colors.light.icon,
    marginBottom: 8,
  },
  bio: {
    fontSize: 15,
    color: Colors.light.text,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 32,
    gap: 8,
  },
  actionBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.accent,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 28,
  },
  rewind: {
    backgroundColor: '#A78BFA',
  },
  pass: {
    backgroundColor: '#F3E8FF',
  },
  superlike: {
    backgroundColor: '#C4B5FD',
  },
  like: {
    backgroundColor: '#7C3AED',
  },
  boost: {
    backgroundColor: '#F59E0B',
  },
});
