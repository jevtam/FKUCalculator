import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, spacing, typography } from "../../../shared/theme";
import { BottomSheetModal } from "../../../shared/ui/BottomSheetModal";

type Props = {
  visible: boolean;
  titleInitial: string;
  canDelete: boolean;

  onClose: () => void;
  onSave: (title: string) => void;
  onDelete?: () => void;
};

export function EditMealModal({
  visible,
  titleInitial,
  canDelete,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (visible) setTitle(titleInitial);
  }, [visible, titleInitial]);

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      sheetStyle={styles.sheet}
    >
      <Text style={styles.title}>Редактировать приём пищи</Text>

      <Text style={styles.label}>Название</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Например: Полдник"
        style={styles.input}
      />

      <View style={styles.actions}>
        <Pressable onPress={onClose} style={[styles.btn, styles.btnGhost]}>
          <Text style={styles.btnGhostText}>Отмена</Text>
        </Pressable>

        {canDelete && (
          <Pressable
            onPress={() => onDelete?.()}
            style={[styles.btn, styles.btnDanger]}
          >
            <Text style={styles.btnDangerText}>Удалить</Text>
          </Pressable>
        )}

        <Pressable
          onPress={() => onSave(title)}
          style={[styles.btn, styles.btnPrimary]}
        >
          <Text style={styles.btnPrimaryText}>Сохранить</Text>
        </Pressable>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: spacing.sm,
  },
  title: { fontSize: typography.h2, fontWeight: "700", color: colors.text },
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
  btnGhost: { borderWidth: 1, borderColor: colors.border },
  btnGhostText: { color: colors.text, fontWeight: "600" },
  btnPrimary: { backgroundColor: colors.text },
  btnPrimaryText: { color: "#fff", fontWeight: "800" },
  btnDanger: { borderWidth: 1, borderColor: "#B00020" },
  btnDangerText: { color: "#B00020", fontWeight: "800" },
});
