import { requireOptionalNativeModule } from "expo";

import { NativeView } from "../constants/native-view.constant";
import type { INativeSiriIslandModule } from "../interfaces/native-module.interface";

const NativeSiriIslandModule =
  requireOptionalNativeModule<INativeSiriIslandModule>(NativeView.Module);

export { NativeSiriIslandModule };
