import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, spacing, typography } from "../../../shared/theme";
import type { Product, ProductDraft } from "../model/types";

type Props = {
  visible: boolean;
  mode: "create" | "edit";
  initial?: Product | null;

  onClose: () => void;
  onSubmit: (draft: ProductDraft) => void;
  onDelete?: () => void;
};

const empty: ProductDraft = { name: "", proteinPer100g: "", faPer100g: "" };

export function ProductFormModal({
  visible,
  mode,
  initial,
  onClose,
  onSubmit,
  onDelete,
}: Props) {
  const title =
    mode === "create" ? "Добавить продукт" : "Редактировать продукт";

  const initialDraft = useMemo<ProductDraft>(() => {
    if (!initial) return empty;
    return {
      name: initial.name,
      proteinPer100g: String(initial.proteinPer100g),
      faPer100g: String(initial.faPer100g),
    };
  }, [initial]);

  const [draft, setDraft] = useState<ProductDraft>(empty);

  useEffect(() => {
    if (visible) setDraft(initialDraft);
  }, [visible, initialDraft]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.sheet}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.label}>Название</Text>
        <TextInput
          value={draft.name}
          placeholder="Например: Яблоко"
          onChangeText={(v) => setDraft((d) => ({ ...d, name: v }))}
          style={styles.input}
        />

        <Text style={styles.label}>Белок на 100г (г)</Text>
        <TextInput
          value={draft.proteinPer100g}
          placeholder="Например: 0.3"
          onChangeText={(v) => setDraft((d) => ({ ...d, proteinPer100g: v }))}
          keyboardType="decimal-pad"
          style={styles.input}
        />

        <Text style={styles.label}>ФА на 100г (мг)</Text>
        <TextInput
          value={draft.faPer100g}
          placeholder="Например: 9"
          onChangeText={(v) => setDraft((d) => ({ ...d, faPer100g: v }))}
          keyboardType="decimal-pad"
          style={styles.input}
        />

        <View style={styles.actions}>
          <Pressable onPress={onClose} style={[styles.btn, styles.btnGhost]}>
            <Text style={styles.btnGhostText}>Отмена</Text>
          </Pressable>

          <Pressable
            onPress={() => onSubmit(draft)}
            style={[styles.btn, styles.btnPrimary]}
          >
            <Text style={styles.btnPrimaryText}>Сохранить</Text>
          </Pressable>

          {mode === "edit" && (
            <Pressable
              onPress={onDelete}
              style={[styles.btn, styles.btnDanger]}
            >
              <Text style={styles.btnDangerText}>Удалить</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: spacing.lg,
    gap: spacing.sm,
  },

  title: {
    fontSize: typography.h2,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  label: { fontSize: typography.small, color: colors.muted },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: typography.body,
    color: colors.text,
  },

  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },

  btnGhost: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  btnGhostText: { color: colors.text, fontWeight: "600" },

  btnPrimary: { backgroundColor: colors.text },
  btnPrimaryText: { color: "#fff", fontWeight: "700" },
  btnDanger: {
    borderWidth: 1,
    borderColor: "#B00020",
    backgroundColor: "transparent",
  },
  btnDangerText: { color: "#B00020", fontWeight: "700" },
});
