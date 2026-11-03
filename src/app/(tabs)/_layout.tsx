import React from "react";
import { Tabs } from "expo-router";
import { TabBar } from "../../components/TabBar";
import { C } from "../../theme";

// Home is the landing tab even though Menu and Gallery sit to its left in the bar.
export const unstable_settings = { initialRouteName: "index" };

export default function TabsLayout() {
  return (
    <Tabs
      backBehavior="initialRoute"
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: C.paper },
      }}
    >
      {/* Order here = order in the bottom bar */}
      <Tabs.Screen name="menu" options={{ title: "Menu" }} />
      <Tabs.Screen name="gallery" options={{ title: "Gallery" }} />
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="cart" options={{ title: "Order" }} />
      <Tabs.Screen name="contact" options={{ title: "Contact" }} />
      <Tabs.Screen name="reserve" options={{ title: "Reserve" }} />
    </Tabs>
  );
}
