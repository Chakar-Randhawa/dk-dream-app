import React, { useState } from "react";
import { Linking, Platform, Pressable, Text, TextInput, View } from "react-native";
import { WebView } from "react-native-webview";
import { Clock, Mail, MapPin, Navigation, Phone, Send, TriangleAlert } from "lucide-react-native";
import { BRAND } from "../../data/brand";
import { makeReference, sendEmail } from "../../services/email";
import { useLayout } from "../../hooks/useLayout";
import { Screen } from "../../components/Screen";
import { SuccessOverlay } from "../../components/SuccessOverlay";
import { Button, Card, C, FieldError, PLACEHOLDER, SectionHeading, inputClass, tap } from "../../components/ui";

const q = encodeURIComponent(BRAND.mapQuery);
// Real Google Maps embed (no API key needed) centred on the restaurant's address.
const EMBED_URL = `https://maps.google.com/maps?q=${q}&z=16&output=embed`;
const OPEN_URL = `https://www.google.com/maps/search/?api=1&query=${q}`;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

function open(url: string) {
  tap();
  Linking.openURL(url).catch(() => {});
}

function LiveMap() {
  if (Platform.OS === "web") {
    return React.createElement("iframe", { src: EMBED_URL, title: "DK Dream Kitchen map", style: { border: 0, width: "100%", height: "100%" } });
  }
  return (
    <WebView
      source={{ uri: EMBED_URL }}
      style={{ flex: 1, backgroundColor: C.paper }}
      originWhitelist={["https://*", "http://*"]}
      javaScriptEnabled
      domStorageEnabled
      nestedScrollEnabled
      setSupportMultipleWindows={false}
    />
  );
}

function Tile({ label, sub, Icon, onPress }: { label: string; sub: string; Icon: React.ComponentType<{ color?: string; size?: number }>; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} className="active:opacity-80" style={{ flex: 1 }}>
      <Card style={{ padding: 14, alignItems: "center" }}>
        <View className="h-11 w-11 items-center justify-center rounded-full bg-forest">
          <Icon color={C.cream} size={21} />
        </View>
        <Text className="mt-2 text-sm font-extrabold uppercase text-ink">{label}</Text>
        <Text className="text-[11px] text-ink/65" numberOfLines={1}>{sub}</Text>
      </Card>
    </Pressable>
  );
}

export default function ContactScreen() {
  const { isTablet } = useLayout();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [doneRef, setDoneRef] = useState<string | null>(null);

  const send = async () => {
    setSendError(null);
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = "Enter a valid email so we can reply.";
    if (message.trim().length < 5) e.message = "Please write a short message.";
    setErrors(e);
    if (Object.keys(e).length) return;

    setSending(true);
    const ref = makeReference("MSG");
    const result = await sendEmail(
      `New message from ${name.trim()} (${ref})`,
      { "Reference number": ref, Name: name.trim(), "Customer email": email.trim(), Message: message.trim(), "Sent at": new Date().toLocaleString("en-AU") },
      email.trim()
    );
    setSending(false);
    if (result.ok) setDoneRef(ref);
    else setSendError(result.error);
  };

  return (
    <Screen title="Find Us" subtitle={BRAND.address}>
      <View className="pt-3">
        <View style={{ height: isTablet ? 360 : 260, borderRadius: 26, overflow: "hidden", backgroundColor: C.white, borderWidth: 1, borderColor: C.line }}>
          <LiveMap />
        </View>
        <View className="mt-3 flex-row" style={{ gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Button label="Get Directions" icon={(c) => <Navigation color={c} size={18} />} onPress={() => open(DIRECTIONS_URL)} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Open in Maps" variant="outlineOnLight" icon={(c) => <MapPin color={c} size={18} />} onPress={() => open(OPEN_URL)} />
          </View>
        </View>

        <Card style={{ padding: 16, marginTop: 16 }}>
          <View className="flex-row items-center">
            <Clock color={C.forest} size={22} />
            <View className="ml-3 flex-1">
              <Text className="text-xs font-bold uppercase tracking-[2px] text-ink/60">{BRAND.hours[0].days}</Text>
              <Text className="mt-0.5 text-lg font-extrabold text-ink">{BRAND.hours[0].time}</Text>
            </View>
          </View>
          <View className="mt-3 flex-row items-center border-t border-ink/10 pt-3">
            <MapPin color={C.forest} size={22} />
            <Text className="ml-3 flex-1 text-base text-ink">{BRAND.address}</Text>
          </View>
        </Card>

        <View className="mt-4 flex-row" style={{ gap: 10 }}>
          <Tile label="Call" sub={BRAND.phone} Icon={Phone} onPress={() => open(BRAND.phoneLink)} />
          <Tile label="Email" sub={BRAND.email} Icon={Mail} onPress={() => open(`mailto:${BRAND.email}`)} />
        </View>
        <View className="mt-3 flex-row" style={{ gap: 10 }}>
          <View style={{ flex: 1 }}><Button label="Facebook" variant="outlineOnLight" onPress={() => open(BRAND.facebook)} /></View>
          <View style={{ flex: 1 }}><Button label="Instagram" variant="outlineOnLight" onPress={() => open(BRAND.instagram)} /></View>
        </View>

        <SectionHeading eyebrow="Say hello" title="Send a Message" />
        <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={PLACEHOLDER} className={inputClass} />
        <FieldError text={errors.name} />
        <TextInput value={email} onChangeText={setEmail} placeholder="Your email" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={PLACEHOLDER} className={`${inputClass} mt-3`} />
        <FieldError text={errors.email} />
        <TextInput value={message} onChangeText={setMessage} placeholder="How can we help?" multiline placeholderTextColor={PLACEHOLDER} className={`${inputClass} mt-3 min-h-[120px]`} style={{ textAlignVertical: "top" }} />
        <FieldError text={errors.message} />

        {sendError ? (
          <View className="mt-4 flex-row items-start rounded-2xl border border-[#9B2C2C]/40 bg-[#9B2C2C]/10 p-3">
            <TriangleAlert color="#9B2C2C" size={18} />
            <Text className="ml-2 flex-1 text-xs text-ink">Your message was not sent: {sendError} Please try again, or email {BRAND.email}.</Text>
          </View>
        ) : null}
        <View className="mb-4 mt-4">
          <Button label="Send Message" onPress={send} loading={sending} icon={(c) => <Send color={c} size={18} />} />
        </View>
      </View>

      <SuccessOverlay
        visible={!!doneRef}
        title="Message Sent!"
        message="Thanks for getting in touch. The DK Dream Kitchen team will reply by email."
        reference={doneRef ?? undefined}
        buttonLabel="Close"
        onClose={() => { setDoneRef(null); setName(""); setEmail(""); setMessage(""); }}
      />
    </Screen>
  );
}
