import "../../global.css";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { NavigationBar } from "expo-navigation-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CartProvider } from "../context/CartContext";
import { ChatBot } from "../components/ChatBot";
import { IntroFlow } from "../components/Intro";
import { TAB_ROW, useLayout } from "../hooks/useLayout";
import { C } from "../theme";

// Keep the native splash up until the animated launch screen is on screen.
SplashScreen.preventAutoHideAsync().catch(() => {});

function Shell() {
  const { insets } = useLayout();
  const [introDone, setIntroDone] = useState(false);
  const finish = useCallback(() => setIntroDone(true), []);

  return (
    <View style={{ flex: 1, backgroundColor: C.forest }}>
      <Slot />
      {/* Floating support chat, visible on every tab, always above the tab bar */}
      {introDone ? <ChatBot bottomOffset={insets.bottom + TAB_ROW + 14} /> : null}
      {introDone ? null : <IntroFlow onFinished={finish} />}
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: C.forest }}>
      <SafeAreaProvider>
        <CartProvider>
          <StatusBar style="light" />
          {/* Light button icons on our dark-green bottom bar (3-button navigation) */}
          <NavigationBar style="dark" />
          <Shell />
        </CartProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
