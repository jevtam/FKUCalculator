import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { colors, spacing } from "../theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  scroll?: boolean;
  footer?: React.ReactNode;
};

export function FullScreenModal({
  visible,
  onClose,
  children,
  contentStyle,
  scroll = true,
  footer,
}: Props) {
  const insets = useSafeAreaInsets();

  // футер сам учитывает низ (home indicator / жесты)
  const footerPaddingBottom = spacing.lg + insets.bottom;

  // чтобы контент не уезжал под футер — даём ему нижний отступ,
  // но только если футер вообще есть
  const contentPaddingBottom = footer ? spacing.lg : footerPaddingBottom;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.root}>
            {scroll ? (
              <ScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={[
                  styles.content,
                  { paddingBottom: contentPaddingBottom },
                  contentStyle,
                ]}
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
            ) : (
              <View
                style={[
                  styles.content,
                  { paddingBottom: contentPaddingBottom },
                  contentStyle,
                ]}
              >
                {children}
              </View>
            )}

            {footer ? (
              <View
                style={[
                  styles.footer,
                  { paddingBottom: footerPaddingBottom },
                ]}
              >
                {footer}
              </View>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  kav: { flex: 1 },

  root: { flex: 1 },

  content: {
    flex: 1,
    flexGrow: 1,
    padding: spacing.lg,
    backgroundColor: colors.bg,
  },

  footer: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.bg,
  },
});