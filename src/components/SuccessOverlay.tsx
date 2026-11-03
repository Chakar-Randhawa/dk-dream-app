import React, { useEffect } from "react";
import { Modal, ScrollView, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { CheckCircle2 } from "lucide-react-native";
import { useLayout } from "../hooks/useLayout";
import { Button, C, Logo } from "./ui";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  reference?: string;
  note?: string;
  buttonLabel?: string;
  onClose: () => void;
};

export function SuccessOverlay({
  visible,
  title,
  message,
  reference,
  note,
  buttonLabel = "Done",
  onClose,
}: Props) {
  const { insets } = useLayout();
  const scale = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      scale.value = 0;
      scale.value = withDelay(150, withSpring(1, { damping: 8, stiffness: 120 }));
      pulse.value = withRepeat(
        withSequence(withTiming(1.1, { duration: 900 }), withTiming(1, { duration: 900 })),
        -1,
        false
      );
    }
  }, [visible, scale, pulse]);

  const badge = useAnimatedStyle(() => ({ transform: [{ scale: scale.value * pulse.value }] }));

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent navigationBarTranslucent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: C.forest }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 28,
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
          }}
        >
          <Animated.View entering={FadeIn.duration(300)} style={{ width: "100%", maxWidth: 480, alignItems: "center" }}>
            <Animated.View entering={FadeInDown.delay(80).springify()}>
              <Logo size={68} />
            </Animated.View>
            <Animated.View style={[{ marginTop: 26 }, badge]}>
              <CheckCircle2 color={C.cream} size={92} strokeWidth={1.6} />
            </Animated.View>
            <Animated.Text
              entering={FadeInDown.delay(300).springify()}
              style={{ color: "white", fontSize: 27, fontWeight: "800", textAlign: "center", marginTop: 22, textTransform: "uppercase" }}
            >
              {title}
            </Animated.Text>
            <Animated.Text
              entering={FadeInDown.delay(420).springify()}
              style={{ color: C.onForestSoft, fontSize: 15.5, textAlign: "center", marginTop: 10, lineHeight: 23 }}
            >
              {message}
            </Animated.Text>
            {reference ? (
              <Animated.View
                entering={FadeInDown.delay(520).springify()}
                style={{ marginTop: 22, borderRadius: 18, borderWidth: 1, borderColor: C.onForestLine, backgroundColor: "rgba(241,233,212,0.08)", paddingHorizontal: 22, paddingVertical: 14 }}
              >
                <Text style={{ color: C.onForestSoft, fontSize: 11, letterSpacing: 2.5, textAlign: "center", textTransform: "uppercase" }}>
                  Reference number
                </Text>
                <Text selectable style={{ color: "white", fontSize: 21, fontWeight: "800", textAlign: "center", marginTop: 4 }}>
                  {reference}
                </Text>
              </Animated.View>
            ) : null}
            {note ? (
              <Animated.Text
                entering={FadeInDown.delay(600).springify()}
                style={{ color: C.onForestSoft, fontSize: 12.5, textAlign: "center", marginTop: 14, lineHeight: 19 }}
              >
                {note}
              </Animated.Text>
            ) : null}
            <Animated.View entering={FadeInDown.delay(700).springify()} style={{ marginTop: 28, alignSelf: "stretch" }}>
              <Button label={buttonLabel} variant="cream" onPress={onClose} />
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </View>
    </Modal>
  );
}
