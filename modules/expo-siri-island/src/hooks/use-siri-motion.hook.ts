import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import {
  cancelAnimation,
  Easing,
  useAnimatedReaction,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  type WithSpringConfig,
} from "react-native-reanimated";

import { ISLAND_SHAPE, ISLAND_SPRING } from "../constants";
import { Phase } from "../enums";
import type { IIslandShape, ISiriIslandController } from "../interfaces";
import { expandedShape, fadeTo, springTo } from "../utils";

function useSiriMotion(
  phase: Phase,
  controller: ISiriIslandController | null,
  answerHeight: number,
): void {
  const { width: screenWidth } = useWindowDimensions();
  const contentHeight = phase === Phase.Answer ? answerHeight : null;

  const width = useSharedValue<number>(ISLAND_SHAPE.idle.width);
  const height = useSharedValue<number>(ISLAND_SHAPE.idle.height);
  const offsetY = useSharedValue<number>(ISLAND_SHAPE.idle.offsetY);
  const orb = useSharedValue<number>(0);
  const glass = useSharedValue<number>(0);
  const wave = useSharedValue<number>(0);
  const spinner = useSharedValue<number>(0);
  const glow = useSharedValue<number>(0);
  const content = useSharedValue<number>(0);
  const breath = useSharedValue<number>(0);

  useEffect(() => {
    const morph = (
      shape: IIslandShape,
      config: WithSpringConfig,
      delay: number = 0,
    ) => {
      springTo(width, shape.width, config, delay);
      springTo(height, shape.height, config, delay);
      springTo(offsetY, shape.offsetY, config, delay);
    };

    const stopBreathing = () => {
      cancelAnimation(breath);
      fadeTo(breath, 0, 200);
    };

    switch (phase) {
      case Phase.Listening:
        morph(ISLAND_SHAPE.orb, ISLAND_SPRING.pop);
        springTo(orb, 1, ISLAND_SPRING.orb);
        fadeTo(glass, 1, 600, 180);
        fadeTo(wave, 1, 750, 250);
        fadeTo(spinner, 0, 150);
        fadeTo(glow, 0, 150);
        fadeTo(content, 0, 120);
        breath.set(
          withDelay(
            500,
            withRepeat(
              withTiming(1, {
                duration: 1200,
                easing: Easing.inOut(Easing.sin),
              }),
              -1,
              true,
            ),
          ),
        );
        break;

      case Phase.Thinking:
        fadeTo(glass, 1, 300);
        fadeTo(wave, 0, 140);
        stopBreathing();
        morph(ISLAND_SHAPE.compact, ISLAND_SPRING.settle, 60);
        springTo(orb, 0, ISLAND_SPRING.settle, 60);
        springTo(spinner, 1, ISLAND_SPRING.dots, 260);
        fadeTo(glow, 0.45, 700, 300);
        fadeTo(content, 0, 150);
        break;

      case Phase.Searching:
      case Phase.Reasoning:
        stopBreathing();
        morph(expandedShape(screenWidth), ISLAND_SPRING.stretch);
        springTo(orb, 0, ISLAND_SPRING.settle);
        fadeTo(wave, 0, 140);
        fadeTo(glass, 1, 400);
        springTo(spinner, 1, ISLAND_SPRING.dots);
        fadeTo(content, 1, 380, phase === Phase.Searching ? 220 : 0);
        fadeTo(glow, 0.5, 500);
        break;

      case Phase.Answer:
        stopBreathing();
        morph(
          expandedShape(screenWidth, contentHeight ?? undefined),
          ISLAND_SPRING.grow,
        );
        springTo(orb, 0, ISLAND_SPRING.settle);
        fadeTo(wave, 0, 140);
        fadeTo(glass, 1, 400);
        fadeTo(spinner, 0, 320);
        fadeTo(content, 1, 300);
        fadeTo(glow, 1, 1000, 200);
        break;

      case Phase.Idle:
      default:
        stopBreathing();
        fadeTo(content, 0, 140);
        fadeTo(spinner, 0, 200);
        fadeTo(wave, 0, 160);
        fadeTo(glow, 0, 300);
        fadeTo(glass, 0, 380, 60);
        springTo(orb, 0, ISLAND_SPRING.settle);
        morph(ISLAND_SHAPE.idle, ISLAND_SPRING.dismiss);
        break;
    }
  }, [
    phase,
    screenWidth,
    contentHeight,
    width,
    height,
    offsetY,
    orb,
    glass,
    wave,
    spinner,
    glow,
    content,
    breath,
  ]);

  useAnimatedReaction(
    () => {
      const breathe = 1 + 0.012 * breath.get() * orb.get();
      return [
        width.get() * breathe,
        height.get() * breathe,
        offsetY.get(),
        orb.get(),
        glass.get(),
        wave.get(),
        spinner.get(),
        glow.get(),
        content.get(),
      ];
    },
    (values) => {
      controller?.update(values);
    },
  );
}

export { useSiriMotion };
