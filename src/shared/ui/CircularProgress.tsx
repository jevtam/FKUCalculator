import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors, spacing, typography } from "../theme";

type Props = {
  value: number; 
  limit: number; 
  label: string;
  unit: string; 
  size?: number;
  stroke?: number;
};

export function CircularProgress({
  value,
  limit,
  label,
  unit,
  size = 76,
  stroke = 6,
}: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const progress = limit > 0 ? Math.max(0, Math.min(1, value / limit)) : 0;

  const dashOffset = c * (1 - progress);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.border}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.text}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation={-90}
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>

      <View style={styles.center}>
        <Text style={styles.top}>{label}</Text>
        <Text style={styles.main}>{limit > 0 ? formatNumber(limit) : "—"}</Text>
        <Text style={styles.bottom}>{unit}</Text>
      </View>
    </View>
  );
}

function formatNumber(n: number) {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 100) return String(Math.round(n));
  if (Math.abs(n) >= 10) return (Math.round(n * 10) / 10).toString();
  return (Math.round(n * 100) / 100).toString();
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  top: { color: colors.muted, fontSize: typography.small, fontWeight: "700" },
  main: { color: colors.text, fontSize: typography.h2, fontWeight: "900" },
  bottom: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: "700",
  },
});
