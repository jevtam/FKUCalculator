import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Screen } from "../../shared/ui/Screen";
import { colors, spacing, typography } from "../../shared/theme";
import { useSettings } from "../../features/settings/model/useSettings";

export function OptionsScreen() {
  const { isReady, state, setLimitMode, setLimitValue } = useSettings();

  const [draft, setDraft] = useState<string>("");

  React.useEffect(() => {
    if (!isReady) return;
    setDraft(state.limitValue ? String(state.limitValue) : "");
  }, [isReady, state.limitValue]);

  const unit = state.limitMode === "fa" ? "мг" : "г";
  const title = state.limitMode === "fa" ? "Фенилаланин" : "Белок";

  const save = () => {
    const v = Number(draft.replace(",", "."));
    if (!Number.isFinite(v) || v < 0) {
      Alert.alert("Ошибка", "Введите корректное число");
      return;
    }
    setLimitValue(v);
    Alert.alert("Готово", `Лимит сохранен: ${v} ${unit}`);
  };

  return (
    <Screen scroll>
      <Text style={styles.h1}>Опции</Text>

      <View style={styles.card}>
        <Text style={styles.h2}>Дневная норма</Text>

        <View style={styles.row}>
          <Pressable
            onPress={() => setLimitMode("protein")}
            style={[
              styles.pill,
              state.limitMode === "protein" && styles.pillActive,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                state.limitMode === "protein" && styles.pillTextActive,
              ]}
            >
              НБ (г)
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setLimitMode("fa")}
            style={[styles.pill, state.limitMode === "fa" && styles.pillActive]}
          >
            <Text
              style={[
                styles.pillText,
                state.limitMode === "fa" && styles.pillTextActive,
              ]}
            >
              ФА (мг)
            </Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Лимит на день — {title}</Text>
        <View style={styles.inputRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={`Например: ${state.limitMode === "fa" ? "300" : "10"}`}
            keyboardType="numeric"
            style={styles.input}
          />
          <Text style={styles.unit}>{unit}</Text>
        </View>

        <Pressable onPress={save} style={styles.saveBtn}>
          <Text style={styles.saveText}>Сохранить</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.h2}>Операции с данными</Text>
        <Text style={styles.muted}>
          Импорт/экспорт добавим позже (кнопки будут тут).
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: typography.h2,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.lg,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.bg,
  },
  h2: { fontSize: typography.body, fontWeight: "800", color: colors.text },
  muted: { color: colors.muted },

  row: { flexDirection: "row", gap: spacing.sm },
  pill: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  pillActive: { borderColor: colors.text },
  pillText: { color: colors.muted, fontWeight: "700" },
  pillTextActive: { color: colors.text },

  label: { color: colors.muted, fontSize: typography.small },

  inputRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: colors.text,
    fontSize: typography.body,
  },
  unit: { color: colors.text, fontWeight: "800" },

  saveBtn: {
    backgroundColor: colors.text,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  saveText: { color: "#fff", fontWeight: "800" },
});
