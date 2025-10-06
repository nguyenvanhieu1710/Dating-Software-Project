import * as React from "react";
import { View, Text } from "react-native";
import { useTheme, Checkbox } from "react-native-paper";
import TextField from "@/components/inputs/TextField";

type Props = {
  notes: string;
  onNotesChange: (notes: string) => void;
};

export default function VerificationChecklist({ notes, onNotesChange }: Props) {
  const theme = useTheme();
  const [checks, setChecks] = React.useState({
    clearPhoto: false,
    noViolation: false,
    validInfo: false,
    noSpam: false,
  });

  const toggleCheck = (key: keyof typeof checks) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const checklistItems = [
    { key: "clearPhoto", label: "Image clear, no violation" },
    { key: "noViolation", label: "No sensitive content/violence" },
    { key: "validInfo", label: "Valid info (age ≥18)" },
    { key: "noSpam", label: "No spam/bot" },
  ];

  return (
    <View style={{ 
      backgroundColor: theme.colors.surfaceVariant, 
      borderRadius: 12, 
      padding: 16, 
      marginBottom: 16 
    }}>
      <Text style={{ 
        fontSize: 16, 
        fontWeight: "700", 
        color: theme.colors.onSurface, 
        marginBottom: 16,
        fontFamily: theme.fonts.bodyLarge.fontFamily,
      }}>
        Verification Checklist
      </Text>

      {checklistItems.map((item) => (
        <View key={item.key} style={{ 
          flexDirection: "row", 
          alignItems: "center", 
          marginBottom: 8,
          backgroundColor: theme.colors.surface,
          padding: 8,
          borderRadius: 8,
        }}>
          <Checkbox
            status={checks[item.key as keyof typeof checks] ? "checked" : "unchecked"}
            onPress={() => toggleCheck(item.key as keyof typeof checks)}
          />
          <Text style={{ 
            fontSize: 14, 
            color: theme.colors.onSurface, 
            flex: 1, 
            marginLeft: 8,
            fontFamily: theme.fonts.bodyLarge.fontFamily,
          }}>
            {item.label}
          </Text>
        </View>
      ))}

      <View style={{ 
        marginTop: 16, 
        paddingTop: 16, 
        borderTopWidth: 1, 
        borderTopColor: theme.colors.outline + "30" 
      }}>
        <Text style={{ 
          fontSize: 14, 
          fontWeight: "600", 
          color: theme.colors.onSurface, 
          marginBottom: 8,
          fontFamily: theme.fonts.bodyLarge.fontFamily,
        }}>
          Admin Notes
        </Text>
        <TextField
          label="Notes"
          value={notes}
          onChangeText={onNotesChange}
          placeholder="Enter notes (reason for rejection, warning...)"
          multiline
          numberOfLines={4}
          style={{
            backgroundColor: theme.colors.surface,
          }}
        />
      </View>
    </View>
  );
}