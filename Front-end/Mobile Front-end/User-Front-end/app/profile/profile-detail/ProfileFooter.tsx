import React, { useState } from "react";
import { View } from "react-native";
import { Button, Surface } from "react-native-paper";
import { useTheme } from "react-native-paper";
import { Platform } from "react-native";
import { userBlockService } from "@/services/user-block.service";
import { userService } from "@/services/user.service";
import { IUserBlock, CreateBlockRequest } from "@/types/user-block";
import { ReportUserModal } from "./ReportUserModal";
import { moderationService } from "@/services/moderation.service";
import {
  IModerationReport,
  CreateReportRequest,
} from "@/types/moderation-report";

interface ProfileFooterProps {
  userId: string;
  onShareProfile?: (userId: string) => void;
  onBlock?: (userId: string) => void;
  onReport?: (userId: string) => void;
}

export const ProfileFooter: React.FC<ProfileFooterProps> = ({
  userId,
  onShareProfile,
  onBlock,
  onReport,
}) => {
  const theme = useTheme();
  const [reportVisible, setReportVisible] = useState(false);

  const handleShareProfile = () => {
    onShareProfile?.(userId);
  };

  const handleBlock = async () => {
    try {
      onBlock?.(userId);
      const currentUser = await userService.getCurrentUser();
      if (!currentUser.data) return;
      const blockData: CreateBlockRequest = {
        blocker_id: Number(currentUser.data.id),
        blocked_id: Number(userId),
      };
      const response = await userBlockService.blockUser(blockData);
      console.log("Block response: ", response);
      if (response.success) {
        alert("User blocked successfully");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleReport = async () => {
    try {
      setReportVisible(true);
      onReport?.(userId);
    } catch (error) {
      throw error;
    }
  };

  return (
    <View>
      <Surface
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
          paddingBottom: Platform.OS === "ios" ? 30 : 16,
          paddingHorizontal: 16,
          backgroundColor: theme.colors.surface,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "stretch",
            marginTop: 8,
            gap: 12,
          }}
        >
          <Button
            mode="contained"
            style={{
              width: "100%",
              borderRadius: 8,
              paddingVertical: 8,
            }}
            onPress={handleShareProfile}
            theme={{
              fonts: {
                labelLarge: {
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                },
              },
            }}
          >
            Share Profile
          </Button>
          <Button
            mode="contained"
            style={{
              width: "100%",
              borderRadius: 8,
              paddingVertical: 8,
            }}
            onPress={handleBlock}
            theme={{
              fonts: {
                labelLarge: {
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                },
              },
            }}
          >
            Block
          </Button>
          <Button
            mode="contained"
            style={{
              width: "100%",
              borderRadius: 8,
              paddingVertical: 8,
            }}
            onPress={handleReport}
            theme={{
              fonts: {
                labelLarge: {
                  fontFamily: theme.fonts.bodyLarge.fontFamily,
                },
              },
            }}
          >
            Report
          </Button>
        </View>
      </Surface>
      <ReportUserModal
        visible={reportVisible}
        userId={userId}
        onClose={() => setReportVisible(false)}
        onSubmit={async (data) => {
          try {
            const currentUser = await userService.getCurrentUser();
            if (!currentUser.data) return;

            const reportData: CreateReportRequest = {
              reporter_id: Number(currentUser.data.id),
              reported_user_id: Number(userId),
              content_type: "user",
              reason: data.reason,
              description: data.description,
            };

            const response = await moderationService.createReport(reportData);
            console.log("Report response:", response);

            if (response.success) {
              alert("User reported successfully");
            } else {
              alert("Failed to submit report");
            }
          } catch (err) {
            console.error("Error reporting user:", err);
            alert("An error occurred while reporting");
          }
        }}
      />
    </View>
  );
};
