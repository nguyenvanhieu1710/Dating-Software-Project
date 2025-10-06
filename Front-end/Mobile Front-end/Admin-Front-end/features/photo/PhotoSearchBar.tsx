import * as React from "react";
import { Searchbar, useTheme } from "react-native-paper";

type Props = {
  query: string;
  onChangeQuery: (text: string) => void;
};

export default function PhotoSearchBar({ query, onChangeQuery }: Props) {
  const theme = useTheme();

  return (
    <Searchbar
      placeholder="Search photos by user name, email, or ID..."
      value={query}
      onChangeText={onChangeQuery}
      style={{
        margin: 12,
        borderRadius: 12,
        backgroundColor: theme.colors.surface,
      }}
      inputStyle={{
        fontFamily: theme.fonts.bodyLarge.fontFamily,
      }}
    />
  );
}
