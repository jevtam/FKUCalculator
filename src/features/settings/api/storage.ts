import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SettingsState } from "../model/types";
import { DEFAULT_SETTINGS } from "../model/types";

const KEY = "fku.settings.v1";

export async function loadSettings(): Promise<SettingsState> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return DEFAULT_SETTINGS;

  try {
    const parsed = JSON.parse(raw) as Partial<SettingsState>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      limitValue:
        typeof parsed.limitValue === "number"
          ? parsed.limitValue
          : DEFAULT_SETTINGS.limitValue,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(state: SettingsState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
