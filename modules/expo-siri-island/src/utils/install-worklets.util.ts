import { installOnUIRuntime } from "expo";
import {
  getUIRuntimeHolder,
  registerCustomSerializable,
} from "react-native-worklets";

import type {
  IPackedSiriIslandController,
  ISiriIslandController,
} from "../interfaces";

let installed = false;

function installSiriIslandWorklets(): void {
  if (installed) return;
  installed = true;

  installOnUIRuntime(getUIRuntimeHolder());

  registerCustomSerializable<ISiriIslandController, IPackedSiriIslandController>({
    name: "ExpoSiriIslandController",
    determine: (value): value is ISiriIslandController => {
      "worklet";
      const candidate = value as Partial<Record<string, unknown>>;
      return (
        candidate.__siri_island_controller__ === true &&
        typeof candidate.__expo_shared_object_id__ === "number"
      );
    },
    pack: (value) => {
      "worklet";
      return {
        objectId: (value as unknown as { __expo_shared_object_id__: number })
          .__expo_shared_object_id__,
      };
    },
    unpack: (packed) => {
      "worklet";
      return (globalThis as any).expo.SharedObject.__resolveInWorklet(
        packed.objectId,
      );
    },
  });
}

export { installSiriIslandWorklets };
