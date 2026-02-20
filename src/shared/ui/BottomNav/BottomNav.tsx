import React from "react";
import { Pressable, StyleSheet, View, Image } from "react-native";
import { colors, spacing } from "../../theme";
import { navIcons } from "../../icons/navIcons";
import type { RouteKey } from "../../../app/AppShell";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  active: RouteKey;
  onChange: (next: RouteKey) => void;
};

const items: Array<{ key: RouteKey; label: string; icon: any }> = [
  { key: "catalog", label: "Каталог", icon: navIcons.catalog },
  { key: "diary", label: "Дневник", icon: navIcons.diary },
  { key: "options", label: "Опции", icon: navIcons.options },
];

export function BottomNav({ active, onChange }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom + spacing.sm }]}>
      {items.map((it) => {
        const isActive = it.key === active;
        return (
          <Pressable
            key={it.key}
            onPress={() => onChange(it.key)}
            style={styles.item}
          >
            <Image
              source={it.icon}
              style={[styles.icon, isActive && styles.iconActive]}
              resizeMode="contain"
            />
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
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.bg,
  },
  item: { flex: 1, alignItems: "center", gap: 6 },
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
  icon: { width: 22, height: 22, tintColor: colors.muted },
  iconActive: { tintColor: colors.text },
});
