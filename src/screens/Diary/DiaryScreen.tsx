import React, { useMemo, useState } from "react";
import { Alert, ScrollView, Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

import { Screen } from "../../shared/ui/Screen";
import { colors, spacing, typography } from "../../shared/theme";
import { confirmDialog } from "../../shared/lib/confirm";

import { useProducts } from "../../features/products/model/useProducts";
import { useDiaryByDate } from "../../features/diary/model/useDiaryByDate";
import type { DiaryItem, MealId } from "../../features/diary/model/types";

import { MealCard } from "../../features/diary/ui/MealCard";
import { DiaryItemModal } from "../../features/diary/ui/DiaryItemModal";
import { AddMealModal } from "../../features/diary/ui/AddMealModal";
import { EditMealModal } from "../../features/diary/ui/EditMealModal";

function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function DiaryScreen() {
  const { isReady: productsReady, items: products, byId } = useProducts();

  const [selectedDate, setSelectedDate] = useState<string>(todayISO());

  const {
    isReady: diaryReady,
    meals,
    addMeal,
    renameMeal,
    removeMeal,
    addItem,
    updateItem,
    removeItem,
  } = useDiaryByDate(selectedDate);

  const ready = productsReady && diaryReady;

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [mealId, setMealId] = useState<MealId>("breakfast");
  const [editItem, setEditItem] = useState<DiaryItem | null>(null);

  //добавить прием пищи
  const [mealModalOpen, setMealModalOpen] = useState(false);

  //редактировать прием пищи
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
    <Screen>
      <View style={styles.topRow}>
        <Text style={styles.title}>Дневник</Text>
        <Pressable
          onPress={() => setMealModalOpen(true)}
          style={styles.addMealBtn}
        >
          <Text style={styles.addMealBtnText}>+ Прием пищи</Text>
        </Pressable>
      </View>

      <View style={styles.calendarWrap}>
        <Calendar
          current={selectedDate}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "#111111" },
          }}
          hideExtraDays
          enableSwipeMonths
          firstDay={1}
        />
      </View>

      <ScrollView
        style={{ flex: 1, marginTop: spacing.lg }}
        contentContainerStyle={{
          gap: spacing.lg,
          paddingBottom: spacing.xl, // чтобы низ не упирался в navbar
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {!ready
          ? null
          : meals.map((m) => (
              <MealCard
                key={m.id}
                title={m.title}
                items={m.items}
                productsById={byId}
                onAdd={() => openCreateItem(m.id)}
                onEdit={(it) => openEditItem(m.id, it)}
                canEditMeal={!m.isDefault}
                onEditMeal={() => openEditMeal(m.id)}
              />
            ))}
      </ScrollView>

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
  calendarWrap: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: colors.bg,
  },
});
