import React from "react";
import { Platform, StyleSheet, View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export function WebAppContainer({ children }: Props) {
  //web only
  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  return (
    <View style={styles.page}>
      <View style={styles.device}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2", //фон
  },

  device: {
    width: 390,              //iphone 12/13/14
    maxWidth: "100%",
    aspectRatio: 9 / 20,     //1080x2400
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
  } as any, //boxShadow - web only
});
