import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DiaryState, Meal } from "../model/types";

const KEY_PREFIX = "fku.diary.day.v1";
const KEY = "fku.diary.current.v2";

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

export async function loadDiaryRange(
  fromISO: string,
  toISO: string,
): Promise<Array<{ dateISO: string; state: DiaryState }>> {
  const keys = await AsyncStorage.getAllKeys();

  const diaryKeys = keys.filter((k) => k.startsWith(`${KEY_PREFIX}.`));

  if (diaryKeys.length === 0) return [];

  const pairs = await AsyncStorage.multiGet(diaryKeys);

  const res: Array<{ dateISO: string; state: DiaryState }> = [];

  for (const [key, raw] of pairs) {
    if (!raw) continue;

    const dateISO = key.replace(`${KEY_PREFIX}.`, "");
    if (dateISO < fromISO || dateISO > toISO) continue;

    try {
      const parsed = JSON.parse(raw) as DiaryState;
      if (Array.isArray(parsed?.meals)) {
        res.push({ dateISO, state: { meals: parsed.meals } });
      }
    } catch {
    }
  }

  res.sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  return res;
}
