import React, { useState } from "react";
import { View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import OnboardingStep from "./onboarding/OnboardingStep";
import OnboardingDots from "./onboarding/OnboardingDots";
import { useTheme } from "react-native-paper";

const ONBOARDING_STEP1_IMAGE = require("../assets/images/avatar.jpg");
const ONBOARDING_STEP2_IMAGE = require("../assets/images/avatar.jpg");
const ONBOARDING_STEP3_IMAGE = require("../assets/images/avatar.jpg");

const ONBOARDING_STEPS = [
  {
    title: "Find Your Match",
    subtitle: "Discover people who share your interests",
    image: ONBOARDING_STEP1_IMAGE,
  },
  {
    title: "Real Connections",
    subtitle: "Build meaningful relationships",
    image: ONBOARDING_STEP2_IMAGE,
  },
  {
    title: "Start Your Journey",
    subtitle: "Ready to find the love of your life?",
    image: ONBOARDING_STEP3_IMAGE,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const theme = useTheme();

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/login");
    }
  };

  const handleSkip = () => {
    router.push("/login");
  };

  const currentStepData = ONBOARDING_STEPS[currentStep];

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        padding: 24,
        backgroundColor: "#fff",
      }}
    >
      {/* Skip button */}
      <IconButton
        icon="close"
        size={24}
        onPress={handleSkip}
        style={{ position: "absolute", top: 40, right: 20 }}
      />

      {/* Content */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <OnboardingStep
          title={currentStepData.title}
          subtitle={currentStepData.subtitle}
          image={currentStepData.image}
        />
      </View>

      {/* Footer */}
      <View>
        <OnboardingDots
          steps={ONBOARDING_STEPS.length}
          currentStep={currentStep}
        />
        <Button
          mode="contained"
          onPress={handleNext}
          style={{ borderRadius: 12, paddingVertical: 6 }}
          labelStyle={{
            fontSize: 16,
            fontWeight: "600",
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}
        >
          {currentStep === ONBOARDING_STEPS.length - 1
            ? "Get Started"
            : "Continue"}
        </Button>
      </View>
    </View>
  );
}
