import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DiaryState, Meal } from "../model/types";

const KEY_PREFIX = "fku.diary.day.v1";

function defaultMeals(): Meal[] {
  return [
    { id: "breakfast", title: "Завтрак", isDefault: true, items: [] },
    { id: "lunch", title: "Обед", isDefault: true, items: [] },
    { id: "dinner", title: "Ужин", isDefault: true, items: [] },
  ];
}

function keyForDate(date: string) {
  return `${KEY_PREFIX}.${date}`;
}

export async function loadDiaryByDate(date: string): Promise<DiaryState> {
  const raw = await AsyncStorage.getItem(keyForDate(date));
  if (!raw) return { meals: defaultMeals() };

  try {
    const parsed = JSON.parse(raw) as DiaryState;
    if (Array.isArray(parsed?.meals)) return { meals: parsed.meals };
  } catch {}

  return { meals: defaultMeals() };
}

export async function saveDiaryByDate(
  date: string,
  state: DiaryState,
): Promise<void> {
  await AsyncStorage.setItem(keyForDate(date), JSON.stringify(state));
}
