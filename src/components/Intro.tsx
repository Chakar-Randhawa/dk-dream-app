import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  FlatList,
  Pressable,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { ArrowRight, Check } from "lucide-react-native";
import { BRAND } from "../data/brand";
import { MENU } from "../data/menu";
import { useLayout } from "../hooks/useLayout";
import { C, Logo, SafeImage, tap } from "./ui";

const MONOGRAM = require("../../assets/splash-icon.png");
const STORE_KEY = "dk_onboarded_v1";
const img = (id: string) => MENU.find((m) => m.id === id)!.image;

const PAGES = [
  {
    title: "Authentic Thai Flavours",
    body: "Pad Thai, Pad Kee Mao, slow-cooked curries and our Crying Tiger Steak, made fresh in Young.",
    image: img("pad-kee-mao"),
  },
  {
    title: "Western Comfort Food",
    body: "Hand-crumbed schnitzels, creamy pastas, stacked burgers and loaded fries the whole table will love.",
    image: img("chicken-schnitzel"),
  },
  {
    title: "Matcha & Ube Drinks",
    body: "Sip our exciting Matcha, Ube and Frosty Boba series, brand new for 2026.",
    image: img("matcha-series"),
  },
  {
    title: "Order & Reserve in Seconds",
    body: "Browse the full menu with prices, order for pick-up or local delivery, and book your table in a few taps.",
    image: BRAND.heroFirst,
  },
];

