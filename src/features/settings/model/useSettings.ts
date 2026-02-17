import { useEffect, useState } from "react";
import type { LimitMode, SettingsState } from "./types";
import { DEFAULT_SETTINGS } from "./types";
import { loadSettings, saveSettings } from "../api/storage";

export function useSettings() {
  const [isReady, setIsReady] = useState(false);
  const [state, setState] = useState<SettingsState>(DEFAULT_SETTINGS);

  useEffect(() => {
    let alive = true;
    (async () => {
      const s = await loadSettings();
      if (!alive) return;
      setState(s);
      setIsReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    saveSettings(state);
  }, [state, isReady]);

  const setLimitMode = (mode: LimitMode) =>
    setState((s) => ({ ...s, limitMode: mode }));

  const setLimitValue = (value: number) =>
    setState((s) => ({ ...s, limitValue: value }));

  const reset = () => setState(DEFAULT_SETTINGS);

  return { isReady, state, setLimitMode, setLimitValue, reset };
}
