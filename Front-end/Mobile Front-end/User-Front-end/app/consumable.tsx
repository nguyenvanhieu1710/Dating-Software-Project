import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function ConsumableScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'superlike' | 'boost'>('superlike');
  const [selectedPack, setSelectedPack] = useState(0);

  const consumablePlans = {
    superlike: [
      { qty: 5, price: '$4.99', bonus: '' },
      { qty: 25, price: '$19.99', bonus: 'Best Value' },
      { qty: 60, price: '$39.99', bonus: 'Popular' },
    ],
    boost: [
      { qty: 1, price: '$1.99', bonus: '' },
      { qty: 5, price: '$8.99', bonus: 'Save 10%' },
      { qty: 10, price: '$14.99', bonus: 'Best Value' },
    ],
  };

  const getCurrentPlans = () => consumablePlans[activeTab];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consumables</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'superlike' && styles.tabActive]}
          onPress={() => { setActiveTab('superlike'); setSelectedPack(0); }}
        >
          <Text style={[styles.tabText, activeTab === 'superlike' && styles.tabTextActive]}>Super Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'boost' && styles.tabActive]}
          onPress={() => { setActiveTab('boost'); setSelectedPack(0); }}
        >
          <Text style={[styles.tabText, activeTab === 'boost' && styles.tabTextActive]}>Boosts</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentSection}>
          {getCurrentPlans().map((pack, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.packCard, selectedPack === index && styles.packCardActive]}
              onPress={() => setSelectedPack(index)}
            >
              <View style={styles.packInfo}>
                <Text style={styles.packQty}>{pack.qty} {activeTab === 'superlike' ? 'Super Likes' : 'Boosts'}</Text>
                {pack.bonus ? <Text style={styles.packBonus}>{pack.bonus}</Text> : null}
              </View>
              <Text style={styles.packPrice}>{pack.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            Buy {getCurrentPlans()[selectedPack].qty} {activeTab === 'superlike' ? 'Super Likes' : 'Boosts'} for {getCurrentPlans()[selectedPack].price}
          </Text>
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
  packCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  packCardActive: {
    borderColor: '#8B5CF6',
    borderWidth: 2,
    backgroundColor: '#F5F3FF',
  },
  packInfo: {
    flexDirection: 'column',
  },
  packQty: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  packBonus: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8B5CF6',
    marginTop: 4,
  },
  packPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
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
