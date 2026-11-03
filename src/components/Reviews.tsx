import React, { useRef, useState } from "react";
import {
  FlatList,
  Linking,
  Pressable,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { BadgeCheck, Quote, Star } from "lucide-react-native";
import { BRAND } from "../data/brand";
import { REVIEWS, type Review } from "../data/reviews";
import { useLayout } from "../hooks/useLayout";
import { C, SectionHeading, tap } from "./ui";

const STAR = "#F2B01E";
const GAP = 14;
const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BRAND.mapQuery)}`;

function Stars() {
  return (
    <View style={{ flexDirection: "row", gap: 2 }} accessible accessibilityLabel="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={17} color={STAR} fill={STAR} />
      ))}
    </View>
  );
}

function ReviewCard({ r, width }: { r: Review; width: number }) {
  return (
    <View
      style={{
        width,
        backgroundColor: C.white,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: C.line,
        padding: 18,
        shadowColor: C.forest,
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Stars />
        <Quote size={26} color={C.forest} style={{ opacity: 0.35 }} />
      </View>
      <Text style={{ marginTop: 12, color: C.ink, fontSize: 15, lineHeight: 23 }} numberOfLines={9}>
        {r.text}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: C.forest,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: C.cream, fontSize: 17, fontWeight: "800" }}>
            {r.name.trim().charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ color: C.ink, fontSize: 15, fontWeight: "800" }} numberOfLines={1}>
            {r.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
            {r.localGuide ? (
              <>
                <BadgeCheck size={14} color={C.forest} />
                <Text style={{ color: C.inkSoft, fontSize: 12, marginLeft: 4 }}>Google Local Guide</Text>
              </>
            ) : (
              <Text style={{ color: C.inkSoft, fontSize: 12 }}>Google review</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

/** Swipeable, snapping row of customer reviews. */
export function Reviews() {
  const { width, insets, gutter, isTablet } = useLayout();
  const cardW = Math.min(isTablet ? 380 : width - insets.left - insets.right - gutter * 2 - 36, 400);
  const step = cardW + GAP;
  const [page, setPage] = useState(0);
  const ref = useRef<FlatList<Review>>(null);

  const onEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / step);
    setPage(Math.max(0, Math.min(REVIEWS.length - 1, i)));
  };

  return (
    <View style={{ paddingTop: 8 }}>
      <SectionHeading eyebrow="5-star Google reviews" title="What our customers say" size={isTablet ? 28 : 22} />
      <FlatList
        ref={ref}
        data={REVIEWS}
        horizontal
        keyExtractor={(r) => r.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={onEnd}
        contentContainerStyle={{
          paddingLeft: insets.left + gutter,
          paddingRight: insets.right + gutter,
          paddingBottom: 14,
          gap: GAP,
        }}
        renderItem={({ item }) => <ReviewCard r={item} width={cardW} />}
      />
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 4 }}>
        {REVIEWS.map((r, i) => (
          <View
            key={r.id}
            style={{
              width: page === i ? 22 : 7,
              height: 7,
              borderRadius: 4,
              backgroundColor: C.forest,
              opacity: page === i ? 1 : 0.3,
            }}
          />
        ))}
      </View>
      <Pressable
        onPress={() => {
          tap();
          Linking.openURL(MAPS).catch(() => {});
        }}
        accessibilityRole="link"
        accessibilityLabel="Read more reviews on Google Maps"
        style={{ alignSelf: "center", marginTop: 16, paddingVertical: 8, paddingHorizontal: 10 }}
      >
        <Text style={{ color: C.forest, fontSize: 14.5, fontWeight: "800", textDecorationLine: "underline" }}>
          Read more reviews on Google
        </Text>
      </Pressable>
    </View>
  );
}
