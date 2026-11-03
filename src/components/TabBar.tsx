import React from "react";
import { Pressable, Text, View } from "react-native";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import {
  CalendarCheck,
  Home,
  Images,
  Phone,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react-native";
import { MotiView } from "./moti";
import { useCart } from "../context/CartContext";
import { TAB_ROW, useLayout } from "../hooks/useLayout";
import { C, tap } from "./ui";

type IconType = React.ComponentType<{ color?: string; size?: number; strokeWidth?: number }>;

/** Left-to-right order requested by the client: Menu, Gallery, Home, Order, Contact, Reserve */
const TABS: Record<string, { label: string; Icon: IconType }> = {
  menu: { label: "Menu", Icon: UtensilsCrossed },
  gallery: { label: "Gallery", Icon: Images },
  index: { label: "Home", Icon: Home },
  cart: { label: "Order", Icon: ShoppingBag },
  contact: { label: "Contact", Icon: Phone },
  reserve: { label: "Reserve", Icon: CalendarCheck },
};

export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const { insets, isTablet } = useLayout();
  const { count } = useCart();

  return (
    <View
      style={{
        backgroundColor: C.forest,
        // Keeps the bar clear of the gesture handle / 3-button navigation on every device.
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        borderTopWidth: 1,
        borderTopColor: C.onForestLine,
      }}
    >
      <View
        style={{
          height: TAB_ROW,
          flexDirection: "row",
          alignSelf: "center",
          width: "100%",
          maxWidth: isTablet ? 760 : undefined,
        }}
      >
        {state.routes.map((route: { key: string; name: string }, index: number) => {
          const meta = TABS[route.name];
          if (!meta) return null;
          const focused = state.index === index;
          const { Icon } = meta;
          const color = focused ? C.forest : "rgba(241,233,212,0.78)";

          return (
            <Pressable
              key={route.key}
              onPress={() => {
                tap();
                if (!focused) navigateToTab(route.key);
              }}
              accessibilityRole="button"
              accessibilityLabel={meta.label}
              accessibilityState={{ selected: focused }}
              style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
              <View style={{ alignItems: "center" }}>
                <MotiView
                  animate={{
                    backgroundColor: focused ? C.cream : "rgba(241,233,212,0)",
                    scale: focused ? 1 : 0.94,
                  }}
                  transition={{ type: "timing", duration: 220 }}
                  style={{
                    width: 52,
                    height: 30,
                    borderRadius: 15,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon color={color} size={21} strokeWidth={focused ? 2.4 : 2} />
                  {route.name === "cart" && count > 0 ? (
                    <MotiView
                      key={count}
                      from={{ scale: 0.4 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 9 }}
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -2,
                        minWidth: 18,
                        height: 18,
                        borderRadius: 9,
                        paddingHorizontal: 4,
                        backgroundColor: focused ? C.forest : C.cream,
                        borderWidth: 2,
                        borderColor: C.forest,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: focused ? C.cream : C.forest,
                          fontSize: 10,
                          fontWeight: "800",
                        }}
                      >
                        {count > 99 ? "99+" : count}
                      </Text>
                    </MotiView>
                  ) : null}
                </MotiView>
                <Text
                  numberOfLines={1}
                  style={{
                    marginTop: 3,
                    fontSize: 11,
                    fontWeight: focused ? "800" : "600",
                    color: focused ? C.cream : "rgba(241,233,212,0.72)",
                  }}
                >
                  {meta.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
