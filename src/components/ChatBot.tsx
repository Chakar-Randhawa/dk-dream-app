import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { MessageCircle, Send, X } from "lucide-react-native";
import { MotiView } from "./moti";
import { BRAND } from "../data/brand";
import { useLayout } from "../hooks/useLayout";
import { C, Logo, PLACEHOLDER, tap } from "./ui";

type Msg = { id: string; from: "bot" | "user"; text: string };
type QA = { q: string; keys: string[]; a: string };

const QA_LIST: QA[] = [
  {
    q: "Opening hours",
    keys: ["hour", "open", "close", "time", "when"],
    a: `We are open ${BRAND.hours[0].days}, ${BRAND.hours[0].time}, and closed on Sundays. Please call ${BRAND.phone} if you would like to confirm a particular day.`,
  },
  {
    q: "Where are you?",
    keys: ["where", "location", "address", "find", "direction", "map"],
    a: `You will find us at ${BRAND.address}. Open the Contact tab for a live map and one-tap directions.`,
  },
  {
    q: "What's on the menu?",
    keys: ["menu", "food", "dish", "eat", "thai", "italian", "pasta", "burger", "schnitzel"],
    a: "Our kitchen blends Thai and Western comfort food: Pad Thai, Pad Kee Mao, Thai curries and Crying Tiger Steak; Carbonara, Bolognese and Prawn Fettuccine; DK burgers, schnitzels, Chicken Parmigiana and loaded fries. Open the Menu tab to see every dish with prices.",
  },
  {
    q: "Matcha & boba?",
    keys: ["matcha", "boba", "bubble", "drink", "coffee", "shake", "beverage", "ube"],
    a: "Our 2026 drinks lineup includes the Signature Matcha Series (Matcha Cloud, Strawberry, Ube and Mango Matcha), DK Frosty Boba, fruit thick shakes, iced coffees and our Royale Blend espresso.",
  },
  {
    q: "How do I book a table?",
    keys: ["book", "reserv", "table", "booking"],
    a: "Open the Reserve tab, enter your name, phone, email, guests, date and a time slot between 5:00 PM and 9:00 PM, then tap Reserve. You will get a reference number on screen and we receive your booking by email.",
  },
  {
    q: "How do I order?",
    keys: ["order", "pickup", "pick-up", "delivery", "deliver", "cart", "takeaway"],
    a: "Add dishes with the + button on the Menu tab, then open the Order tab, choose Pick-up or Local Delivery, enter your details and tap Submit Order. We receive the order by email and you get a reference number.",
  },
  {
    q: "Extras & allergies",
    keys: ["extra", "add-on", "addon", "add on", "allerg", "gluten", "nut", "dairy", "seafood", "no lettuce", "note", "vegetarian", "vegan"],
    a: "Tap + on any dish to add paid extras (like extra chicken or sauce) and write a note, e.g. an allergy or “no lettuce”. You can also tick your allergies in the Order tab before submitting. For serious allergies please also call us on " + BRAND.phone + ".",
  },
  {
    q: "Contact number",
    keys: ["phone", "call", "number", "contact", "email"],
    a: `Call us on ${BRAND.phone} or email ${BRAND.email}.`,
  },
];

const GREETING: Msg = {
  id: "greet",
  from: "bot",
  text: "Hi! I'm the DK Dream Kitchen assistant. Ask me about opening hours, our location, the menu or how to book a table.",
};

function reply(input: string): string {
  const text = input.toLowerCase();
  // Best match wins: count keywords that start a word (so "eat" no longer matches "great").
  let hit: QA | undefined;
  let best = 0;
  for (const qa of QA_LIST) {
    const score = qa.keys.filter((k) => new RegExp(`(^|[^a-z])${k.replace(/[-\s]/g, "[-\\s]?")}`).test(text)).length;
    if (score > best) {
      best = score;
      hit = qa;
    }
  }
  if (hit) return hit.a;
  return `I'm not sure about that one. Please call us on ${BRAND.phone} or email ${BRAND.email} and the team will help.`;
}

