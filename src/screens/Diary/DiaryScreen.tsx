import React, { useMemo, useState } from "react";
import { Alert, View } from "react-native";
import { Screen } from "../../shared/ui/Screen";
import { spacing } from "../../shared/theme";
import { confirmDialog } from "../../shared/lib/confirm";

import { useProducts } from "../../features/products/model/useProducts";
import { useDiary } from "../../features/diary/model/useDiary";
import type { MealKey } from "../../features/diary/model/types";
import type { DiaryItem } from "../../features/diary/model/types";

import { MealCard } from "../../features/diary/ui/MealCard";
import { DiaryItemModal } from "../../features/diary/ui/DiaryItemModal";

export function DiaryScreen() {
  const { isReady: productsReady, items: products, byId } = useProducts();
  const {
    isReady: diaryReady,
    state,
    addItem,
    updateItem,
    removeItem,
  } = useDiary();

  const ready = productsReady && diaryReady;

  const [modalOpen, setModalOpen] = useState(false);
  const [meal, setMeal] = useState<MealKey>("breakfast");
  const [editItem, setEditItem] = useState<DiaryItem | null>(null);

  const modalMode = editItem ? "edit" : "create";

  const openCreate = (m: MealKey) => {
    setMeal(m);
    setEditItem(null);
    setModalOpen(true);
  };

  const openEdit = (m: MealKey, item: DiaryItem) => {
    setMeal(m);
    setEditItem(item);
    setModalOpen(true);
  };

  const sortedProducts = useMemo(() => {
    //продукты уже отсортированы в useProducts, но пусть будет гарантированно
    return [...products].sort((a, b) => a.name.localeCompare(b.name, "ru"));
  }, [products]);

  return (
    <Screen>
      <View style={{ flex: 1, gap: spacing.lg }}>
        <MealCard
          title="Завтрак"
          meal="breakfast"
          items={state.breakfast}
          productsById={byId}
          onAdd={() => openCreate("breakfast")}
          onEdit={(it) => openEdit("breakfast", it)}
        />

        <MealCard
          title="Обед"
          meal="lunch"
          items={state.lunch}
          productsById={byId}
          onAdd={() => openCreate("lunch")}
          onEdit={(it) => openEdit("lunch", it)}
        />

        <MealCard
          title="Ужин"
          meal="dinner"
          items={state.dinner}
          productsById={byId}
          onAdd={() => openCreate("dinner")}
          onEdit={(it) => openEdit("dinner", it)}
        />
      </View>

      <DiaryItemModal
        visible={modalOpen}
        mode={modalMode}
        products={sortedProducts}
        initialProductId={editItem?.productId ?? null}
        initialGrams={editItem?.grams ?? null}
        onClose={() => setModalOpen(false)}
        onSubmit={(productId, grams) => {
          try {
            if (editItem) updateItem(meal, editItem.id, productId, grams);
            else addItem(meal, productId, grams);

            setModalOpen(false);
            setEditItem(null);
          } catch (e: any) {
            // В web Alert не всегда удобен — можно заменить на свою нотификацию позже
            Alert.alert("Ошибка", e?.message ?? "Проверьте поля");
          }
        }}
        onDelete={async () => {
          if (!editItem) return;
          const ok = await confirmDialog(
            "Удалить позицию?",
            "Она исчезнет из приёма пищи.",
          );
          if (!ok) return;

          removeItem(meal, editItem.id);
          setModalOpen(false);
          setEditItem(null);
        }}
      />
    </Screen>
  );
}
