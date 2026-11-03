import React, { useState } from "react";
import { Platform, Pressable, Text, View, type ViewStyle } from "react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { UtensilsCrossed } from "lucide-react-native";
import { BRAND } from "../data/brand";
import { C } from "../theme";

export { C };
/** Kept for older imports */
export const COLORS = C;

export function tap() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }
}

const MONOGRAM = require("../../assets/splash-icon.png");

/** Circular DK logo. Falls back to the bundled monogram if the remote logo cannot load. */
export function Logo({
  size = 44,
  ring = true,
  ringColor = C.cream,
}: {
  size?: number;
  ring?: boolean;
  ringColor?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        borderWidth: ring ? Math.max(2, size / 28) : 0,
        borderColor: ringColor,
        backgroundColor: C.forest,
      }}
    >
      <Image
        source={failed ? MONOGRAM : { uri: BRAND.logo }}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
        transition={200}
        onError={() => setFailed(true)}
        accessibilityLabel="DK Dream Kitchen logo"
      />
    </View>
  );
}

/** Remote photo with a branded fallback if it cannot be loaded. */
export function SafeImage({
  uri,
  style,
  contentFit = "cover",
}: {
  uri: string;
  style?: object;
  contentFit?: "cover" | "contain";
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <View
        style={[
          style,
          { backgroundColor: C.forest, alignItems: "center", justifyContent: "center" },
        ]}
      >
        <UtensilsCrossed color={C.cream} size={28} />
      </View>
    );
  }
  return (
    <Image
      source={{ uri }}
      style={style}
      contentFit={contentFit}
      transition={250}
      onError={() => setFailed(true)}
    />
  );
}

type Variant = "forest" | "cream" | "outlineOnGreen" | "outlineOnLight";

const BTN: Record<Variant, { box: string; text: string; icon: string }> = {
  forest: { box: "bg-forest", text: "text-cream", icon: C.cream },
  cream: { box: "bg-cream", text: "text-ink", icon: C.ink },
  outlineOnGreen: { box: "border-2 border-cream", text: "text-cream", icon: C.cream },
  outlineOnLight: { box: "border-2 border-ink", text: "text-ink", icon: C.ink },
};

export function Button({
  label,
  onPress,
  variant = "forest",
  icon,
  disabled,
  loading,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: (color: string) => React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}) {
  const v = BTN[variant];
  const off = disabled || loading;
  return (
    <Pressable
      disabled={off}
      onPress={() => {
        tap();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={style}
      className={`min-h-[54px] flex-row items-center justify-center rounded-2xl px-6 py-3.5 active:opacity-80 ${v.box} ${off ? "opacity-50" : ""}`}
    >
      {icon ? <View className="mr-2">{icon(v.icon)}</View> : null}
      <Text className={`text-base font-extrabold ${v.text}`}>
        {loading ? "Sending…" : label}
      </Text>
    </Pressable>
  );
}

/** Uppercase centred heading, like "YOUR FAVOURITES, ALL IN ONE PLACE". */
export function SectionHeading({
  title,
  eyebrow,
  size = 22,
}: {
  title: string;
  eyebrow?: string;
  size?: number;
}) {
  return (
    <View className="items-center px-5 pb-4 pt-9">
      {eyebrow ? (
        <Text className="mb-1.5 text-xs font-bold uppercase tracking-[3px] text-ink/60">
          {eyebrow}
        </Text>
      ) : null}
      <Text
        className="text-center font-extrabold uppercase text-ink"
        style={{ fontSize: size, lineHeight: size * 1.2, letterSpacing: 0.4 }}
      >
        {title}
      </Text>
    </View>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: C.white,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: C.line,
          shadowColor: C.forest,
          shadowOpacity: 0.07,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export const inputClass =
  "min-h-[52px] rounded-2xl border border-ink/20 bg-white px-4 py-3 text-base text-ink";
export const PLACEHOLDER = "rgba(28,61,44,0.42)";

export function FieldLabel({ children }: { children: string }) {
  return (
    <Text className="mb-1.5 mt-4 text-xs font-bold uppercase tracking-[2px] text-ink/65">
      {children}
    </Text>
  );
}

export function FieldError({ text }: { text?: string }) {
  return text ? <Text className="mt-1 text-xs text-[#9B2C2C]">{text}</Text> : null;
}
