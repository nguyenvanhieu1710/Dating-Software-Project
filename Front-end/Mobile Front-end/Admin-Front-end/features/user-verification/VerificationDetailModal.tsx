import * as React from "react";
import { View, ScrollView, Dimensions, Text } from "react-native";
import { Dialog, Portal, useTheme, IconButton } from "react-native-paper";
import { IUserVerification } from "@/types/user-verification";
import UserInfoSection from "./UserInfoSection";
import PhotoGallery from "./PhotoGallery";
import VerificationChecklist from "./VerificationChecklist";
import VerificationActionsPanel from "./VerificationActionsPanel";
import RejectionReasonDialog from "./RejectionReasonDialog";

type Props = {
  visible: boolean;
  verification: IUserVerification | null;
  onClose: () => void;
  onVerified: (id: number, notes: string) => Promise<void>;
  onReject: (id: number, reason: string, notes: string) => Promise<void>;
  onFlag: (id: number, notes: string) => Promise<void>;
};

export default function VerificationDetailModal({
  visible,
  verification,
  onClose,
  onVerified,
  onReject,
  onFlag,
}: Props) {
  const theme = useTheme();
  const [notes, setNotes] = React.useState("");
  const [showRejectDialog, setShowRejectDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (verification) {
      setNotes(verification.notes || "");
    }
  }, [verification]);

  const handleVerified = async () => {
    if (!verification) return;
    setLoading(true);
    try {
      await onVerified(verification.id, notes);
      onClose();
    } catch (error) {
      console.error("Error approving:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = async (reason: string, detail: string) => {
    if (!verification) return;
    setLoading(true);
    try {
      const fullNotes = detail ? `${reason}: ${detail}` : reason;
      await onReject(verification.id, reason, fullNotes);
      setShowRejectDialog(false);
      onClose();
    } catch (error) {
      console.error("Error rejecting:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlag = async () => {
    if (!verification) return;
    setLoading(true);
    try {
      await onFlag(verification.id, notes);
      onClose();
    } catch (error) {
      console.error("Error flagging:", error);
    } finally {
      setLoading(false);
    }
  };

  const photos = verification?.evidence_url ? [verification.evidence_url] : [];

  if (!verification) return null;

  const isWideScreen = Dimensions.get("window").width > 768;

  return (
    <>
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={onClose}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 20,
            maxHeight: Dimensions.get("window").height * 0.9,
            maxWidth: Dimensions.get("window").width * 0.95,
            width: "100%",
            margin: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.outline + "20",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: "600", color: theme.colors.onSurface, fontFamily: theme.fonts.bodyLarge.fontFamily }}>
                Verification details
              </Text>
            </View>
            <IconButton icon="close" size={24} onPress={onClose} />
          </View>

          <Dialog.Content style={{ padding: 0, flex: 1 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View style={{ padding: 20 }}>
                {isWideScreen ? (
                  <View style={{ flexDirection: "row", gap: 20 }}>
                    <View style={{ flex: 1.2 }}>
                      <UserInfoSection verification={verification} />
                      <PhotoGallery photos={photos} />
                    </View>
                    <View style={{ flex: 0.8 }}>
                      <VerificationChecklist notes={notes} onNotesChange={setNotes} />
                      <VerificationActionsPanel
                        onVerified={handleVerified}
                        onReject={handleReject}
                        onFlag={handleFlag}
                        loading={loading}
                        disabled={loading}
                      />
                    </View>
                  </View>
                ) : (
                  <View>
                    <UserInfoSection verification={verification} />
                    <PhotoGallery photos={photos} />
                    <VerificationChecklist notes={notes} onNotesChange={setNotes} />
                    <VerificationActionsPanel
                      onVerified={handleVerified}
                      onReject={handleReject}
                      onFlag={handleFlag}
                      loading={loading}
                      disabled={loading}
                    />
                  </View>
                )}
              </View>
            </ScrollView>
          </Dialog.Content>
        </Dialog>
      </Portal>

      <RejectionReasonDialog
        visible={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={handleRejectConfirm}
      />
    </>
  );
}