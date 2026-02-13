import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { spacing } from "../theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  sheetStyle?: ViewStyle;
  scroll?: boolean;
};

export function BottomSheetModal({
  visible,
  onClose,
  children,
  sheetStyle,
  scroll = true,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={styles.backdrop}
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.kav}
      >
        <View style={[styles.sheet, sheetStyle]}>
          {scroll ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={styles.noScrollContent}>{children}</View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  kav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },

  sheet: {
    maxHeight: "85%",
  },

  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  noScrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
