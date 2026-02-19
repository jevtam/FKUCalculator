import React, { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../shared/ui/Screen";
import { colors, spacing, typography } from "../../shared/theme";

import { useProducts } from "../../features/products/model/useProducts";
import { ProductsList } from "../../features/products/ui/ProductsList";
import { ProductFormModal } from "../../features/products/ui/ProductFormModal";
import type { Product } from "../../features/products/model/types";
import { confirmDialog } from "../../shared/lib/confirm";

type Tab = "products" | "dishes";

export function CatalogScreen() {
  const { isReady, items, add, update, remove } = useProducts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Product | null>(null);

  const modalMode = editItem ? "edit" : "create";

  return (
    <Screen scroll style={{ paddingBottom: spacing.md }}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Продукты</Text>

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
      ) : (
        <ProductsList
          items={items}
          onEdit={(p) => {
            setEditItem(p);
            setModalOpen(true);
          }}
        />
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
            alert(e?.message ?? "Проверьте поля");
          }
        }}
        onDelete={async () => {
          if (!editItem) return;

          const ok = await confirmDialog("Удалить продукт?", editItem.name);
          if (!ok) return;

          remove(editItem.id);
          setModalOpen(false);
          setEditItem(null);
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
  addBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  addBtnText: { color: colors.text, fontWeight: "700" },
  title: { fontSize: typography.h2, fontWeight: "800", color: colors.text },
});
