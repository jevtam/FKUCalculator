import { useEffect, useState } from "react";
import type { DiaryItem, DiaryState, Meal, MealId } from "./types";
import { loadDiary, saveDiary } from "../api/storage";

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeTitle(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

export function useDiary() {
  const [state, setState] = useState<DiaryState>({ meals: [] });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      const loaded = await loadDiary();
      setState(loaded);
      setIsReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    saveDiary(state);
  }, [state, isReady]);

  //meals CRUD
  const addMeal = (titleRaw: string) => {
    const title = normalizeTitle(titleRaw);
    if (!title) throw new Error("Введите название приёма пищи");

    const meal: Meal = { id: makeId("meal"), title, items: [] };
    setState((prev) => ({ meals: [...prev.meals, meal] }));
  };

  //переименование
  const renameMeal = (mealId: MealId, titleRaw: string) => {
    const title = normalizeTitle(titleRaw);
    if (!title) throw new Error("Введите название приёма пищи");
    setState((prev) => ({
      meals: prev.meals.map((m) => (m.id === mealId ? { ...m, title } : m)),
    }));
  };

  //удаление приёма
  const removeMeal = (mealId: MealId) => {
    setState((prev) => ({
      meals: prev.meals.filter((m) => m.id !== mealId),
    }));
  };

  //items CRUD
  const addItem = (mealId: MealId, productId: string, grams: number) => {
    if (!productId) throw new Error("Выберите продукт");
    if (!Number.isFinite(grams) || grams <= 0)
      throw new Error("Граммы должны быть числом > 0");

    const now = Date.now();
    const item: DiaryItem = {
      id: makeId("item"),
      productId,
      grams,
      createdAt: now,
      updatedAt: now,
    };

    setState((prev) => ({
      meals: prev.meals.map((m) =>
        m.id === mealId ? { ...m, items: [item, ...m.items] } : m,
      ),
    }));
  };

  const updateItem = (
    mealId: MealId,
    itemId: string,
    productId: string,
    grams: number,
  ) => {
    if (!productId) throw new Error("Выберите продукт");
    if (!Number.isFinite(grams) || grams <= 0)
      throw new Error("Граммы должны быть числом > 0");

    const now = Date.now();

    setState((prev) => ({
      meals: prev.meals.map((m) =>
        m.id === mealId
          ? {
              ...m,
              items: m.items.map((it) =>
                it.id === itemId
                  ? { ...it, productId, grams, updatedAt: now }
                  : it,
              ),
            }
          : m,
      ),
    }));
  };

  const removeItem = (mealId: MealId, itemId: string) => {
    setState((prev) => ({
      meals: prev.meals.map((m) =>
        m.id === mealId
          ? { ...m, items: m.items.filter((it) => it.id !== itemId) }
          : m,
      ),
    }));
  };

  return {
    isReady,
    meals: state.meals,

    addMeal,
    renameMeal,
    removeMeal,

    addItem,
    updateItem,
    removeItem,
  };
}
