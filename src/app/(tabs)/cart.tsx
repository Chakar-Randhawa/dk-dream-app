import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Mail, Minus, Plus, ShoppingBag, Store, Truck, TriangleAlert } from "lucide-react-native";
import { MotiView } from "../../components/moti";
import { extrasSum, lineUnit, useCart } from "../../context/CartContext";
import { BRAND } from "../../data/brand";
import { formatAUD } from "../../data/menu";
import { makeReference, openMailFallback, sendEmail } from "../../services/email";
import { Screen } from "../../components/Screen";
import { SuccessOverlay } from "../../components/SuccessOverlay";
import { Button, Card, C, FieldError, FieldLabel, PLACEHOLDER, SafeImage, inputClass, tap } from "../../components/ui";

const ALLERGENS = ["Seafood", "Shellfish", "Peanuts", "Tree nuts", "Gluten", "Dairy", "Eggs", "Soy", "Sesame"];

export default function CartScreen() {
  const { lines, count, subtotal, unpricedCount, fulfilment, setFulfilment, increment, decrement, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [mail, setMail] = useState<{ subject: string; fields: Record<string, string> } | null>(null);
  const [done, setDone] = useState<{ ref: string } | null>(null);

  const toggleAllergen = (a: string) =>
    setAllergies((cur) => (cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]));

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Please enter your name.";
    if (phone.replace(/\D/g, "").length < 8) e.phone = "Enter a valid phone number.";
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) e.email = "Enter a valid email.";
    if (fulfilment === "delivery" && address.trim().length < 6) e.address = "Enter your delivery address.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    setSendError(null);
    setMail(null);
    if (!validate()) return;
    setSending(true);
    const ref = makeReference("ORD");
    const hasAllergy = allergies.length > 0;

    const itemsText = lines
      .map((l) => {
        const ext = extrasSum(l);
        const price =
          l.basePrice === undefined
            ? `base price to be confirmed${ext > 0 ? ` + extras ${formatAUD(ext * l.qty)}` : ""}`
            : formatAUD(lineUnit(l) * l.qty);
        return [
          `${l.qty} x ${l.name}${l.detail ? ` (${l.detail})` : ""}`,
          l.extras.length ? `   EXTRAS: ${l.extras.map((e) => `${e.label} (+${formatAUD(e.price)})`).join(", ")}` : "",
          l.note ? `   NOTE: ${l.note}` : "",
          `   ${price}`,
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n");

    const subject = `${hasAllergy ? "[ALLERGY] " : ""}New ${fulfilment === "pickup" ? "PICK-UP" : "DELIVERY"} order ${ref}`;
    const fields: Record<string, string> = {
      "Reference number": ref,
      "ALLERGY ALERT": hasAllergy ? allergies.join(", ") : "none",
      "Order type": fulfilment === "pickup" ? "Pick-up" : "Local delivery",
      "Customer name": name.trim(),
      Phone: phone.trim(),
      "Customer email": email.trim() || "not provided",
      "Delivery address": fulfilment === "delivery" ? address.trim() : "n/a (pick-up)",
      Items: itemsText,
      "Priced total (incl. extras)": formatAUD(subtotal),
      "Items needing price confirmation": String(unpricedCount),
      "Allergies & special requests": notes.trim() || "none",
      "Placed at": new Date().toLocaleString("en-AU"),
    };

    const result = await sendEmail(subject, fields, email.trim() || undefined);
    setSending(false);
    if (result.ok) setDone({ ref });
    else {
      setSendError(result.error);
      setMail({ subject, fields });
    }
  };

  const closeSuccess = () => {
    setDone(null);
    clear();
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setNotes("");
    setAllergies([]);
    setMail(null);
    router.navigate("/");
  };

  return (
    <Screen title="Your Order" subtitle={count ? `${count} item${count > 1 ? "s" : ""}` : "Cart is empty"}>
      {lines.length === 0 ? (
        <View className="items-center px-6 pt-20">
          <ShoppingBag color={C.forest} size={64} strokeWidth={1.4} />
          <Text className="mt-5 text-xl font-extrabold uppercase text-ink">Nothing here yet</Text>
          <Text className="mb-6 mt-2 text-center text-ink/65">Add some Thai or Western favourites from the menu.</Text>
          <Button label="Browse the menu" onPress={() => router.navigate("/menu")} />
        </View>
      ) : (
        <View className="pt-3">
          {lines.map((l, i) => {
            const ext = extrasSum(l);
            return (
              <MotiView key={l.lineId} from={{ opacity: 0, translateX: -24 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: "spring", delay: Math.min(i, 6) * 40 }}>
                <Card style={{ marginBottom: 12, padding: 12 }}>
                  <View className="flex-row items-center">
                    <SafeImage uri={l.image} style={{ width: 64, height: 64, borderRadius: 16 }} />
                    <View className="ml-3 flex-1">
                      <Text className="text-sm font-extrabold text-ink" numberOfLines={2}>{l.name}</Text>
                      {l.detail ? <Text className="text-xs text-ink/65" numberOfLines={2}>{l.detail}</Text> : null}
                      <Text className="mt-1 text-sm font-extrabold text-ink">
                        {l.basePrice === undefined
                          ? ext > 0
                            ? `Price by DK + ${formatAUD(ext * l.qty)} extras`
                            : "Price confirmed by DK"
                          : formatAUD(lineUnit(l) * l.qty)}
                      </Text>
                    </View>
                    <View className="flex-row items-center rounded-full bg-ink/10">
                      <Pressable onPress={() => { tap(); decrement(l.lineId); }} hitSlop={6} accessibilityRole="button" accessibilityLabel="Decrease quantity" className="h-10 w-10 items-center justify-center">
                        <Minus color={C.ink} size={16} />
                      </Pressable>
                      <Text className="w-6 text-center text-sm font-extrabold text-ink">{l.qty}</Text>
                      <Pressable onPress={() => { tap(); increment(l.lineId); }} hitSlop={6} accessibilityRole="button" accessibilityLabel="Increase quantity" className="h-10 w-10 items-center justify-center">
                        <Plus color={C.ink} size={16} />
                      </Pressable>
                    </View>
                  </View>
                  {l.extras.length > 0 || l.note ? (
                    <View className="mt-3 border-t border-ink/10 pt-2.5">
                      {l.extras.map((e) => (
                        <View key={e.id} className="flex-row justify-between py-0.5">
                          <Text className="flex-1 text-xs text-ink/75">+ {e.label}</Text>
                          <Text className="text-xs font-bold text-ink/75">+{formatAUD(e.price * l.qty)}</Text>
                        </View>
                      ))}
                      {l.note ? (
                        <Text className="mt-1 text-xs italic text-ink/80">Note: {l.note}</Text>
                      ) : null}
                    </View>
                  ) : null}
                </Card>
              </MotiView>
            );
          })}

          <View className="mb-2 mt-2 flex-row rounded-2xl bg-ink/10 p-1">
            {([{ id: "pickup", label: "Pick-up", Icon: Store }, { id: "delivery", label: "Local Delivery", Icon: Truck }] as const).map(({ id, label, Icon }) => {
              const on = fulfilment === id;
              return (
                <Pressable
                  key={id}
                  onPress={() => { tap(); setFulfilment(id); }}
                  accessibilityRole="button"
                  style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 13, borderRadius: 14, backgroundColor: on ? C.forest : "transparent" }}
                >
                  <Icon color={on ? C.cream : C.ink} size={18} />
                  <Text style={{ marginLeft: 8, fontWeight: "800", color: on ? C.cream : C.ink }}>{label}</Text>
                </Pressable>
              );
            })}
          </View>

          <FieldLabel>Your name</FieldLabel>
          <TextInput value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor={PLACEHOLDER} className={inputClass} />
          <FieldError text={errors.name} />
          <FieldLabel>Phone number</FieldLabel>
          <TextInput value={phone} onChangeText={setPhone} placeholder="04xx xxx xxx" keyboardType="phone-pad" placeholderTextColor={PLACEHOLDER} className={inputClass} />
          <FieldError text={errors.phone} />
          <FieldLabel>Email (optional)</FieldLabel>
          <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={PLACEHOLDER} className={inputClass} />
          <FieldError text={errors.email} />
          {fulfilment === "delivery" ? (
            <>
              <FieldLabel>Delivery address</FieldLabel>
              <TextInput value={address} onChangeText={setAddress} placeholder="Street, suburb, postcode" placeholderTextColor={PLACEHOLDER} className={inputClass} />
              <FieldError text={errors.address} />
            </>
          ) : null}

          {/* Allergy & special request box */}
          <Card style={{ padding: 14, marginTop: 20, borderColor: C.forest, borderWidth: 1.5 }}>
            <View className="flex-row items-center">
              <TriangleAlert color={C.forest} size={20} />
              <Text className="ml-2 flex-1 text-base font-extrabold uppercase text-ink">Allergies & special requests</Text>
            </View>
            <Text className="mt-1.5 text-xs leading-4 text-ink/65">
              Tap any allergy that applies, and tell us anything else (e.g. “no lettuce on the burger”). The kitchen sees this with your order.
            </Text>
            <View className="mt-3 flex-row flex-wrap" style={{ gap: 8 }}>
              {ALLERGENS.map((a) => {
                const on = allergies.includes(a);
                return (
                  <Pressable
                    key={a}
                    onPress={() => { tap(); toggleAllergen(a); }}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on }}
                    style={{ borderRadius: 999, borderWidth: 1.5, borderColor: C.forest, backgroundColor: on ? C.forest : C.white, paddingHorizontal: 14, paddingVertical: 8 }}
                  >
                    <Text style={{ color: on ? C.cream : C.ink, fontWeight: "700", fontSize: 13 }}>{a}</Text>
                  </Pressable>
                );
              })}
            </View>
            <TextInput
              value={notes}
              onChangeText={(t) => setNotes(t.slice(0, 400))}
              placeholder="Other allergies, dietary needs, spice level…"
              multiline
              placeholderTextColor={PLACEHOLDER}
              className={`${inputClass} mt-3 min-h-[90px]`}
              style={{ textAlignVertical: "top" }}
            />
          </Card>

          <Card style={{ padding: 16, marginTop: 16 }}>
            <View className="flex-row justify-between">
              <Text className="text-ink/70">Subtotal (incl. extras)</Text>
              <Text className="font-extrabold text-ink">{formatAUD(subtotal)}</Text>
            </View>
            {unpricedCount > 0 ? (
              <Text className="mt-2 text-xs text-ink/60">
                + {unpricedCount} item{unpricedCount > 1 ? "s" : ""} priced by DK when confirming your order.
              </Text>
            ) : null}
            {fulfilment === "delivery" ? (
              <Text className="mt-2 text-xs text-ink/60">Delivery area and any delivery fee are confirmed by DK by phone.</Text>
            ) : null}
            <View className="mt-3 flex-row justify-between border-t border-ink/10 pt-3">
              <Text className="text-lg font-extrabold uppercase text-ink">Total (AUD)</Text>
              <Text className="text-lg font-extrabold text-ink">{formatAUD(subtotal)}</Text>
            </View>
            <Text className="mt-2 text-xs text-ink/60">Pay at the restaurant when you collect, or on delivery.</Text>
          </Card>

          {sendError ? (
            <View className="mt-4 rounded-2xl border border-[#9B2C2C]/40 bg-[#9B2C2C]/10 p-3">
              <View className="flex-row items-start">
                <TriangleAlert color="#9B2C2C" size={18} />
                <Text className="ml-2 flex-1 text-xs text-ink">
                  Your order was not sent: {sendError} Please try again, send it with your email app, or call us on {BRAND.phone}.
                </Text>
              </View>
              {mail ? (
                <View className="mt-3">
                  <Button label="Send with my email app" variant="outlineOnLight" icon={(c) => <Mail color={c} size={18} />} onPress={() => openMailFallback(mail.subject, mail.fields)} />
                </View>
              ) : null}
            </View>
          ) : null}

          <View className="mt-5">
            <Button label="Submit Order" onPress={submit} loading={sending} />
          </View>
        </View>
      )}

      <SuccessOverlay
        visible={!!done}
        title="Order Successfully Processed!"
        message={`Thank you, ${name.trim() || "friend"}! Your ${fulfilment === "pickup" ? "pick-up" : "delivery"} order has been sent to the DK Dream Kitchen team.`}
        reference={done?.ref}
        note="Keep your reference number handy. The team will contact you on the phone number you provided."
        buttonLabel="Back to Home"
        onClose={closeSuccess}
      />
    </Screen>
  );
}
