import React from "react";
import AppShell from "./AppShell";
import { WebAppContainer } from "../shared/ui/WebAppContainer";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <AppShell />
    </SafeAreaProvider>
  );
}
