export type LimitMode = "protein" | "fa";

export type SettingsState = {
  limitMode: LimitMode;
  limitValue: number;
};

export const DEFAULT_SETTINGS: SettingsState = {
  limitMode: "fa",
  limitValue: 0,
};
