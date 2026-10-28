import { requireNativeView } from "expo";
import type { ComponentType } from "react";
import { Platform } from "react-native";

import { NativeView } from "../constants";
import type {
  INativeSiriIslandContentView,
  INativeSiriIslandView,
} from "../interfaces";
import { NativeSiriIslandModule } from "../native-module";

const isSupported = Platform.OS === "ios" && NativeSiriIslandModule !== null;

const NativeSiriIslandView: ComponentType<INativeSiriIslandView> | null =
  isSupported
    ? requireNativeView<INativeSiriIslandView>(NativeView.Module, NativeView.Root)
    : null;

const NativeSiriIslandContentView: ComponentType<INativeSiriIslandContentView> | null =
  isSupported
    ? requireNativeView<INativeSiriIslandContentView>(
        NativeView.Module,
        NativeView.Content,
      )
    : null;

export { isSupported, NativeSiriIslandContentView, NativeSiriIslandView };
