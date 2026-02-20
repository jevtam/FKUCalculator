import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { Product } from "../../products/model/types";
import { colors, spacing, typography } from "../../../shared/theme";
import { FullScreenModal } from "../../../shared/ui/FullScreenModal";
import { exportDiaryPdf } from "../api/exportDiaryPdf";

function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function addDays(iso: string, delta: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + delta);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function isValidISODate(s: string): boolean {
  // YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return false;
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
}

type Props = {
  visible: boolean;
  onClose: () => void;

  productsById: Map<string, Product>;
  productsReady: boolean;
};

export function ExportDiaryModal({
  visible,
  onClose,
  productsById,
  productsReady,
}: Props) {
  const [fromISO, setFromISO] = useState("");
  const [toISO, setToISO] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const to = todayISO();
    const from = addDays(to, -29);
    setToISO(to);
    setFromISO(from);
    setBusy(false);
  }, [visible]);

  const canExport = useMemo(() => {
    if (!productsReady) return false;
    if (!isValidISODate(fromISO) || !isValidISODate(toISO)) return false;
    return fromISO <= toISO;
  }, [productsReady, fromISO, toISO]);

  const setPreset = (days: number) => {
    const to = todayISO();
    const from = addDays(to, -(days - 1));
    setToISO(to);
    setFromISO(from);
  };

  const doExport = async () => {
    if (!productsReady) {
      Alert.alert("Подождите", "Список продуктов еще загружается.");
      return;
    }

    if (!isValidISODate(fromISO) || !isValidISODate(toISO)) {
      Alert.alert("Ошибка", "Введите даты в формате YYYY-MM-DD");
      return;
    }

    if (fromISO > toISO) {
      Alert.alert("Ошибка", "Дата «с» не может быть позже даты «по»");
      return;
    }

    try {
      setBusy(true);
      await exportDiaryPdf({ fromISO, toISO, productsById });
    } catch (e: any) {
      Alert.alert("Ошибка", e?.message ?? "Не удалось выгрузить PDF");
    } finally {
      setBusy(false);
    }
  };

  return (
    <FullScreenModal
      visible={visible}
      onClose={onClose}
      footer={
        <View style={styles.actions}>
          <Pressable onPress={onClose} style={[styles.btn, styles.btnGhost]}>
            <Text style={styles.btnGhostText}>Отмена</Text>
          </Pressable>

          <Pressable
            onPress={doExport}
            disabled={!canExport || busy}
            style={[
              styles.btn,
              styles.btnPrimary,
              (!canExport || busy) && styles.btnDisabled,
            ]}
          >
            <Text style={styles.btnPrimaryText}>
              {busy ? "Готовим PDF..." : "Выгрузить PDF"}
            </Text>
          </Pressable>
        </View>
      }
    >
      <Text style={styles.title}>Выгрузка дневника</Text>
      <Text style={styles.section}>Период</Text>
      <View style={styles.presetRow}>
        <Pressable onPress={() => setPreset(7)} style={styles.presetBtn}>
          <Text style={styles.presetText}>7 дней</Text>
        </Pressable>
        <Pressable onPress={() => setPreset(14)} style={styles.presetBtn}>
          <Text style={styles.presetText}>14 дней</Text>
        </Pressable>
        <Pressable onPress={() => setPreset(30)} style={styles.presetBtn}>
          <Text style={styles.presetText}>30 дней</Text>
        </Pressable>
      </View>
      <View style={{ height: spacing.md }} />
      <Text style={styles.label}>С даты</Text>
      <TextInput
        value={fromISO}
        onChangeText={setFromISO}
        placeholder="2026-02-01"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="numbers-and-punctuation"
        style={styles.input}
      />
      <Text style={styles.label}>По дату</Text>
      <TextInput
        value={toISO}
        onChangeText={setToISO}
        placeholder="2026-02-13"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="numbers-and-punctuation"
        style={styles.input}
      />
      {!productsReady && (
        <Text style={styles.warn}>
          Продукты еще загружаются - экспорт временно недоступен.
        </Text>
      )}
      {fromISO && toISO && fromISO > toISO && (
        <Text style={styles.warn}>Проверьте диапазон дат: «с» позже «по».</Text>
      )}
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.h1,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.muted,
    marginBottom: spacing.lg,
  },
  section: {
    fontSize: typography.h2,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  presetRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  presetBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  presetText: {
    fontWeight: "800",
    color: colors.text,
  },
  label: {
    fontSize: typography.small,
    color: colors.muted,
    marginBottom: 6,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: typography.body,
    color: colors.text,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnGhost: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  btnGhostText: { color: colors.text, fontWeight: "700" },
  btnPrimary: { backgroundColor: colors.text },
  btnPrimaryText: { color: "#fff", fontWeight: "800" },
  btnDisabled: { opacity: 0.45 },
  warn: {
    marginTop: spacing.md,
    color: colors.muted,
    fontSize: typography.small,
  },
});
