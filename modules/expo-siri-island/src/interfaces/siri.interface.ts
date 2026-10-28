import type { ComponentProps, PropsWithChildren, ReactNode } from "react";
import type { ColorValue, Pressable, StyleProp, ViewStyle } from "react-native";

import type { Phase } from "../enums";
import type { ISiriIslandController } from "./native-module.interface";

type TSiriPhaseValue = Phase | `${Phase}`;

type TSiriPhaseLabels = Partial<Record<`${Phase}`, string>>;

type TSiriPhaseDurations = Partial<Record<`${Phase}`, number>>;

interface ISiriRoot {
  children: ReactNode;
  phase?: TSiriPhaseValue;
  defaultPhase?: TSiriPhaseValue;
  onPhaseChange?: (phase: Phase) => void;
  labels?: TSiriPhaseLabels;
  durations?: TSiriPhaseDurations;
}

interface ISiriTrigger extends ComponentProps<typeof Pressable> {
  asChild?: boolean;
  phase?: TSiriPhaseValue;
}

interface ISiriPressEvent {
  readonly phase: Phase;
  readonly defaultPrevented: boolean;
  preventDefault: () => void;
}

interface ISiriPortal {
  children?: ReactNode;
  label?: string;
  shimmer?: boolean;
  hidesStatusBar?: boolean;
  glassEffect?: boolean;
  gradientEffect?: boolean;
  gradientStart?: number;
  gradientEnd?: number;
  gradientOpacity?: number;
  gradientColor?: ColorValue;
  onPress?: (event: ISiriPressEvent) => void;
}

interface ISiriContent {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  height?: number;
}

interface ISiriState {
  phase: Phase;
  playing: boolean;
  play: () => void;
  stop: () => void;
  setPhase: (phase: TSiriPhaseValue) => void;
}

interface ISiriContext extends ISiriState {
  labels: TSiriPhaseLabels;
  controller: ISiriIslandController | null;
  hostName: string;
  hasContent: boolean;
  contentHeight: number;
  pressIsland: () => void;
  registerContent: (height: number) => () => void;
}

type TSiriRootProps = PropsWithChildren<Partial<ISiriRoot>>;

type TSiriTriggerProps = Partial<ISiriTrigger>;

type TSiriPortalProps = PropsWithChildren<Partial<ISiriPortal>>;

type TSiriContentProps = PropsWithChildren<Partial<ISiriContent>>;

export type {
  ISiriContent,
  ISiriContext,
  ISiriPortal,
  ISiriPressEvent,
  ISiriRoot,
  ISiriState,
  ISiriTrigger,
  TSiriContentProps,
  TSiriPhaseDurations,
  TSiriPhaseLabels,
  TSiriPhaseValue,
  TSiriPortalProps,
  TSiriRootProps,
  TSiriTriggerProps,
};
