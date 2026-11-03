import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Mail, Minus, Plus, TriangleAlert, Users } from "lucide-react-native";
import { BRAND, TIME_SLOTS } from "../../data/brand";
import { makeReference, openMailFallback, sendEmail } from "../../services/email";
import { useLayout } from "../../hooks/useLayout";
import { Screen } from "../../components/Screen";
import { SuccessOverlay } from "../../components/SuccessOverlay";
import { Button, Card, C, FieldError, FieldLabel, PLACEHOLDER, inputClass, tap } from "../../components/ui";

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "6:30 PM" on a given day -> Date */
function slotStart(d: Date, t: string): Date {
  const [clock, ap] = t.split(" ");
  const [hh, mm] = clock.split(":").map(Number);
  const h = ap === "PM" && hh !== 12 ? hh + 12 : ap === "AM" && hh === 12 ? 0 : hh;
  const out = new Date(d);
  out.setHours(h, mm, 0, 0);
  return out;
}
/** A slot can be booked if it is at least 30 minutes away. */
const slotOpen = (d: Date, t: string) => slotStart(d, t).getTime() - Date.now() >= 30 * 60 * 1000;
const isToday = (d: Date) => d.toDateString() === new Date().toDateString();

export default function ReserveScreen() {
  const { isTablet, gutter, insets } = useLayout();
  const dates = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    return Array.from({ length: 21 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    }).filter((d) => !BRAND.closedDays.includes(d.getDay())); // closed days are not offered
  }, []);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(2);
  const [dateIdx, setDateIdx] = useState(() =>
    Math.max(0, dates.findIndex((d) => TIME_SLOTS.some((t) => slotOpen(d, t))))
  );
  const [slot, setSlot] = useState<string | null>(null);
  const [requests, setRequests] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [mail, setMail] = useState<{ subject: string; fields: Record<string, string> } | null>(null);
  const [done, setDone] = useState<{ ref: string; when: string } | null>(null);

  const dateText = (d: Date) => `${DAY[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`;

  const submit = async () => {
    setSendError(null);
    setMail(null);
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Please enter your name.";
    if (phone.replace(/\D/g, "").length < 8) e.phone = "Enter a valid contact number.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = "Enter a valid email address.";
    if (!slot || !slotOpen(dates[dateIdx], slot)) e.slot = "Please pick an available time slot.";
    setErrors(e);
    if (Object.keys(e).length || !slot) return;

    setSending(true);
    const ref = makeReference("RSV");
    const when = `${dateText(dates[dateIdx])} at ${slot}`;
    const subject = `New table reservation ${ref}`;
    const fields: Record<string, string> = {
      "Reference number": ref,
      "Guest name": name.trim(),
      Phone: phone.trim(),
      "Guest email": email.trim(),
      Guests: String(guests),
      Date: dateText(dates[dateIdx]),
      Time: slot,
      "Special requests / allergies": requests.trim() || "none",
      "Booked at": new Date().toLocaleString("en-AU"),
    };
    const result = await sendEmail(subject, fields, email.trim());
    setSending(false);
    if (result.ok) setDone({ ref, when });
    else {
      setSendError(result.error);
      setMail({ subject, fields });
    }
  };

  const closeSuccess = () => {
    setDone(null);
    setName("");
    setPhone("");
    setEmail("");
    setGuests(2);
    setSlot(null);
    setRequests("");
    setMail(null);
    router.navigate("/");
  };

  return (
    <Screen title="Reserve a Table" subtitle={`${BRAND.daysShort} · ${BRAND.hours[0].time}`}>
      <FieldLabel>Your name</FieldLabel>
      <TextInput value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor={PLACEHOLDER} className={inputClass} />
      <FieldError text={errors.name} />
      <FieldLabel>Contact number</FieldLabel>
      <TextInput value={phone} onChangeText={setPhone} placeholder="04xx xxx xxx" keyboardType="phone-pad" placeholderTextColor={PLACEHOLDER} className={inputClass} />
      <FieldError text={errors.phone} />
      <FieldLabel>Email</FieldLabel>
      <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={PLACEHOLDER} className={inputClass} />
      <FieldError text={errors.email} />

      <FieldLabel>Guests</FieldLabel>
      <Card style={{ padding: 12 }}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Users color={C.forest} size={22} />
            <Text className="ml-3 text-base font-bold text-ink">{guests} {guests === 1 ? "guest" : "guests"}</Text>
          </View>
          <View className="flex-row items-center">
            <Pressable onPress={() => { tap(); setGuests((g) => Math.max(1, g - 1)); }} accessibilityRole="button" accessibilityLabel="Fewer guests" className="h-12 w-12 items-center justify-center rounded-full bg-ink/10">
              <Minus color={C.ink} size={20} />
            </Pressable>
            <Text className="w-10 text-center text-xl font-extrabold text-ink">{guests}</Text>
            <Pressable onPress={() => { tap(); setGuests((g) => Math.min(20, g + 1)); }} accessibilityRole="button" accessibilityLabel="More guests" className="h-12 w-12 items-center justify-center rounded-full bg-forest">
              <Plus color={C.cream} size={20} />
            </Pressable>
          </View>
        </View>
      </Card>

      <FieldLabel>Date</FieldLabel>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -gutter - insets.left }} contentContainerStyle={{ paddingHorizontal: gutter + insets.left, gap: 10 }}>
        {dates.map((d, i) => {
          const on = dateIdx === i;
          return (
            <Pressable
              key={d.toISOString()}
              onPress={() => { tap(); setDateIdx(i); if (slot && !slotOpen(d, slot)) setSlot(null); }}
              accessibilityRole="button"
              accessibilityLabel={dateText(d)}
              style={{ width: 66, alignItems: "center", paddingVertical: 12, borderRadius: 18, borderWidth: 1.5, borderColor: C.forest, backgroundColor: on ? C.forest : C.white }}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: on ? C.cream : C.inkSoft }}>{isToday(d) ? "Today" : DAY[d.getDay()]}</Text>
              <Text style={{ fontSize: 22, fontWeight: "800", color: on ? "white" : C.ink }}>{d.getDate()}</Text>
              <Text style={{ fontSize: 12, color: on ? C.cream : C.inkSoft }}>{MON[d.getMonth()]}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FieldLabel>{`Time (${BRAND.hours[0].time})`}</FieldLabel>
      <View className="flex-row flex-wrap" style={{ gap: 10 }}>
        {TIME_SLOTS.map((t) => {
          const on = slot === t;
          const off = !slotOpen(dates[dateIdx], t);
          return (
            <Pressable
              key={t}
              disabled={off}
              onPress={() => { tap(); setSlot(t); }}
              accessibilityRole="button"
              accessibilityState={{ disabled: off, selected: on }}
              style={{ width: isTablet ? "23%" : "30.5%", alignItems: "center", paddingVertical: 14, borderRadius: 16, borderWidth: 1.5, borderColor: C.forest, backgroundColor: on ? C.forest : C.white, opacity: off ? 0.35 : 1 }}
            >
              <Text style={{ fontWeight: "800", color: on ? C.cream : C.ink }}>{t}</Text>
            </Pressable>
          );
        })}
      </View>
      {dates[dateIdx] && isToday(dates[dateIdx]) ? (
        <Text className="mt-2 text-xs text-ink/60">Times that have passed (or are less than 30 minutes away) are unavailable.</Text>
      ) : null}
      <FieldError text={errors.slot} />

      <FieldLabel>Allergies & special requests (optional)</FieldLabel>
      <TextInput value={requests} onChangeText={setRequests} placeholder="Allergies, birthday, high chair, dietary needs…" multiline placeholderTextColor={PLACEHOLDER} className={`${inputClass} min-h-[90px]`} style={{ textAlignVertical: "top" }} />

      {sendError ? (
        <View className="mt-4 flex-row items-start rounded-2xl border border-[#9B2C2C]/40 bg-[#9B2C2C]/10 p-3">
          <TriangleAlert color="#9B2C2C" size={18} />
          <Text className="ml-2 flex-1 text-xs text-ink">Your booking was not sent: {sendError} Please try again, send it with your email app, or call us on {BRAND.phone}.</Text>
        </View>
      ) : null}
      {sendError && mail ? (
        <View className="mt-3">
          <Button label="Send with my email app" variant="outlineOnLight" icon={(c) => <Mail color={c} size={18} />} onPress={() => openMailFallback(mail.subject, mail.fields)} />
        </View>
      ) : null}

      <View className="mb-4 mt-6">
        <Button label="Reserve My Table" onPress={submit} loading={sending} />
      </View>

      <SuccessOverlay
        visible={!!done}
        title="Table Reserved!"
        message={`${guests} ${guests === 1 ? "guest" : "guests"} · ${done?.when ?? ""}. We look forward to welcoming you at DK Dream Kitchen.`}
        reference={done?.ref}
        note="Your booking has been emailed to the restaurant. Quote this reference number if you need to change it."
        buttonLabel="Back to Home"
        onClose={closeSuccess}
      />
    </Screen>
  );
}
