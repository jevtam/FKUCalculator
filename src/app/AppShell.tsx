import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { CatalogScreen, DiaryScreen, OptionsScreen } from "../screens";
import { BottomNav } from "../shared/ui/BottomNav";

export type RouteKey = "catalog" | "diary" | "options";

export default function AppShell() {
  const [route, setRoute] = useState<RouteKey>("catalog");

  const Screen = useMemo(() => {
    switch (route) {
      case "catalog":
        return <CatalogScreen />;
      case "diary":
        return <DiaryScreen />;
      case "options":
        return <OptionsScreen />;
      default:
        return <CatalogScreen />;
    }
  }, [route]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{Screen}</View>

      <BottomNav active={route} onChange={setRoute} />
    </View>
  );
}
