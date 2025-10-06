import React from "react";
import { View } from "react-native";
import { Surface } from "react-native-paper";

type OnboardingDotsProps = {
  steps: number;
  currentStep: number;
};

export default function OnboardingDots({
  steps,
  currentStep,
}: OnboardingDotsProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 32,
      }}
    >
      {Array.from({ length: steps }).map((_, index) => (
        <Surface
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            marginHorizontal: 4,
            backgroundColor: index === currentStep ? "#8B5CF6" : "#D1D5DB",
          }}
          elevation={index === currentStep ? 2 : 0}
          children={undefined}
        />
      ))}
    </View>
  );
}
