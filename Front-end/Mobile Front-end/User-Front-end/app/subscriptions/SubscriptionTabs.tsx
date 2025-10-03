import React from "react";
import { SegmentedButtons, useTheme } from "react-native-paper";

interface SubscriptionTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export default function SubscriptionTabs({ activeTab, setActiveTab }: SubscriptionTabsProps) {
  const theme = useTheme();
  return (
    <SegmentedButtons
      value={activeTab}
      onValueChange={setActiveTab}
      buttons={[
        { value: "gold", label: "Gold" },
        { value: "platinum", label: "Platinum" },
        { value: "plus", label: "Plus" },
      ]}
      style={{
        marginHorizontal: 20,
        marginVertical: 10,        
      }}
      theme={{
        fonts: {
          labelLarge: {
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          },
        },
      }}
    />
  );
}
