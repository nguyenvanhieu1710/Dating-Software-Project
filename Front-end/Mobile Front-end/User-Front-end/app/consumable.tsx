import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import Header from "@/components/header/Header";
import Tabs from "./consumable/Tabs";
import PackCard from "./consumable/PackCard";
import ButtonFooter from "@/components/footer/ButtonFooter";
import { userService } from "@/services/user.service";
import { consumableService } from "@/services/comsumable.service";

export default function ConsumableScreen() {
  const [activeTab, setActiveTab] = useState<"superlike" | "boost">(
    "superlike"
  );
  const [selectedPack, setSelectedPack] = useState(0);

  const consumablePlans = {
    superlike: [
      { qty: 5, price: "$4.99", bonus: "Save 10%" },
      { qty: 25, price: "$19.99", bonus: "Best Value" },
      { qty: 60, price: "$39.99", bonus: "Popular" },
    ],
    boost: [
      { qty: 1, price: "$1.99", bonus: "Save 10%" },
      { qty: 5, price: "$8.99", bonus: "Save 10%" },
      { qty: 10, price: "$14.99", bonus: "Best Value" },
    ],
  };

  const getCurrentPlans = () => consumablePlans[activeTab];

  const handleBuy = async () => {
    try {
     // Fetch the current user
      const user = await userService.getCurrentUser();
      if (!user || !user.data) {
        console.error("No user data found");
        return;
      }

      // Fetch the current consumable data for the user
      const consumableResponse = await consumableService.getConsumablesByUserId(user.data.id);
      if (!consumableResponse.data) {
        console.error("No consumable data found for user");
        return;
      }

      const currentConsumable = consumableResponse.data;
      const selectedPlan = getCurrentPlans()[selectedPack];

      // Prepare the updated consumable data
      const updatedConsumableData = {
        super_likes_balance:
          activeTab === "superlike"
            ? (currentConsumable.super_likes_balance || 0) + selectedPlan.qty
            : currentConsumable.super_likes_balance || 0,
        boosts_balance:
          activeTab === "boost"
            ? (currentConsumable.boosts_balance || 0) + selectedPlan.qty
            : currentConsumable.boosts_balance || 0,
      };

      // Validate the updated consumable data
      const validationErrors = consumableService.validateConsumableData(updatedConsumableData);
      if (validationErrors.length > 0) {
        console.error("Validation errors:", validationErrors);
        return;
      }

      // Update the consumable data
      await consumableService.updateConsumable(user.data.id, updatedConsumableData);
      console.log(`Successfully purchased ${selectedPlan.qty} ${activeTab === "superlike" ? "Super Likes" : "Boosts"}`);
      alert(`Successfully purchased ${selectedPlan.qty} ${activeTab === "superlike" ? "Super Likes" : "Boosts"}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Consumables" />
      <Tabs
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedPack(0);
        }}
      />

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
        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
        label={`Buy ${getCurrentPlans()[selectedPack].qty} ${
          activeTab === "superlike" ? "Super Likes" : "Boosts"
        } for ${getCurrentPlans()[selectedPack].price}`}
        onPress={() => {
          handleBuy();
        }}
      />
    </View>
  );
}
