import React from "react";
import { SafeAreaView, StyleSheet, View, ViewStyle } from "react-native";
import { colors, spacing } from "../../theme";

type Props = { children: React.ReactNode; style?: ViewStyle };

export function Screen({ children, style }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: spacing.lg },
});
