import React from "react";
import { TextInput } from "react-native-paper";

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  style?: object;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
  style,
}: SearchBarProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      left={<TextInput.Icon icon="magnify" color="#6D28D9" />}
      mode="flat"
      style={[
        {
          margin: 12,
          backgroundColor: "#F3E8FF",
          borderRadius: 12,
          fontSize: 16,
        },
        style,
      ]}
      placeholderTextColor="#7C3AED"
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      outlineColor="transparent"
      activeOutlineColor="transparent"
    />
  );
}