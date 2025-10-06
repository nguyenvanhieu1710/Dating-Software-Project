import React from 'react';
import { SegmentedButtons, useTheme } from 'react-native-paper';

type TabsProps = {
  activeTab: 'superlike' | 'boost';
  setActiveTab: (tab: 'superlike' | 'boost') => void;
};

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
    const theme = useTheme();
  return (
    <SegmentedButtons
      value={activeTab}
      onValueChange={setActiveTab}
      buttons={[
        { 
          value: "superlike", 
          label: "Super Like",
          icon: "heart"
        },
        { 
          value: "boost", 
          label: "Boost",
          icon: "flash"
        },
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
