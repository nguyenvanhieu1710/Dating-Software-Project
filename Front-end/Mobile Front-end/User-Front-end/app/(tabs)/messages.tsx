import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import Header from "./../messages/ChatHeader";
import SearchBar from "./../messages/SearchBar";
import MatchList from "./../messages/MatchList";
import ConversationList from "./../messages/ConversationList";
import { userService } from "@/services/user.service";
import { matchService } from "@/services/match.service";
import { IMatch } from "@/types/matche";
import { photoService } from "@/services/photo.service";
import { useRouter } from "expo-router";

export default function MessagesScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<IMatch[]>([]);
  const [conversations, setConversations] = useState<IMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatchesAndConversations = async () => {
      try {
        setIsLoading(true);
        const user = await userService.getCurrentUser();
        const userId = user.data?.id;
        // console.log("userId", userId);
        // const usersResponse = await userService.getAllUsers();
        // const allUsers = usersResponse?.data || [];
        // console.log("allUsers", allUsers);
        const matchOfUser = await matchService.getMatchesByUserId(
          Number(userId)
        );
        console.log("matchOfUser", matchOfUser);
        if (matchOfUser.success && Array.isArray(matchOfUser.data)) {
          const uniqueMatches = matchOfUser.data.reduce(
            (acc: IMatch[], current: IMatch) => {
              const exists = acc.find(
                (item) => item.other_user_id === current.other_user_id
              );
              if (!exists) acc.push(current);
              return acc;
            },
            []
          );

          uniqueMatches.sort(
            (a, b) =>
              new Date(b.last_message_at).getTime() -
              new Date(a.last_message_at).getTime()
          );

          const matchesWithDetails = await Promise.all(
            uniqueMatches.map(async (match) => {
              try {
                const photosResponse = await photoService.getPhotosByUserId(
                  Number(match.other_user_id)
                );
                if (
                  photosResponse.success &&
                  Array.isArray(photosResponse.data) &&
                  photosResponse.data.length > 0
                ) {
                  const sortedPhotos = photosResponse.data.sort(
                    (a, b) => a.order_index - b.order_index
                  );
                  match.photo_url = `${process.env.EXPO_PUBLIC_API_URL}${sortedPhotos[0].url}`;
                } else {
                  match.photo_url = `${process.env.EXPO_PUBLIC_API_URL}/avatar.jpg`;
                }
              } catch (err) {
                console.log("photo error", err);
                match.photo_url = `${process.env.EXPO_PUBLIC_API_URL}/avatar.jpg`;
              }

              return match;
            })
          );

          setMatches(matchesWithDetails);

          const conversationsData = matchesWithDetails.filter(
            (m) => Number(m.message_count) > 0
          );
          setConversations(conversationsData);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatchesAndConversations();
  }, []);

  const handleMatchPress = (matchId: number) => {
    router.push({ pathname: "/chat", params: { matchId: matchId.toString() } });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9FB" }}>
      <Header />
      <SearchBar />
      <MatchList
        matches={matches}
        isLoading={isLoading}
        onPressMatch={handleMatchPress}
      />
      <ConversationList
        conversations={conversations}
        isLoading={isLoading}
        onPressConversation={handleMatchPress}
      />
    </SafeAreaView>
  );
}
