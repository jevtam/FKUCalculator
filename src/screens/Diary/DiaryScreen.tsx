import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
import { DateBar } from "../../features/diary/ui/DateBar";
import { CalendarModal } from "../../features/diary/ui/CalendarModal";
import { useSettings } from "../../features/settings/model/useSettings";
import { CircularProgress } from "../../shared/ui/CircularProgress";
import {
  calcForGrams,
  addNutrition,
  roundProtein,
  roundFa,
} from "../../shared/lib/nutrition";

function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(dateISO: string, delta: number) {
  const [y, m, d] = dateISO.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
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
  const { state: settings } = useSettings();

  const dayTotals = useMemo(() => {
    return meals.reduce(
      (acc, m) => {
        for (const it of m.items) {
          const p = byId.get(it.productId);
          if (!p) continue;

          const n = calcForGrams({
            grams: it.grams,
            proteinPer100g: p.proteinPer100g,
            faPer100g: p.faPer100g,
          });

          acc = addNutrition(acc, n);
        }
        return acc;
      },
      { proteinG: 0, faMg: 0 },
    );
  }, [meals, byId]);

  const limitMode = settings.limitMode;
  const limitValue = settings.limitValue;

  const dayValue =
    limitMode === "fa"
      ? roundFa(dayTotals.faMg)
      : roundProtein(dayTotals.proteinG);

  const label = limitMode === "fa" ? "ФА" : "НБ";
  const unit = limitMode === "fa" ? "мг" : "г";

  const ready = productsReady && diaryReady;

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [mealId, setMealId] = useState<MealId>("breakfast");
  const [editItem, setEditItem] = useState<DiaryItem | null>(null);

  const [mealModalOpen, setMealModalOpen] = useState(false);

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
  const [calendarOpen, setCalendarOpen] = useState(false);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name, "ru"));
  }, [products]);

  return (
    <Screen>
      <View style={styles.topRow}>
        <View style={{ gap: 4 }}>
          <Text style={styles.title}>Дневник</Text>
          <Text style={styles.limitText}>
            {label} {dayValue} / {limitValue > 0 ? limitValue : "—"} {unit}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end", gap: spacing.sm }}>
          <CircularProgress
            value={typeof dayValue === "number" ? dayValue : 0}
            limit={limitValue}
            label={label}
            unit={unit}
            size={64}
            stroke={6}
            showMeta={false}
          />

          <Pressable
            onPress={() => setMealModalOpen(true)}
            style={styles.addMealBtn}
          >
            <Text style={styles.addMealBtnText}>+ Прием пищи</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.calendarWrap}>
        <DateBar
          dateISO={selectedDate}
          onPrev={() => setSelectedDate(addDays(selectedDate, -1))}
          onNext={() => setSelectedDate(addDays(selectedDate, 1))}
          onOpenCalendar={() => setCalendarOpen(true)}
        />

        <CalendarModal
          visible={calendarOpen}
          selectedDate={selectedDate}
          onClose={() => setCalendarOpen(false)}
          onSelect={(dateISO) => {
            setSelectedDate(dateISO);
            setCalendarOpen(false);
          }}
        />
      </View>

      <ScrollView
        style={{ flex: 1, marginTop: spacing.lg }}
        contentContainerStyle={{
          gap: spacing.lg,
          paddingBottom: spacing.xl,
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
  limitText: {
  color: colors.muted,
  fontSize: typography.small,
  fontWeight: "700",
},
});
