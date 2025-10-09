import React, { useState } from "react";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Button, Surface, useTheme } from "react-native-paper";
import Header from "@/components/header/Header";
import ButtonFooter from "@/components/footer/ButtonFooter";
import FeatureCard from "./subscriptions/FeatureCard";
import SubscriptionTabs from "./subscriptions/SubscriptionTabs";

export default function SubscriptionsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("gold");
  const theme = useTheme();

  const subscriptionPlans = {
    plus: {
      price: "$4.99/month",
      features: [
        {
          icon: "heart",
          title: "Unlimited Likes",
          description: "Like as many profiles as you want",
        },
        {
          icon: "refresh",
          title: "Rewind",
          description: "Undo your last swipe",
        },
        {
          icon: "star-outline",
          title: "1 Super Like/week",
          description: "Stand out with Super Likes",
        },
        {
          icon: "eye-off",
          title: "Hide Ads",
          description: "Browse without interruptions",
        },
      ],
    },
    gold: {
      price: "$9.99/month",
      features: [
        {
          icon: "heart",
          title: "Unlimited Likes",
          description: "Like as many profiles as you want",
        },
        {
          icon: "eye",
          title: "See Who Likes You",
          description: "Know who already liked you",
        },
        {
          icon: "star",
          title: "5 Super Likes/week",
          description: "More chances to stand out",
        },
        {
          icon: "refresh",
          title: "Rewind",
          description: "Undo your last swipe",
        },
        {
          icon: "rocket",
          title: "1 Boost/month",
          description: "Be a top profile in your area",
        },
      ],
    },
    platinum: {
      price: "$19.99/month",
      features: [
        {
          icon: "heart",
          title: "All Gold Features",
          description: "Everything from Gold plan",
        },
        {
          icon: "chatbubble",
          title: "Message Before Matching",
          description: "Send a message with Super Like",
        },
        {
          icon: "trending-up",
          title: "Priority Likes",
          description: "Your likes are seen first",
        },
        {
          icon: "star",
          title: "10 Super Likes/week",
          description: "Maximum Super Likes",
        },
        {
          icon: "rocket",
          title: "2 Boosts/month",
          description: "Double the visibility",
        },
      ],
    },
  };

  const getCurrentPlan = () =>
    subscriptionPlans[activeTab as keyof typeof subscriptionPlans];

  return (
    <Surface style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Subscriptions" />

      {/* Tabs */}
      <SubscriptionTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      <ScrollView
        style={{ flex: 1, backgroundColor: "#F9FAFB" }}
        contentContainerStyle={{ padding: 20 }}
      >
        {getCurrentPlan().features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </ScrollView>

      {/* Footer */}
      <ButtonFooter
        label="Subscribe for"
        price={getCurrentPlan().price}
        onPress={() => console.log("Subscribe")}
      />
    </Surface>
  );
}
