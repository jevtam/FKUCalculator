import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../../shared/theme";

type Props = {
  dateISO: string;
  onPrev: () => void;
  onNext: () => void;
  onOpenCalendar: () => void;
};

function formatRu(dateISO: string) {
  const [y, m, d] = dateISO.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function DateBar({ dateISO, onPrev, onNext, onOpenCalendar }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onPrev} style={styles.arrowBtn} hitSlop={10}>
        <Text style={styles.arrow}>‹</Text>
      </Pressable>

      <Pressable onPress={onOpenCalendar} style={styles.dateBtn}>
        <Text style={styles.dateText} numberOfLines={1}>
          {formatRu(dateISO)}
        </Text>
      </Pressable>

      <Pressable onPress={onNext} style={styles.arrowBtn} hitSlop={10}>
        <Text style={styles.arrow}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: colors.bg,
  },
  arrowBtn: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    lineHeight: 26,
  },
  dateBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  dateText: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.text,
    textTransform: "capitalize",
  },
});
