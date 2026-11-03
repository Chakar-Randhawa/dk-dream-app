import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { MenuItem } from "../data/menu";
import type { Extra } from "../data/extras";

export type Fulfilment = "pickup" | "delivery";

export type CartLine = {
  lineId: string;
  itemId: string;
  name: string;
  /** Selected variant / choice text, e.g. "Green · Chicken / Beef" */
  detail: string;
  /** undefined = the menu lists no price for this dish; staff confirm it */
  basePrice?: number;
  extras: Extra[];
  /** Customer's note for this dish, e.g. "no lettuce" */
  note: string;
  image: string;
  qty: number;
};

/** Total of the paid add-ons for ONE unit of the dish. */
export const extrasSum = (l: CartLine) => l.extras.reduce((s, e) => s + e.price, 0);
/** Price of ONE unit including add-ons (base price counted only when the menu lists it). */
export const lineUnit = (l: CartLine) => (l.basePrice ?? 0) + extrasSum(l);

type AddOpts = { detail?: string; basePrice?: number; extras?: Extra[]; note?: string; qty?: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  unpricedCount: number;
  fulfilment: Fulfilment;
  setFulfilment: (f: Fulfilment) => void;
  addLine: (item: MenuItem, opts?: AddOpts) => void;
  increment: (lineId: string) => void;
  decrement: (lineId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [fulfilment, setFulfilment] = useState<Fulfilment>("pickup");

  const addLine = useCallback<CartContextValue["addLine"]>((item, opts) => {
    const detail = opts?.detail ?? "";
    const extras = [...(opts?.extras ?? [])].sort((a, b) => a.id.localeCompare(b.id));
    const note = (opts?.note ?? "").trim();
    const qty = Math.max(1, opts?.qty ?? 1);
    const basePrice = opts?.basePrice ?? item.price;
    // Same dish + same options + same extras + same note = one line; anything different = its own line.
    const lineId = [item.id, detail, extras.map((e) => e.id).join("+"), note.toLowerCase()].join("|");
    setLines((prev) => {
      const existing = prev.find((l) => l.lineId === lineId);
      if (existing) {
        return prev.map((l) => (l.lineId === lineId ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { lineId, itemId: item.id, name: item.name, detail, basePrice, extras, note, image: item.image, qty }];
    });
  }, []);

  const increment = useCallback((lineId: string) => {
    setLines((prev) => prev.map((l) => (l.lineId === lineId ? { ...l, qty: l.qty + 1 } : l)));
  }, []);

  const decrement = useCallback((lineId: string) => {
    setLines((prev) =>
      prev.map((l) => (l.lineId === lineId ? { ...l, qty: l.qty - 1 } : l)).filter((l) => l.qty > 0)
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((sum, l) => sum + lineUnit(l) * l.qty, 0);
    const unpricedCount = lines.filter((l) => l.basePrice === undefined).reduce((n, l) => n + l.qty, 0);
    return { lines, count, subtotal, unpricedCount, fulfilment, setFulfilment, addLine, increment, decrement, clear };
  }, [lines, fulfilment, addLine, increment, decrement, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
