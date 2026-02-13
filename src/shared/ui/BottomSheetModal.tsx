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
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.full}
      >
        <View style={styles.fullBottom}>
          <View style={[styles.sheet, sheetStyle]}>
            {scroll ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.content}
              >
                {children}
              </ScrollView>
            ) : (
              <View style={styles.content}>{children}</View>
            )}
          </View>
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
  full: { flex: 1 },
  fullBottom: { flex: 1, justifyContent: "flex-end" },

  sheet: {
    maxHeight: "85%",
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
