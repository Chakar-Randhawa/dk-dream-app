import React, { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { X } from "lucide-react-native";
import { BRAND } from "../../data/brand";
import { MENU } from "../../data/menu";
import { useLayout } from "../../hooks/useLayout";
import { PageHeader } from "../../components/Screen";
import { C, SafeImage, tap } from "../../components/ui";

type Photo = { id: string; uri: string; caption: string; contain?: boolean };

const PHOTOS: Photo[] = [
  { id: "hero", uri: BRAND.heroFirst, caption: "DK Dream Kitchen", contain: true },
  ...MENU.map((m) => ({ id: m.id, uri: m.image, caption: m.name })),
];

export default function GalleryScreen() {
  const { insets, wideWidth, columns, fabSpace, gutter } = useLayout();
  const [open, setOpen] = useState<Photo | null>(null);
  const cols = columns;
  const gap = 8;
  const inner = wideWidth - gutter * 2;
  const size = Math.floor((inner - gap * (cols - 1)) / cols);

  return (
    <View style={{ flex: 1, backgroundColor: C.paper }}>
      <PageHeader title="Gallery" subtitle="A taste of what we serve" />
      <FlatList
        key={cols}
        data={PHOTOS}
        numColumns={cols}
        keyExtractor={(p) => p.id}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{
          alignSelf: "center",
          gap,
          paddingTop: 14,
          paddingLeft: insets.left + gutter,
          paddingRight: insets.right + gutter,
          paddingBottom: fabSpace + 24,
        }}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => {
              tap();
              setOpen(item);
            }}
            accessibilityRole="imagebutton"
            accessibilityLabel={item.caption}
            style={{ width: size, height: index % 5 === 0 ? size * 1.25 : size, borderRadius: 18, overflow: "hidden", backgroundColor: C.forest }}
          >
            <SafeImage uri={item.uri} style={StyleSheet.absoluteFill} />
          </Pressable>
        )}
      />
      <Modal visible={!!open} transparent animationType="fade" statusBarTranslucent navigationBarTranslucent onRequestClose={() => setOpen(null)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(14,32,9,0.96)", justifyContent: "center", padding: 16 }} onPress={() => setOpen(null)}>
          {open ? (
            <View style={{ width: "100%", maxWidth: 900, alignSelf: "center" }}>
              <SafeImage uri={open.uri} contentFit="contain" style={{ width: "100%", height: "78%", minHeight: 260, borderRadius: 18 }} />
              <Text style={{ color: C.cream, textAlign: "center", marginTop: 14, fontSize: 16, fontWeight: "700" }}>{open.caption}</Text>
            </View>
          ) : null}
          <Pressable
            onPress={() => setOpen(null)}
            accessibilityRole="button"
            accessibilityLabel="Close photo"
            style={{ position: "absolute", top: insets.top + 12, right: insets.right + 16, width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(241,233,212,0.18)", alignItems: "center", justifyContent: "center" }}
          >
            <X color={C.cream} size={22} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
