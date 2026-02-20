import React from "react";
import { ScrollView, StyleSheet, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../../theme";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  scroll?: boolean;
};

export function Screen({ children, style, scroll = false }: Props) {
  const base: ViewStyle = {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[base, styles.scrollExtra, style]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[base, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scrollView: { ...({ scrollbarWidth: "none" } as any) },
  scrollExtra: { paddingBottom: spacing.xl },
});
