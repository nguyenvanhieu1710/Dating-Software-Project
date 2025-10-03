import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import Header from "./../messages/ChatHeader";
import SearchBar from "./../messages/SearchBar";
import MatchList from "./../messages/MatchList";
import ConversationList from "./../messages/ConversationList";
import { getMatches, Match } from "@/services/matchApi";
import { useRouter } from "expo-router";

export default function MessagesScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [conversations, setConversations] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatchesAndConversations = async () => {
      try {
        setIsLoading(true);
        const matchesData = await getMatches();
        setMatches(matchesData);
        const conversationsData = matchesData.filter(
          (match) => match.message_count > 0
        );
        setConversations(conversationsData);
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
