import React, { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../shared/ui/Screen";
import { colors, spacing, typography } from "../../shared/theme";

import { useProducts } from "../../features/products/model/useProducts";
import { ProductsList } from "../../features/products/ui/ProductsList";
import { ProductFormModal } from "../../features/products/ui/ProductFormModal";
import type { Product } from "../../features/products/model/types";

type Tab = "products" | "dishes";

export function CatalogScreen() {
  const [tab, setTab] = useState<Tab>("products");

  const { isReady, items, add, update, remove } = useProducts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Product | null>(null);

  const modalMode = editItem ? "edit" : "create";

  const title = useMemo(
    () => (tab === "products" ? "Продукты" : "Блюда"),
    [tab],
  );

  return (
    <Screen style={{ paddingBottom: spacing.md }}>
      <View style={styles.topRow}>
        <View style={styles.tabs}>
          <Pressable onPress={() => setTab("products")} style={styles.tabBtn}>
            <Text
              style={[
                styles.tabText,
                tab === "products" && styles.tabTextActive,
              ]}
            >
              Продукты
            </Text>
            {tab === "products" && <View style={styles.underline} />}
          </Pressable>

          <Pressable onPress={() => setTab("dishes")} style={styles.tabBtn}>
            <Text
              style={[styles.tabText, tab === "dishes" && styles.tabTextActive]}
            >
              Блюда
            </Text>
            {tab === "dishes" && <View style={styles.underline} />}
          </Pressable>
        </View>

        <Pressable
          onPress={() => {
            setEditItem(null);
            setModalOpen(true);
          }}
          style={styles.addBtn}
        >
          <Text style={styles.addBtnText}>+ Добавить</Text>
        </Pressable>
      </View>

      {!isReady ? (
        <Text style={{ color: colors.muted }}>Загрузка…</Text>
      ) : tab === "products" ? (
        <ProductsList
          items={items}
          onEdit={(p) => {
            setEditItem(p);
            setModalOpen(true);
          }}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: colors.muted }}>Блюда потом</Text>
        </View>
      )}

      <ProductFormModal
        visible={modalOpen}
        mode={modalMode}
        initial={editItem}
        onClose={() => setModalOpen(false)}
        onSubmit={(draft) => {
          try {
            if (editItem) update(editItem.id, draft);
            else add(draft);

            setModalOpen(false);
            setEditItem(null);
          } catch (e: any) {
            Alert.alert("Ошибка", e?.message ?? "Проверьте поля");
          }
        }}
        onDelete={() => {
          if (!editItem) return;

          Alert.alert("Удалить продукт?", editItem.name, [
            { text: "Отмена", style: "cancel" },
            {
              text: "Удалить",
              style: "destructive",
              onPress: () => {
                remove(editItem.id);
                setModalOpen(false);
                setEditItem(null);
              },
            },
          ]);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  tabs: { flexDirection: "row", gap: spacing.lg },
  tabBtn: { paddingVertical: spacing.xs },
  tabText: { fontSize: typography.h2, color: colors.muted },
  tabTextActive: { color: colors.text },
  underline: { height: 2, backgroundColor: colors.text, marginTop: 6 },

  addBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  addBtnText: { color: colors.text, fontWeight: "700" },
});
