import { Alert, Platform } from "react-native";

export async function confirmDialog(
  title: string,
  message?: string,
): Promise<boolean> {
  if (Platform.OS === "web") {
    return window.confirm(message ? `${title}\n\n${message}` : title);
  }

  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: "Отмена", style: "cancel", onPress: () => resolve(false) },
      { text: "OK", style: "destructive", onPress: () => resolve(true) },
    ]);
  });
}
