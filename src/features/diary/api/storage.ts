import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DiaryState } from "../model/types";

const KEY = "fku.diary.current.v1";

const empty: DiaryState = {
  breakfast: [],
  lunch: [],
  dinner: [],
};

export async function loadDiary(): Promise<DiaryState> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return empty;

  try {
    const parsed = JSON.parse(raw) as DiaryState;
    return {
      breakfast: Array.isArray(parsed?.breakfast) ? parsed.breakfast : [],
      lunch: Array.isArray(parsed?.lunch) ? parsed.lunch : [],
      dinner: Array.isArray(parsed?.dinner) ? parsed.dinner : [],
    };
  } catch {
    return empty;
  }
}

export async function saveDiary(state: DiaryState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
