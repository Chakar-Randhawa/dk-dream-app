import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Leaf, Plus } from "lucide-react-native";
import { MotiView } from "../../components/moti";
import { CATEGORIES, MENU, priceLabel, type CategoryId, type MenuItem } from "../../data/menu";
import { useLayout } from "../../hooks/useLayout";
import { PageHeader } from "../../components/Screen";
import { C, SafeImage, tap } from "../../components/ui";
import { useItemAdder } from "../../components/useItemAdder";

type Layout = { x: number; width: number };

function CategoryBar({ active, onChange }: { active: CategoryId; onChange: (id: CategoryId) => void }) {
  const { insets } = useLayout();
  const scroller = useRef<ScrollView>(null);
  const [layouts, setLayouts] = useState<Record<string, Layout>>({});
  const current = layouts[active];

  useEffect(() => {
    if (current) {
      (scroller.current as unknown as { scrollTo: (o: { x: number; animated: boolean }) => void } | null)?.scrollTo({
        x: Math.max(current.x - 60, 0),
        animated: true,
      });
    }
  }, [current]);

  return (
    <View style={{ backgroundColor: C.forest }}>
      <ScrollView
        ref={scroller as never}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: insets.left + 10 }}
      >
        <View style={{ flexDirection: "row" }}>
          {CATEGORIES.map((c) => {
            const on = c.id === active;
            return (
              <Pressable
                key={c.id}
                onPress={() => {
                  tap();
                  onChange(c.id);
                }}
                onLayout={(e) => {
                  const { x, width } = e.nativeEvent.layout;
                  setLayouts((p) => ({ ...p, [c.id]: { x, width } }));
                }}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                style={{ paddingHorizontal: 14, paddingVertical: 14 }}
              >
                <Text
                  style={{
                    fontSize: 14.5,
                    fontWeight: on ? "800" : "600",
                    color: on ? C.cream : "rgba(241,233,212,0.65)",
                  }}
                >
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
          {current ? (
            <MotiView
              animate={{ left: current.x + 14, width: current.width - 28 }}
              transition={{ type: "spring", damping: 16, stiffness: 160 }}
              style={{ position: "absolute", bottom: 0, height: 3, borderRadius: 2, backgroundColor: C.cream }}
            />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

function DishCard({ item, index, width, onAdd }: { item: MenuItem; index: number; width: number; onAdd: (i: MenuItem) => void }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 24 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", delay: Math.min(index, 6) * 60, damping: 15 }}
      style={{ width, padding: 6 }}
    >
      <View style={{ flex: 1, borderRadius: 22, overflow: "hidden", backgroundColor: C.white, borderWidth: 1, borderColor: C.line }}>
        <View>
          <SafeImage uri={item.image} style={{ width: "100%", aspectRatio: 1.25 }} />
          {item.tags?.length ? (
            <View className="absolute left-2 top-2 flex-row items-center rounded-full bg-forest px-2 py-1">
              <Leaf color={C.cream} size={11} />
              <Text className="ml-1 text-[10px] font-extrabold text-cream">{item.tags[0]}</Text>
            </View>
          ) : null}
        </View>
        <View className="flex-1 p-3">
          <Text className="text-sm font-extrabold text-ink" numberOfLines={2}>
            {item.name}
          </Text>
          <Text className="mt-1 text-xs leading-4 text-ink/65" numberOfLines={3}>
            {item.description}
          </Text>
          <View className="mt-auto flex-row items-center justify-between pt-3">
            <Text className="flex-1 pr-2 text-sm font-extrabold text-ink" numberOfLines={1}>
              {priceLabel(item)}
            </Text>
            <Pressable
              onPress={() => onAdd(item)}
              accessibilityRole="button"
              accessibilityLabel={`Add ${item.name} to order`}
              className="h-10 w-10 items-center justify-center rounded-full bg-forest active:opacity-80"
            >
              <Plus color={C.cream} size={20} />
            </Pressable>
          </View>
        </View>
      </View>
    </MotiView>
  );
}

export default function MenuScreen() {
  const { insets, wideWidth, columns, fabSpace } = useLayout();
  const params = useLocalSearchParams<{ cat?: string; t?: string }>();
  const [active, setActive] = useState<CategoryId>("thai");
  const { add, sheet } = useItemAdder();

  useEffect(() => {
    const found = CATEGORIES.find((c) => c.id === params.cat);
    if (found) setActive(found.id);
  }, [params.cat, params.t]);

  const items = useMemo(() => MENU.filter((m) => m.category === active), [active]);
  const gridWidth = wideWidth - 12;
  const colWidth = Math.floor(gridWidth / columns);
  const hasUnpriced = items.some((i) => i.price === undefined && !i.variants);

  return (
    <View style={{ flex: 1, backgroundColor: C.paper }}>
      <PageHeader title="Our Menu" subtitle="Thai & Western · prices in AUD" />
      <CategoryBar active={active} onChange={setActive} />
      <FlatList
        key={`${active}-${columns}`}
        data={items}
        numColumns={columns}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignSelf: "center",
          paddingLeft: insets.left + 6,
          paddingRight: insets.right + 6,
          paddingTop: 12,
          paddingBottom: fabSpace + 24,
        }}
        ListHeaderComponent={
          hasUnpriced ? (
            <Text className="mb-2 px-2 text-xs text-ink/60">
              Prices for these dishes are confirmed in store. You can still add them to your order.
            </Text>
          ) : undefined
        }
        renderItem={({ item, index }) => <DishCard item={item} index={index} width={colWidth} onAdd={add} />}
      />
      {sheet}
    </View>
  );
}
