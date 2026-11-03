import React, { useCallback, useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Check, Minus, Plus, X } from "lucide-react-native";
import { MotiView, AnimatePresence } from "./moti";
import { useCart } from "../context/CartContext";
import { extrasFor } from "../data/extras";
import { formatAUD, priceLabel, type MenuItem } from "../data/menu";
import { useLayout } from "../hooks/useLayout";
import { Button, C, PLACEHOLDER, SafeImage, tap } from "./ui";

const NOTE_MAX = 200;

/**
 * Shared "add to order" behaviour. Every "+" opens a sheet where the customer can pick options,
 * paid extras (add-ons), write a note (allergies / "no lettuce") and choose the quantity.
 * Render `sheet` once inside the screen.
 */
export function useItemAdder() {
  const { addLine } = useCart();
  const { insets } = useLayout();
  const [active, setActive] = useState<MenuItem | null>(null);
  const [variantIdx, setVariantIdx] = useState(0);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [extraSel, setExtraSel] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scroller = useRef<ScrollView>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const showToast = useCallback((text: string) => {
    setToast(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  const add = useCallback((item: MenuItem) => {
    tap();
    setVariantIdx(0);
    const defaults: Record<string, string> = {};
    item.choices?.forEach((c) => {
      defaults[c.label] = c.options[0];
    });
    setPicked(defaults);
    setExtraSel({});
    setNote("");
    setQty(1);
    setActive(item);
  }, []);

  const extras = active ? extrasFor(active) : [];
  const chosenExtras = extras.filter((e) => extraSel[e.id]);
  const extrasTotal = chosenExtras.reduce((s, e) => s + e.price, 0);
  const base = active ? (active.variants ? active.variants[variantIdx]?.price : active.price) : undefined;

  const confirm = () => {
    if (!active) return;
    const variant = active.variants?.[variantIdx];
    const parts = [
      ...(active.choices?.map((c) => picked[c.label]).filter(Boolean) ?? []),
      ...(variant ? [variant.label] : []),
    ];
    addLine(active, { detail: parts.join(" · "), basePrice: base, extras: chosenExtras, note, qty });
    showToast(`${qty > 1 ? `${qty} × ` : ""}${active.name} added`);
    setActive(null);
  };

  let totalText = "";
  if (base !== undefined) totalText = ` · ${formatAUD((base + extrasTotal) * qty)}`;
  else if (extrasTotal > 0) totalText = ` · +${formatAUD(extrasTotal * qty)} extras`;

  const sheet = (
    <>
      <Modal
        visible={!!active}
        transparent
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setActive(null)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(14,32,9,0.6)" }}>
          <Pressable style={{ flex: 1 }} onPress={() => setActive(null)} accessibilityLabel="Close" />
          {active ? (
            <KeyboardAvoidingView behavior="padding">
              <View
                style={{
                  alignSelf: "center",
                  width: "100%",
                  maxWidth: 560,
                  backgroundColor: C.paper,
                  borderTopLeftRadius: 28,
                  borderTopRightRadius: 28,
                  maxHeight: "92%",
                  paddingBottom: Math.max(insets.bottom, 14),
                }}
              >
                <View className="flex-row items-center px-5 pb-3 pt-5">
                  <SafeImage uri={active.image} style={{ width: 58, height: 58, borderRadius: 14 }} />
                  <View className="ml-3 flex-1">
                    <Text className="text-lg font-extrabold text-ink" numberOfLines={2}>
                      {active.name}
                    </Text>
                    <Text className="text-sm font-bold text-ink/70">{priceLabel(active)}</Text>
                  </View>
                  <Pressable
                    onPress={() => setActive(null)}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="Close"
                    className="h-10 w-10 items-center justify-center rounded-full bg-ink/10"
                  >
                    <X color={C.ink} size={18} />
                  </Pressable>
                </View>

                <ScrollView
                  ref={scroller as never}
                  style={{ flexShrink: 1 }}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}
                >
                  {active.choices?.map((c) => (
                    <View key={c.label} className="mb-4">
                      <Text className="mb-2 text-xs font-bold uppercase tracking-[2px] text-ink/65">{c.label}</Text>
                      <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                        {c.options.map((o) => {
                          const on = picked[c.label] === o;
                          return (
                            <Pressable
                              key={o}
                              onPress={() => {
                                tap();
                                setPicked((p) => ({ ...p, [c.label]: o }));
                              }}
                              style={{
                                borderRadius: 999,
                                borderWidth: 1.5,
                                borderColor: C.ink,
                                backgroundColor: on ? C.forest : C.white,
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                              }}
                            >
                              <Text style={{ color: on ? C.cream : C.ink, fontWeight: "700" }}>{o}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  ))}

                  {active.variants ? (
                    <View className="mb-3">
                      <Text className="mb-2 text-xs font-bold uppercase tracking-[2px] text-ink/65">Choose option</Text>
                      {active.variants.map((v, i) => {
                        const on = variantIdx === i;
                        return (
                          <Pressable
                            key={v.label}
                            onPress={() => {
                              tap();
                              setVariantIdx(i);
                            }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              borderRadius: 16,
                              borderWidth: 1.5,
                              borderColor: on ? C.forest : C.line,
                              backgroundColor: on ? "rgba(67,149,45,0.10)" : C.white,
                              padding: 14,
                              marginBottom: 8,
                            }}
                          >
                            <View
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 11,
                                borderWidth: 2,
                                borderColor: C.forest,
                                backgroundColor: on ? C.forest : "transparent",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 12,
                              }}
                            >
                              {on ? <Check color={C.cream} size={13} /> : null}
                            </View>
                            <Text className="flex-1 text-sm text-ink">{v.label}</Text>
                            <Text className="ml-2 text-sm font-extrabold text-ink">{formatAUD(v.price)}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : null}

                  {extras.length > 0 ? (
                    <View className="mb-3">
                      <Text className="mb-2 text-xs font-bold uppercase tracking-[2px] text-ink/65">
                        Extras & add-ons
                      </Text>
                      {extras.map((e) => {
                        const on = !!extraSel[e.id];
                        return (
                          <Pressable
                            key={e.id}
                            onPress={() => {
                              tap();
                              setExtraSel((s) => ({ ...s, [e.id]: !s[e.id] }));
                            }}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: on }}
                            accessibilityLabel={`${e.label}, plus ${formatAUD(e.price)}`}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              borderRadius: 14,
                              borderWidth: 1.5,
                              borderColor: on ? C.forest : C.line,
                              backgroundColor: on ? "rgba(67,149,45,0.10)" : C.white,
                              paddingVertical: 12,
                              paddingHorizontal: 14,
                              marginBottom: 8,
                            }}
                          >
                            <View
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 6,
                                borderWidth: 2,
                                borderColor: C.forest,
                                backgroundColor: on ? C.forest : "transparent",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 12,
                              }}
                            >
                              {on ? <Check color={C.cream} size={14} /> : null}
                            </View>
                            <Text className="flex-1 text-sm text-ink">{e.label}</Text>
                            <Text className="ml-2 text-sm font-extrabold text-ink">+{formatAUD(e.price)}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : null}

                  <Text className="mb-2 mt-1 text-xs font-bold uppercase tracking-[2px] text-ink/65">
                    Allergies & special requests
                  </Text>
                  <TextInput
                    value={note}
                    onChangeText={(t) => setNote(t.slice(0, NOTE_MAX))}
                    placeholder="e.g. Allergic to seafood, no lettuce on the burger…"
                    placeholderTextColor={PLACEHOLDER}
                    multiline
                    maxLength={NOTE_MAX}
                    onFocus={() =>
                      setTimeout(
                        () =>
                          (scroller.current as unknown as { scrollToEnd: (o: { animated: boolean }) => void } | null)?.scrollToEnd({
                            animated: true,
                          }),
                        250
                      )
                    }
                    style={{
                      minHeight: 84,
                      textAlignVertical: "top",
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: "rgba(28,61,44,0.2)",
                      backgroundColor: C.white,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      fontSize: 15,
                      color: C.ink,
                    }}
                  />
                  <Text className="mt-1 text-right text-[11px] text-ink/50">
                    {note.length}/{NOTE_MAX}
                  </Text>
                </ScrollView>

                <View className="flex-row items-center px-5 pt-2" style={{ gap: 12 }}>
                  <View className="flex-row items-center rounded-full bg-ink/10">
                    <Pressable
                      onPress={() => {
                        tap();
                        setQty((q) => Math.max(1, q - 1));
                      }}
                      accessibilityRole="button"
                      accessibilityLabel="Decrease quantity"
                      className="h-12 w-11 items-center justify-center"
                    >
                      <Minus color={C.ink} size={18} />
                    </Pressable>
                    <Text className="w-6 text-center text-base font-extrabold text-ink">{qty}</Text>
                    <Pressable
                      onPress={() => {
                        tap();
                        setQty((q) => Math.min(20, q + 1));
                      }}
                      accessibilityRole="button"
                      accessibilityLabel="Increase quantity"
                      className="h-12 w-11 items-center justify-center"
                    >
                      <Plus color={C.ink} size={18} />
                    </Pressable>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button label={`Add to order${totalText}`} onPress={confirm} />
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          ) : null}
        </View>
      </Modal>

      <AnimatePresence>
        {toast ? (
          <MotiView
            key="toast"
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -20 }}
            style={{ position: "absolute", top: insets.top + 10, left: 20, right: 20, alignItems: "center", zIndex: 50 }}
            pointerEvents="none"
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: C.cream,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: C.forest,
                paddingHorizontal: 18,
                paddingVertical: 10,
                maxWidth: 520,
              }}
            >
              <Check color={C.forest} size={16} />
              <Text numberOfLines={1} style={{ color: C.ink, fontWeight: "800", marginLeft: 8, flexShrink: 1 }}>
                {toast}
              </Text>
            </View>
          </MotiView>
        ) : null}
      </AnimatePresence>
    </>
  );

  return { add, sheet };
}
