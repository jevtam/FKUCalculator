import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../../shared/theme";
import type { DiaryItem, MealKey } from "../model/types";
import type { Product } from "../../products/model/types";

type Props = {
  title: string;
  meal: MealKey;
  items: DiaryItem[];
  productsById: Map<string, Product>;
  onAdd: () => void;
  onEdit: (item: DiaryItem) => void;
};

export function MealCard({ title, items, productsById, onAdd, onEdit }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        <Pressable onPress={onAdd} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Добавить</Text>
        </Pressable>
      </View>

      {items.length === 0 ? (
        <Text style={styles.empty}>Пусто</Text>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {items.map((it) => {
            const p = productsById.get(it.productId);
            return (
              <Pressable
                key={it.id}
                onPress={() => onEdit(it)}
                style={styles.row}
              >
                <Text style={styles.name} numberOfLines={1}>
                  {p?.name ?? "Неизвестный продукт"}
                </Text>
                <Text style={styles.grams}>{it.grams} г</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.lg,
    backgroundColor: colors.bg,
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: typography.h2, fontWeight: "700", color: colors.text },

  addBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  addBtnText: { fontWeight: "700", color: colors.text },

  empty: { color: colors.muted },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: { flex: 1, color: colors.text, fontSize: typography.body },
  grams: { width: 80, textAlign: "right", color: colors.muted },
});
