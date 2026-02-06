import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../../shared/theme";
import type { Product } from "../model/types";

type Props = {
  items: Product[];
  onEdit: (p: Product) => void;
};

export function ProductsList({ items, onEdit }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.hName}>Название</Text>
        <Text style={styles.hCol}>НБ</Text>
        <Text style={styles.hCol}>ФА</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => (
          <Pressable onPress={() => onEdit(item)} style={styles.row}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.col}>{item.proteinPer100g.toFixed(1)}</Text>
            <Text style={styles.col}>{Math.round(item.faPer100g)}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  hName: {
    flex: 1,
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.text,
  },
  hCol: {
    width: 56,
    textAlign: "right",
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.text,
  },

  sep: { height: 1, backgroundColor: colors.border },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  name: { flex: 1, fontSize: typography.body, color: colors.text },
  col: {
    width: 56,
    textAlign: "right",
    fontSize: typography.body,
    color: colors.text,
  },
});
