import { useEffect, useState } from "react";
import type { DiaryItem, DiaryState, MealKey } from "./types";
import { loadDiary, saveDiary } from "../api/storage";

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function useDiary() {
  const [state, setState] = useState<DiaryState>({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

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

  const addItem = (meal: MealKey, productId: string, grams: number) => {
    if (!productId) throw new Error("Выберите продукт");
    if (!Number.isFinite(grams) || grams <= 0)
      throw new Error("Граммы должны быть числом > 0");

    const now = Date.now();
    const item: DiaryItem = {
      id: makeId(),
      productId,
      grams,
      createdAt: now,
      updatedAt: now,
    };

    setState((prev) => ({
      ...prev,
      [meal]: [item, ...prev[meal]],
    }));
  };

  const updateItem = (
    meal: MealKey,
    id: string,
    productId: string,
    grams: number,
  ) => {
    if (!productId) throw new Error("Выберите продукт");
    if (!Number.isFinite(grams) || grams <= 0)
      throw new Error("Граммы должны быть числом > 0");

    const now = Date.now();

    setState((prev) => ({
      ...prev,
      [meal]: prev[meal].map((it) =>
        it.id === id ? { ...it, productId, grams, updatedAt: now } : it,
      ),
    }));
  };

  const removeItem = (meal: MealKey, id: string) => {
    setState((prev) => ({
      ...prev,
      [meal]: prev[meal].filter((it) => it.id !== id),
    }));
  };

  return { isReady, state, addItem, updateItem, removeItem };
}
