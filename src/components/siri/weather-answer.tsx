import { HARDWARE_ISLAND, Phase, Siri, useSiri } from "expo-siri-island";
import { SymbolView, type SFSymbol } from "expo-symbols";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const TOP = HARDWARE_ISLAND.height + 4;
const BOTTOM = 20;
const GAP = 16;
const SENTENCE_LINE = 24;
const FORECAST_HEIGHT = 58;
const HEIGHT = TOP + SENTENCE_LINE * 2 + GAP + FORECAST_HEIGHT + BOTTOM;
const EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1);

const FORECAST: { time: string; symbol: SFSymbol; temperature: string }[] = [
  { time: "Now", symbol: "sun.max.fill", temperature: "21°" },
  { time: "2PM", symbol: "sun.max.fill", temperature: "23°" },
  { time: "4PM", symbol: "cloud.sun.fill", temperature: "22°" },
  { time: "6PM", symbol: "cloud.fill", temperature: "19°" },
  { time: "8PM", symbol: "moon.stars.fill", temperature: "16°" },
];

function WeatherAnswer() {
  const { phase } = useSiri();
  const revealed = phase === Phase.Answer;

  const sentenceStyle = useReveal(revealed, 80);
  const forecastStyle = useReveal(revealed, 180);

  return (
    <Siri.Content height={HEIGHT}>
      <View style={styles.content}>
        <Animated.Text
          style={[styles.sentence, sentenceStyle]}
          numberOfLines={2}
        >
          It’s 21° and mostly sunny in San Francisco.
        </Animated.Text>

        <Animated.View style={[styles.forecast, forecastStyle]}>
          {FORECAST.map(({ time, symbol, temperature }) => (
            <View key={time} style={styles.hour}>
              <Text style={styles.time}>{time}</Text>
              <SymbolView
                name={symbol}
                size={20}
                type="multicolor"
                style={styles.symbol}
              />
              <Text style={styles.temperature}>{temperature}</Text>
            </View>
          ))}
        </Animated.View>
      </View>
    </Siri.Content>
  );
}

function useReveal(revealed: boolean, delay: number) {
  const progress = useSharedValue<number>(0);
  useEffect(() => {
    progress.set(
      revealed
        ? withDelay(delay, withTiming(1, { duration: 520, easing: EASE_OUT }))
        : 0,
    );
  }, [revealed, delay, progress]);
  return useAnimatedStyle(() => ({
    opacity: progress.get(),
    transform: [{ translateY: (1 - progress.get()) * 6 }],
  }));
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: TOP,
    paddingBottom: BOTTOM,
    gap: GAP,
  },
  sentence: {
    fontFamily: "ui-rounded",
    fontSize: 19,
    fontWeight: "500",
    lineHeight: SENTENCE_LINE,
    color: "white",
  },
  forecast: {
    height: FORECAST_HEIGHT,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  hour: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  time: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255,255,255,0.6)",
  },
  symbol: {
    width: 22,
    height: 22,
  },
  temperature: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
  },
});

export { WeatherAnswer };
