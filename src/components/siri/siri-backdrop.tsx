import { BlurView, type BlurTint } from "expo-backdrop";
import { Phase, useSiri } from "expo-siri-island";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const FADE_IN = { duration: 520, easing: Easing.bezier(0.22, 1, 0.36, 1) };
const FADE_OUT = { duration: 360, easing: Easing.bezier(0.4, 0, 0.2, 1) };

interface ISiriBackdrop {
  intensity?: number;
  tint?: BlurTint;
}

function SiriBackdrop({
  intensity = 30,
  tint = "systemChromeMaterialDark",
}: ISiriBackdrop) {
  const { phase, stop } = useSiri();
  const visible = phase === Phase.Answer;
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue<number>(0);

  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (visible) {
      progress.set(withTiming(1, FADE_IN));
      return;
    }
    progress.set(
      withTiming(0, FADE_OUT, (done) => {
        if (done) scheduleOnRN(setMounted, false);
      }),
    );
  }, [visible, progress]);

  const style = useAnimatedStyle(() => ({ opacity: progress.get() }));

  if (!mounted) return null;

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[StyleSheet.absoluteFill, style]}
    >
      <Pressable
        accessibilityLabel="Dismiss Siri"
        onPress={stop}
        style={StyleSheet.absoluteFill}
      >
        <BlurView
          intensity={intensity}
          tint={tint}
          style={StyleSheet.absoluteFill}
        />
      </Pressable>
    </Animated.View>
  );
}

export { SiriBackdrop };