/** Stage 1: animated launch screen. Matches the native splash (same colour + monogram) so there is no flash. */
function Splash({ onFinish }: { onFinish: () => void }) {
  const { width } = useLayout();
  const mono = useSharedValue(1);
  const logo = useSharedValue(0);
  const line = useSharedValue(0);

  useEffect(() => {
    mono.value = withDelay(350, withTiming(0, { duration: 500 }));
    logo.value = withDelay(350, withTiming(1, { duration: 650, easing: Easing.out(Easing.cubic) }));
    line.value = withDelay(1100, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
    const t = setTimeout(onFinish, 2700);
    return () => clearTimeout(t);
  }, [mono, logo, line, onFinish]);

  const monoStyle = useAnimatedStyle(() => ({ opacity: mono.value }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logo.value,
    transform: [{ scale: 0.82 + 0.18 * logo.value }],
  }));
  const lineStyle = useAnimatedStyle(() => ({ width: 90 * line.value, opacity: line.value }));

  const size = Math.min(width * 0.42, 190);

  return (
    <Animated.View
      exiting={FadeOut.duration(400)}
      style={{ flex: 1, backgroundColor: C.forest, alignItems: "center", justifyContent: "center" }}
    >
      <View style={{ width: 200, height: 200, alignItems: "center", justifyContent: "center" }}>
        <Animated.View style={[{ position: "absolute" }, monoStyle]}>
          <Image source={MONOGRAM} style={{ width: 200, height: 200 }} contentFit="contain" />
        </Animated.View>
        <Animated.View style={logoStyle}>
          <Logo size={size} />
        </Animated.View>
      </View>

      <Animated.Text
        entering={FadeInDown.delay(900).duration(700)}
        style={{
          marginTop: 30,
          color: "white",
          fontSize: 26,
          fontWeight: "800",
          letterSpacing: 1.5,
          textTransform: "uppercase",
        }}
      >
        {BRAND.name}
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(1100).duration(700)}
        style={{
          marginTop: 8,
          color: C.onForestSoft,
          fontSize: 12.5,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        Restaurant · Young NSW
      </Animated.Text>
      <Animated.View
        style={[{ marginTop: 22, height: 2, borderRadius: 1, backgroundColor: C.cream }, lineStyle]}
      />
    </Animated.View>
  );
}

/** Stage 2: Next → Next → Next onboarding. */
function Onboarding({ onDone }: { onDone: () => void }) {
  const { width, height, insets, isTablet } = useLayout();
  const listRef = useRef<FlatList<(typeof PAGES)[number]>>(null);
  const [page, setPage] = useState(0);
  const last = page === PAGES.length - 1;
  const landscape = width > height;

  const goTo = useCallback((i: number) => {
    setPage(i);
    listRef.current?.scrollToOffset({ offset: i * width, animated: true });
  }, [width]);

  useEffect(() => {
    // Android back button steps back through the pages instead of closing the app
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (page > 0) {
        goTo(page - 1);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [page, goTo]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setPage(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const imgSize = landscape
    ? Math.min(height - insets.top - insets.bottom - 170, 300)
    : Math.min(width * (isTablet ? 0.62 : 0.78), 420);

  return (
    <Animated.View
      entering={FadeIn.duration(450)}
      exiting={FadeOut.duration(450)}
      style={{ flex: 1, backgroundColor: C.forest }}
    >
      {/* Top bar */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingLeft: insets.left + 22,
          paddingRight: insets.right + 22,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Logo size={42} />
        <Pressable
          onPress={() => {
            tap();
            onDone();
          }}
          hitSlop={14}
          accessibilityRole="button"
          accessibilityLabel="Skip introduction"
        >
          <Text style={{ color: C.cream, fontSize: 15, fontWeight: "700", opacity: last ? 0 : 1 }}>
            Skip
          </Text>
        </Pressable>
      </View>

      <FlatList
        key={width}
        ref={listRef}
        contentOffset={{ x: page * width, y: 0 }}
        data={PAGES}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(p) => p.title}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <View
            style={{
              width,
              paddingHorizontal: insets.left + 28,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: landscape ? "row" : "column",
              gap: landscape ? 36 : 0,
            }}
          >
            <View
              style={{
                width: imgSize,
                height: imgSize,
                borderRadius: imgSize / 2,
                overflow: "hidden",
                borderWidth: 4,
                borderColor: C.cream,
                backgroundColor: C.forestDeep,
              }}
            >
              <SafeImage uri={item.image} style={{ width: "100%", height: "100%" }} />
            </View>
            <View style={{ maxWidth: 520, alignItems: landscape ? "flex-start" : "center" }}>
              <Text
                style={{
                  marginTop: landscape ? 0 : 34,
                  color: "white",
                  fontSize: isTablet ? 38 : 28,
                  lineHeight: isTablet ? 44 : 34,
                  fontWeight: "800",
                  textAlign: landscape ? "left" : "center",
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  marginTop: 14,
                  color: C.onForestSoft,
                  fontSize: isTablet ? 19 : 16,
                  lineHeight: isTablet ? 29 : 24,
                  textAlign: landscape ? "left" : "center",
                }}
              >
                {item.body}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Dots + Next */}
      <View
        style={{
          paddingBottom: insets.bottom + 22,
          paddingLeft: insets.left + 24,
          paddingRight: insets.right + 24,
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 22 }}>
          {PAGES.map((p, i) => (
            <View
              key={p.title}
              style={{
                width: page === i ? 28 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: C.cream,
                opacity: page === i ? 1 : 0.35,
              }}
            />
          ))}
        </View>
        <Pressable
          onPress={() => {
            tap();
            if (last) onDone();
            else goTo(page + 1);
          }}
          accessibilityRole="button"
          accessibilityLabel={last ? "Get started" : "Next"}
          style={{
            width: "100%",
            maxWidth: 420,
            minHeight: 56,
            borderRadius: 18,
            backgroundColor: C.cream,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: C.ink, fontSize: 17, fontWeight: "800", marginRight: 8 }}>
            {last ? "Get Started" : "Next"}
          </Text>
          {last ? <Check color={C.ink} size={20} /> : <ArrowRight color={C.ink} size={20} />}
        </Pressable>
      </View>
    </Animated.View>
  );
}

/** Splash → (Onboarding on first launch) → app. Rendered on top of the app until finished. */
export function IntroFlow({ onFinished }: { onFinished: () => void }) {
  const [stage, setStage] = useState<"splash" | "onboarding">("splash");
  const [needsOnboarding, setNeedsOnboarding] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const seen = await AsyncStorage.getItem(STORE_KEY);
        if (alive && seen === "1" && !BRAND.onboardingEveryLaunch) setNeedsOnboarding(false);
      } catch {
        /* storage unavailable: just show onboarding */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const afterSplash = useCallback(() => {
    if (needsOnboarding) setStage("onboarding");
    else onFinished();
  }, [needsOnboarding, onFinished]);

  const finishOnboarding = useCallback(() => {
    AsyncStorage.setItem(STORE_KEY, "1").catch(() => {});
    onFinished();
  }, [onFinished]);

  return (
    <View
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, elevation: 100, backgroundColor: C.forest }}
      onLayout={() => {
        // Hide the native splash only after the animated one is on screen
        SplashScreen.hideAsync().catch(() => {});
      }}
    >
      {stage === "splash" ? <Splash onFinish={afterSplash} /> : <Onboarding onDone={finishOnboarding} />}
    </View>
  );
}
