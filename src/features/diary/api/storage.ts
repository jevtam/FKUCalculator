import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DiaryState, Meal } from "../model/types";

const KEY = "fku.diary.current.v2";
const OLD_KEY = "fku.diary.current.v1";

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function defaultMeals(): Meal[] {
  return [
    { id: "breakfast", title: "Завтрак", isDefault: true, items: [] },
    { id: "lunch", title: "Обед", isDefault: true, items: [] },
    { id: "dinner", title: "Ужин", isDefault: true, items: [] },
  ];
}

export async function loadDiary(): Promise<DiaryState> {
  //новый формат
  const raw = await AsyncStorage.getItem(KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as DiaryState;
      if (Array.isArray(parsed?.meals)) return { meals: parsed.meals };
    } catch {}
  }

  //миграция со старого варианта
  const oldRaw = await AsyncStorage.getItem(OLD_KEY);
  if (oldRaw) {
    try {
      const old = JSON.parse(oldRaw) as any;
      const meals = defaultMeals();
      meals[0].items = Array.isArray(old?.breakfast) ? old.breakfast : [];
      meals[1].items = Array.isArray(old?.lunch) ? old.lunch : [];
      meals[2].items = Array.isArray(old?.dinner) ? old.dinner : [];

      const migrated: DiaryState = { meals };
      await AsyncStorage.setItem(KEY, JSON.stringify(migrated));
      return migrated;
    } catch {}
  }

  return { meals: defaultMeals() };
}

export async function saveDiary(state: DiaryState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
