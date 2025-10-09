import React from "react";
import { FlatList, View } from "react-native";
import LikesCard from "./LikesCard";
import { SwipedUser } from "@/types/swipe";

type Props = {
  users: SwipedUser[];
  isGold: boolean;
  calculateAge: (dob: string) => number;
};

export default function LikesGrid({ users, isGold, calculateAge }: Props) {
  return (
    <View>
      {isGold && (
        <FlatList
          data={users}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <LikesCard
              user={item}
              isGold={isGold}
              calculateAge={calculateAge}
            />
          )}
          contentContainerStyle={{ alignItems: "center" }}
        />
      )}
    </View>
  );
}
