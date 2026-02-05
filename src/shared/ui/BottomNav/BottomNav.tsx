import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../theme";
import type { RouteKey } from "../../../app/AppShell";

type Props = {
  active: RouteKey;
  onChange: (next: RouteKey) => void;
};

const items: Array<{ key: RouteKey; label: string; icon: string }> = [
  { key: "catalog", label: "Каталог", icon: "✎" },
  { key: "diary", label: "Дневник", icon: "🧾" },
  { key: "options", label: "Опции", icon: "⚙" },
];

export function BottomNav({ active, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      {items.map((it) => {
        const isActive = it.key === active;
        return (
          <Pressable
            key={it.key}
            onPress={() => onChange(it.key)}
            style={styles.item}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>
              {it.icon}
            </Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {it.label}
            </Text>
            {isActive ? (
              <View style={styles.underline} />
            ) : (
              <View style={styles.underlineGhost} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.bg,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  icon: {
    fontSize: 22,
    color: colors.muted,
  },
  iconActive: {
    color: colors.text,
  },
  label: {
    fontSize: typography.small,
    color: colors.muted,
  },
  labelActive: {
    color: colors.text,
    fontWeight: "600",
  },
  underline: {
    height: 2,
    alignSelf: "stretch",
    backgroundColor: colors.text,
    marginTop: 4,
  },
  underlineGhost: {
    height: 2,
    alignSelf: "stretch",
    backgroundColor: "transparent",
    marginTop: 4,
  },
});
