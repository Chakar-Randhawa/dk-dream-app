import React from "react";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { useLayout } from "../hooks/useLayout";
import { C, Logo } from "./ui";

/** Green brand header used on every tab except Home (which has its own hero). */
export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { insets, gutter, width } = useLayout();
  return (
    <View
      style={{
        backgroundColor: C.forest,
        paddingTop: insets.top + 10,
        paddingBottom: 16,
        paddingLeft: Math.max(insets.left, 0) + gutter,
        paddingRight: Math.max(insets.right, 0) + gutter,
      }}
    >
      <View className="flex-row items-center self-center" style={{ width: "100%", maxWidth: 1100 }}>
        <Logo size={width >= 600 ? 56 : 46} />
        <View className="ml-3 flex-1">
          <Text
            className="font-extrabold uppercase text-white"
            style={{ fontSize: width >= 600 ? 24 : 19, letterSpacing: 0.6 }}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              className="mt-0.5 uppercase text-cream/75"
              style={{ fontSize: 11.5, letterSpacing: 2 }}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

/**
 * Standard tab screen: green header, paper-coloured body, centred max width on tablets,
 * horizontal safe-area padding for notches/landscape, keyboard handling for forms.
 */
export function Screen({
  title,
  subtitle,
  children,
  maxWidth = 720,
  scroll = true,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: number;
  scroll?: boolean;
}) {
  const { insets, gutter, fabSpace } = useLayout();
  return (
    <View style={{ flex: 1, backgroundColor: C.paper }}>
      <PageHeader title={title} subtitle={subtitle} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        {scroll ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: insets.left + gutter,
              paddingRight: insets.right + gutter,
              paddingTop: 8,
              paddingBottom: fabSpace + 24,
            }}
          >
            <View style={{ width: "100%", maxWidth, alignSelf: "center" }}>{children}</View>
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            }}
          >
            {children}
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
