import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, spacing, typography } from "../../../shared/theme";
import type { Product } from "../../products/model/types";

type Mode = "create" | "edit";

type Props = {
  visible: boolean;
  mode: Mode;

  products: Product[];
  initialProductId?: string | null;
  initialGrams?: number | null;

  onClose: () => void;
  onSubmit: (productId: string, grams: number) => void;
  onDelete?: () => void; //только для edit
};

export function DiaryItemModal({
  visible,
  mode,
  products,
  initialProductId,
  initialGrams,
  onClose,
  onSubmit,
  onDelete,
}: Props) {
  const title =
    mode === "create" ? "Добавить позицию" : "Редактировать позицию";

  const [productId, setProductId] = useState<string>("");
  const [grams, setGrams] = useState<string>("");

  useEffect(() => {
    if (!visible) return;
    setProductId(initialProductId ?? "");
    setGrams(initialGrams != null ? String(initialGrams) : "");
  }, [visible, initialProductId, initialGrams]);

  const selected = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId],
  );

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

        <Text style={styles.label}>Выбранный продукт</Text>
        <View style={styles.selectedBox}>
          <Text style={styles.selectedText}>
            {selected?.name ?? "Не выбран"}
          </Text>
        </View>

        <Text style={styles.label}>Граммы</Text>
        <TextInput
          value={grams}
          onChangeText={setGrams}
          placeholder="Например: 120"
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={[styles.label, { marginTop: spacing.md }]}>
          Список продуктов
        </Text>
        <View style={styles.listBox}>
          <FlatList
            data={products}
            keyExtractor={(p) => p.id}
            renderItem={({ item }) => {
              const isActive = item.id === productId;
              return (
                <Pressable
                  onPress={() => setProductId(item.id)}
                  style={styles.pickRow}
                >
                  <Text
                    style={[styles.pickText, isActive && styles.pickTextActive]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>

        <View style={styles.actions}>
          <Pressable onPress={onClose} style={[styles.btn, styles.btnGhost]}>
            <Text style={styles.btnGhostText}>Отмена</Text>
          </Pressable>

          {mode === "edit" && (
            <Pressable
              onPress={() => onDelete?.()}
              style={[styles.btn, styles.btnDanger]}
            >
              <Text style={styles.btnDangerText}>Удалить</Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => onSubmit(productId, Number(grams.replace(",", ".")))}
            style={[styles.btn, styles.btnPrimary]}
          >
            <Text style={styles.btnPrimaryText}>Сохранить</Text>
          </Pressable>
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
    maxHeight: "85%",
  },

  title: { fontSize: typography.h2, fontWeight: "700", color: colors.text },

  label: { fontSize: typography.small, color: colors.muted },

  selectedBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  selectedText: { color: colors.text },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: typography.body,
    color: colors.text,
  },

  listBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    overflow: "hidden",
    height: 220,
  },
  pickRow: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickText: { color: colors.text },
  pickTextActive: { fontWeight: "800" },

  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  btnGhost: { borderWidth: 1, borderColor: colors.border },
  btnGhostText: { color: colors.text, fontWeight: "600" },
  btnPrimary: { backgroundColor: colors.text },
  btnPrimaryText: { color: "#fff", fontWeight: "800" },
  btnDanger: { borderWidth: 1, borderColor: "#B00020" },
  btnDangerText: { color: "#B00020", fontWeight: "800" },
});
