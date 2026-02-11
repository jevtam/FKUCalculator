import React, { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../shared/ui/Screen";
import { colors, spacing, typography } from "../../shared/theme";
import { confirmDialog } from "../../shared/lib/confirm";

import { useProducts } from "../../features/products/model/useProducts";
import { useDiary } from "../../features/diary/model/useDiary";
import type { DiaryItem, MealId } from "../../features/diary/model/types";

import { MealCard } from "../../features/diary/ui/MealCard";
import { DiaryItemModal } from "../../features/diary/ui/DiaryItemModal";
import { AddMealModal } from "../../features/diary/ui/AddMealModal";
import { EditMealModal } from "../../features/diary/ui/EditMealModal";

export function DiaryScreen() {
  const { isReady: productsReady, items: products, byId } = useProducts();
  const {
    isReady: diaryReady,
    meals,
    addMeal,
    renameMeal,
    removeMeal,
    addItem,
    updateItem,
    removeItem,
  } = useDiary();

  const ready = productsReady && diaryReady;

  //модалка добавления/редактирования позиции
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [mealId, setMealId] = useState<MealId>("breakfast");
  const [editItem, setEditItem] = useState<DiaryItem | null>(null);

  //модалка добавления приема пищи
  const [mealModalOpen, setMealModalOpen] = useState(false);

  //модалка редактирования приема пищи
  const [editMealOpen, setEditMealOpen] = useState(false);
  const [editMealId, setEditMealId] = useState<MealId | null>(null);

  const itemModalMode = editItem ? "edit" : "create";

  const mealToEdit = useMemo(() => {
    return meals.find((m) => m.id === editMealId) ?? null;
  }, [meals, editMealId]);

  const openCreateItem = (mId: MealId) => {
    setMealId(mId);
    setEditItem(null);
    setItemModalOpen(true);
  };

  const openEditItem = (mId: MealId, item: DiaryItem) => {
    setMealId(mId);
    setEditItem(item);
    setItemModalOpen(true);
  };

  const openEditMeal = (mId: MealId) => {
    setEditMealId(mId);
    setEditMealOpen(true);
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name, "ru"));
  }, [products]);

  return (
    <Screen scroll>
      <View style={styles.topRow}>
        <Text style={styles.title}>Дневник</Text>

        <Pressable
          onPress={() => setMealModalOpen(true)}
          style={styles.addMealBtn}
        >
          <Text style={styles.addMealBtnText}>+ Прием пищи</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1, gap: spacing.lg }}>
        {meals.map((m) => (
          <MealCard
            key={m.id}
            title={m.title}
            items={m.items}
            productsById={byId}
            onAdd={() => openCreateItem(m.id)}
            onEdit={(it) => openEditItem(m.id, it)}
            canEditMeal={!m.isDefault} //дефолтные защищены от удаления
            onEditMeal={() => openEditMeal(m.id)}
          />
        ))}
      </View>

      {/*позиция внутри приема пищи*/}
      <DiaryItemModal
        visible={itemModalOpen}
        mode={itemModalMode}
        products={sortedProducts}
        initialProductId={editItem?.productId ?? null}
        initialGrams={editItem?.grams ?? null}
        onClose={() => {
          setItemModalOpen(false);
          setEditItem(null);
        }}
        onSubmit={(productId, grams) => {
          try {
            if (editItem) updateItem(mealId, editItem.id, productId, grams);
            else addItem(mealId, productId, grams);

            setItemModalOpen(false);
            setEditItem(null);
          } catch (e: any) {
            Alert.alert("Ошибка", e?.message ?? "Проверьте поля");
          }
        }}
        onDelete={async () => {
          if (!editItem) return;

          const ok = await confirmDialog(
            "Удалить позицию?",
            "Она исчезнет из приема пищи.",
          );
          if (!ok) return;

          removeItem(mealId, editItem.id);
          setItemModalOpen(false);
          setEditItem(null);
        }}
      />

      {/*добавить прием пищи*/}
      <AddMealModal
        visible={mealModalOpen}
        onClose={() => setMealModalOpen(false)}
        onSubmit={(title) => {
          try {
            addMeal(title);
            setMealModalOpen(false);
          } catch (e: any) {
            Alert.alert("Ошибка", e?.message ?? "Проверьте название");
          }
        }}
      />

      {/*переименование/удаление приема пищи*/}
      <EditMealModal
        visible={editMealOpen}
        titleInitial={mealToEdit?.title ?? ""}
        canDelete={!!mealToEdit && !mealToEdit.isDefault}
        onClose={() => {
          setEditMealOpen(false);
          setEditMealId(null);
        }}
        onSave={(title) => {
          try {
            if (!mealToEdit) return;
            //переименовываются только пользовательские
            if (mealToEdit.isDefault) return;

            renameMeal(mealToEdit.id, title);
            setEditMealOpen(false);
            setEditMealId(null);
          } catch (e: any) {
            Alert.alert("Ошибка", e?.message ?? "Проверьте название");
          }
        }}
        onDelete={async () => {
          if (!mealToEdit) return;
          if (mealToEdit.isDefault) return;

          const ok = await confirmDialog(
            "Удалить прием пищи?",
            "Все позиции внутри тоже будут удалены.",
          );
          if (!ok) return;

          removeMeal(mealToEdit.id);
          setEditMealOpen(false);
          setEditMealId(null);
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
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h2,
    fontWeight: "800",
    color: colors.text,
  },
  addMealBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  addMealBtnText: {
    color: colors.text,
    fontWeight: "800",
  },
});
