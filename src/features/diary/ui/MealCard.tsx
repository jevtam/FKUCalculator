import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../../shared/theme";
import type { DiaryItem } from "../model/types";
import type { Product } from "../../products/model/types";
import {
  calcForGrams,
  addNutrition,
  roundFa,
  roundProtein,
} from "../../../shared/lib/nutrition";

type Props = {
  title: string;
  items: DiaryItem[];
  productsById: Map<string, Product>;
  onAdd: () => void;
  onEdit: (item: DiaryItem) => void;

  onEditMeal: () => void;
  canEditMeal: boolean;
};

export function MealCard({
  title,
  items,
  productsById,
  onAdd,
  onEdit,
  onEditMeal,
  canEditMeal,
}: Props) {
  const totals = useMemo(() => {
    return items.reduce(
      (acc, it) => {
        const p = productsById.get(it.productId);
        if (!p) return acc;

        const n = calcForGrams({
          grams: it.grams,
          proteinPer100g: p.proteinPer100g,
          faPer100g: p.faPer100g,
        });

        return addNutrition(acc, n);
      },
      { proteinG: 0, faMg: 0 },
    );
  }, [items, productsById]);

  const totalProtein = roundProtein(totals.proteinG);
  const totalFa = roundFa(totals.faMg);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.total}>
            НБ {totalProtein} & ФА {totalFa}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          {canEditMeal && (
            <Pressable onPress={onEditMeal} style={styles.editBtn}>
              <Text style={styles.editBtnText}>...</Text>
            </Pressable>
          )}

          <Pressable onPress={onAdd} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Добавить</Text>
          </Pressable>
        </View>
      </View>

      {items.length === 0 ? (
        <Text style={styles.empty}>Пусто</Text>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {/*заголовок сетки*/}
          <View style={styles.gridHeader}>
            <Text style={styles.gridHeaderName}>Название</Text>
            <Text style={styles.gridHeaderCol}>НБ</Text>
            <Text style={styles.gridHeaderCol}>ФА</Text>
          </View>

          {items.map((it) => {
            const p = productsById.get(it.productId);

            const n = p
              ? calcForGrams({
                  grams: it.grams,
                  proteinPer100g: p.proteinPer100g,
                  faPer100g: p.faPer100g,
                })
              : { proteinG: 0, faMg: 0 };

            const protein = roundProtein(n.proteinG);
            const fa = roundFa(n.faMg);

            return (
              <Pressable
                key={it.id}
                onPress={() => onEdit(it)}
                style={styles.row}
              >
                <View style={styles.nameBlock}>
                  <Text style={styles.name} numberOfLines={1}>
                    {p?.name ?? "Неизвестный продукт"}
                  </Text>
                  <Text style={styles.gramsSub}>{it.grams} г</Text>
                </View>

                <Text style={styles.col}>{protein}</Text>
                <Text style={styles.col}>{fa}</Text>
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
  headerLeft: { flex: 1, gap: 6 },

  title: { fontSize: typography.h2, fontWeight: "700", color: colors.text },
  total: { color: colors.muted, fontSize: typography.small },

  addBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  addBtnText: { fontWeight: "700", color: colors.text },

  editBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  editBtnText: { fontWeight: "700", color: colors.text },

  empty: { color: colors.muted },

  gridHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: spacing.sm,
  },
  gridHeaderName: {
    flex: 1,
    width: 64,
    textAlign: "left",
    fontSize: typography.small,
    color: colors.muted,
    fontWeight: "700",
  },
  gridHeaderCol: {
    width: 64,
    textAlign: "right",
    fontSize: typography.small,
    color: colors.muted,
    fontWeight: "700",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  nameBlock: { flex: 1, gap: 2 },
  name: { color: colors.text, fontSize: typography.body },
  gramsSub: { color: colors.muted, fontSize: typography.small },

  col: { width: 64, textAlign: "right", color: colors.text },
});