export function ChatBot({ bottomOffset }: { bottomOffset: number }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<FlatList<Msg>>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { insets, isTablet } = useLayout();

  useEffect(
    () => () => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
    },
    []
  );

  useEffect(() => {
    const t = setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(t);
  }, [messages, typing]);

  const ask = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    tap();
    setMessages((m) => [...m, { id: `u${Date.now()}`, from: "user", text: clean }]);
    setDraft("");
    setTyping(true);
    if (replyTimer.current) clearTimeout(replyTimer.current);
    replyTimer.current = setTimeout(() => {
      setMessages((m) => [...m, { id: `b${Date.now()}`, from: "bot", text: reply(clean) }]);
      setTyping(false);
    }, 700);
  };

  return (
    <>
      <MotiView
        from={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 600 }}
        style={{ position: "absolute", right: Math.max(insets.right, 0) + 16, bottom: bottomOffset }}
      >
        <Pressable
          onPress={() => {
            tap();
            setOpen(true);
          }}
          accessibilityRole="button"
          accessibilityLabel="Open support chat"
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: C.cream,
            borderWidth: 2,
            borderColor: C.forest,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 8,
          }}
        >
          <MessageCircle color={C.forest} size={25} />
        </Pressable>
      </MotiView>

      <Modal
        visible={open}
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setOpen(false)}
      >
        <View style={{ flex: 1, backgroundColor: C.paper }}>
          <View
            style={{
              backgroundColor: C.forest,
              paddingTop: insets.top + 10,
              paddingBottom: 14,
              paddingLeft: insets.left + 20,
              paddingRight: insets.right + 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Logo size={44} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ color: "white", fontSize: 18, fontWeight: "800" }}>DK Assistant</Text>
              <Text style={{ color: C.onForestSoft, fontSize: 12 }}>● Online</Text>
            </View>
            <Pressable
              onPress={() => setOpen(false)}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close chat"
              style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(241,233,212,0.14)", alignItems: "center", justifyContent: "center" }}
            >
              <X color={C.cream} size={20} />
            </Pressable>
          </View>

          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(m) => m.id}
              style={{ flex: 1 }}
              contentContainerStyle={{
                padding: 20,
                paddingLeft: insets.left + 20,
                paddingRight: insets.right + 20,
                gap: 12,
                width: "100%",
                maxWidth: 760,
                alignSelf: "center",
              }}
              renderItem={({ item }) => (
                <MotiView
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: "timing", duration: 250 }}
                  style={{ alignSelf: item.from === "user" ? "flex-end" : "flex-start", maxWidth: isTablet ? "70%" : "86%" }}
                >
                  <View
                    style={{
                      backgroundColor: item.from === "user" ? C.forest : C.white,
                      borderRadius: 20,
                      borderBottomRightRadius: item.from === "user" ? 6 : 20,
                      borderBottomLeftRadius: item.from === "bot" ? 6 : 20,
                      paddingHorizontal: 15,
                      paddingVertical: 11,
                      borderWidth: item.from === "bot" ? 1 : 0,
                      borderColor: C.line,
                    }}
                  >
                    <Text style={{ color: item.from === "user" ? C.cream : C.ink, fontSize: 15.5, lineHeight: 22 }}>
                      {item.text}
                    </Text>
                  </View>
                </MotiView>
              )}
              ListFooterComponent={
                typing ? <Text style={{ color: C.inkSoft, fontSize: 12, paddingTop: 2 }}>DK Assistant is typing…</Text> : undefined
              }
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexGrow: 0 }}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 10 }}
              keyboardShouldPersistTaps="handled"
            >
              {QA_LIST.map((qa) => (
                <Pressable
                  key={qa.q}
                  onPress={() => ask(qa.q)}
                  style={{ borderRadius: 999, borderWidth: 1.5, borderColor: C.ink, backgroundColor: C.white, paddingHorizontal: 15, paddingVertical: 9 }}
                >
                  <Text style={{ color: C.ink, fontSize: 14, fontWeight: "700" }}>{qa.q}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderTopWidth: 1,
                borderTopColor: C.line,
                backgroundColor: C.paper,
                paddingTop: 10,
                paddingHorizontal: 14,
                paddingBottom: Math.max(insets.bottom, 12),
                paddingLeft: insets.left + 14,
                paddingRight: insets.right + 14,
              }}
            >
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Ask about hours, menu, bookings…"
                placeholderTextColor={PLACEHOLDER}
                onSubmitEditing={() => ask(draft)}
                returnKeyType="send"
                style={{ flex: 1, minHeight: 50, marginRight: 10, borderRadius: 25, borderWidth: 1, borderColor: "rgba(28,61,44,0.2)", backgroundColor: C.white, paddingHorizontal: 18, fontSize: 16, color: C.ink }}
              />
              <Pressable
                onPress={() => ask(draft)}
                accessibilityRole="button"
                accessibilityLabel="Send message"
                style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: C.forest, alignItems: "center", justifyContent: "center" }}
              >
                <Send color={C.cream} size={20} />
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}
