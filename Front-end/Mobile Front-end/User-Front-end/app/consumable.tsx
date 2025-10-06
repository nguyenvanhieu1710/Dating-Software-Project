import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import Header from '@/components/header/Header';
import Tabs from './consumable/Tabs';
import PackCard from './consumable/PackCard';
import ButtonFooter from '@/components/footer/ButtonFooter';

export default function ConsumableScreen() {
  const [activeTab, setActiveTab] = useState<'superlike' | 'boost'>('superlike');
  const [selectedPack, setSelectedPack] = useState(0);

  const consumablePlans = {
    superlike: [
      { qty: 5, price: '$4.99', bonus: 'Save 10%' },
      { qty: 25, price: '$19.99', bonus: 'Best Value' },
      { qty: 60, price: '$39.99', bonus: 'Popular' },
    ],
    boost: [
      { qty: 1, price: '$1.99', bonus: 'Save 10%' },
      { qty: 5, price: '$8.99', bonus: 'Save 10%' },
      { qty: 10, price: '$14.99', bonus: 'Best Value' },
    ],
  };

  const getCurrentPlans = () => consumablePlans[activeTab];

  return (
    <>
      <Header title="Consumables" />
      <Tabs activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setSelectedPack(0); }} />

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {getCurrentPlans().map((pack, index) => (
          <PackCard
            key={index}
            qty={pack.qty}
            price={pack.price}
            bonus={pack.bonus}
            selected={selectedPack === index}
            onPress={() => setSelectedPack(index)}
            type={activeTab}
          />
        ))}
      </ScrollView>

      <ButtonFooter
        label={`Buy ${getCurrentPlans()[selectedPack].qty} ${
          activeTab === 'superlike' ? 'Super Likes' : 'Boosts'
        } for ${getCurrentPlans()[selectedPack].price}`}
        onPress={() => {}}
      />
    </>
  );
}
