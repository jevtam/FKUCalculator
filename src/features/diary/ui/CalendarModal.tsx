import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { colors, spacing } from "../../../shared/theme";

type Props = {
  visible: boolean;
  selectedDate: string; //YYYY-MM-DD
  onClose: () => void;
  onSelect: (dateISO: string) => void;
};

export function CalendarModal({
  visible,
  selectedDate,
  onClose,
  onSelect,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.center}>
        <View style={styles.card}>
          <Calendar
            current={selectedDate}
            onDayPress={(day) => onSelect(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: "#111111" },
            }}
            firstDay={1}
            enableSwipeMonths
          />
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
});
