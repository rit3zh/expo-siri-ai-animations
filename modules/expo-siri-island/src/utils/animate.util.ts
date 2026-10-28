import {
  Easing,
  withDelay,
  withSpring,
  withTiming,
  type SharedValue,
  type WithSpringConfig,
} from "react-native-reanimated";

function fadeTo<T extends SharedValue<number>>(
  value: T,
  to: number,
  duration: number,
  delay: number = 0,
): void {
  const animation = withTiming(to, {
    duration,
    easing: Easing.out(Easing.cubic),
  });
  value.set(delay > 0 ? withDelay(delay, animation) : animation);
}

function springTo<T extends SharedValue<number>>(
  value: T,
  to: number,
  config: WithSpringConfig,
  delay: number = 0,
): void {
  const animation = withSpring(to, config);
  value.set(delay > 0 ? withDelay(delay, animation) : animation);
}

export { fadeTo, springTo };
