import React, { useEffect, useState } from "react";
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
import { useProducts } from "../../features/products/model/useProducts";
import { ExportDiaryModal } from "../../features/diary/ui/ExportDiaryModal";

export function OptionsScreen() {
  const { isReady, state, setLimitMode, setLimitValue } = useSettings();
  const { isReady: productsReady, byId: productsById } = useProducts();

  const [draft, setDraft] = useState<string>("");
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
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

      {/* ===== ОПЕРАЦИИ С ДАННЫМИ ===== */}
      <View style={styles.card}>
        <Text style={styles.h2}>Операции с данными</Text>

        <Pressable onPress={() => setExportOpen(true)} style={styles.actionBtn}>
          <Text style={styles.actionText}>Выгрузить дневник в PDF</Text>
        </Pressable>
      </View>

      <ExportDiaryModal
        visible={exportOpen}
        onClose={() => setExportOpen(false)}
        productsById={productsById}
        productsReady={productsReady}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: typography.h1,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.lg,
  },
  h2: {
    fontSize: typography.h2,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.bg,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  pillActive: {
    backgroundColor: colors.text,
  },
  pillText: {
    color: colors.text,
    fontWeight: "600",
  },
  pillTextActive: {
    color: "#fff",
  },
  label: {
    fontSize: typography.small,
    color: colors.muted,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: typography.body,
    color: colors.text,
  },
  unit: {
    fontSize: typography.body,
    color: colors.muted,
  },
  saveBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.text,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  actionText: {
    color: colors.text,
    fontWeight: "700",
  },
  muted: {
    color: colors.muted,
    fontSize: typography.small,
  },
});
