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
import { INotification } from "@/types/notification";
import NotificationToast from "../notification/Notification";

export default function MessagesScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<IMatch[]>([]);
  const [conversations, setConversations] = useState<IMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setIsLoading(true);

      const user = await userService.getCurrentUser();
      const userId = Number(user.data?.id);
      if (!userId) return;

      const res = await matchService.getMatchesByUserId(userId);
      if (!res.success || !Array.isArray(res.data)) return;

      const baseUrl = process.env.EXPO_PUBLIC_API_URL;
      const uniqueMatches = getUniqueMatches(res.data);
      const matchesWithPhotos = await attachPhotoUrls(uniqueMatches, baseUrl);

      setMatches(matchesWithPhotos);
      setConversations(matchesWithPhotos.filter((m) => Number(m.message_count) > 0));
    } catch (error) {
      console.log("Error fetching matches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUniqueMatches = (matches: IMatch[]) => {
    const unique = matches.reduce((acc: IMatch[], current: IMatch) => {
      if (!acc.find((item) => item.other_user_id === current.other_user_id)) {
        acc.push(current);
      }
      return acc;
    }, []);

    return unique.sort(
      (a, b) =>
        new Date(b.last_message_at).getTime() -
        new Date(a.last_message_at).getTime()
    );
  };

  const attachPhotoUrls = async (matches: IMatch[], baseUrl?: string) => {
    return Promise.all(
      matches.map(async (match) => {
        try {
          const photos = await photoService.getPhotosByUserId(Number(match.other_user_id));
          if (photos.success && Array.isArray(photos.data) && photos.data.length > 0) {
            const sorted = photos.data.sort((a, b) => a.order_index - b.order_index);
            match.photo_url = sorted[0].url.startsWith("http")
              ? sorted[0].url
              : `${baseUrl}${sorted[0].url}`;
          } else {
            match.photo_url = `${baseUrl}/avatar.jpg`;
          }
        } catch {
          match.photo_url = `${baseUrl}/avatar.jpg`;
        }
        return match;
      })
    );
  };

  const handleMatchPress = (matchId: number) => {
    router.push({ pathname: "/chat", params: { matchId: matchId.toString() } });
  };

  function handleNotificationPress(notification: INotification): void {
    console.log("Notification pressed:", notification);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9FB" }}>
      <NotificationToast onPress={handleNotificationPress} />
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
