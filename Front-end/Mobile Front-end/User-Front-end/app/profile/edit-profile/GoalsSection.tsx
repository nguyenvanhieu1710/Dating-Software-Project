import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { SelectableItem } from "./SelectableItem";

interface GoalsSectionProps {
  goals: string[];
  selectedGoals: string[];
  onToggleGoal: (goal: string) => void;
}

const GoalsSection: React.FC<GoalsSectionProps> = ({
  goals,
  selectedGoals,
  onToggleGoal,
}) => {
  const theme = useTheme();
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <Text
          variant="titleMedium"
          style={[
            styles.title,
            {
              fontFamily: theme.fonts.bodyLarge.fontFamily,
            },
          ]}
        >
          Relationship Goals
        </Text>
        <View style={styles.container}>
          {goals.map((goal) => (
            <SelectableItem
              key={goal}
              label={goal}
              selected={selectedGoals.includes(goal)}
              onPress={() => onToggleGoal(goal)}
            />
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

export default GoalsSection;

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
});
