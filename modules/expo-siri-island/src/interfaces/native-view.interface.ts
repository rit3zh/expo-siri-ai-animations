import type { ReactNode } from "react";
import type { ColorValue, StyleProp, ViewStyle } from "react-native";

import type { Phase } from "../enums";
import type { ISiriIslandController } from "./native-module.interface";

interface IIslandPressNativeEvent {
  nativeEvent: Record<string, never>;
}

interface INativeSiriIslandView {
  children?: ReactNode;
  controller?: ISiriIslandController | null;
  phase?: Phase;
  label?: string;
  shimmer?: boolean;
  hidesStatusBar?: boolean;
  hasContent?: boolean;
  glassEffect?: boolean;
  gradientEffect?: boolean;
  gradientStart?: number;
  gradientEnd?: number;
  gradientOpacity?: number;
  gradientColor?: ColorValue;
  onIslandPress?: (event: IIslandPressNativeEvent) => void;
  style?: StyleProp<ViewStyle>;
}

interface INativeSiriIslandContentView {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export type {
  IIslandPressNativeEvent,
  INativeSiriIslandContentView,
  INativeSiriIslandView,
};
