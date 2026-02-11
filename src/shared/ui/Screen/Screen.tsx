import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { colors, spacing } from "../../theme";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  scroll?: boolean;
};

export function Screen({ children, style, scroll = false }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, style]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{ ...({ scrollbarWidth: "none" } as any) }}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.container, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  container: { flex: 1, padding: spacing.lg },

  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});

//@ts-ignore
if (
  typeof document !== "undefined" &&
  !document.getElementById("hide-scrollbars")
) {
  const style = document.createElement("style");
  style.id = "hide-scrollbars";
  style.innerHTML = `
    ::-webkit-scrollbar { display: none; }
  `;
  document.head.appendChild(style);
}
