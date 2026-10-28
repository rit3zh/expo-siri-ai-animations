import { useReleasingSharedObject } from "expo";

import type { ISiriIslandController } from "../interfaces";
import { NativeSiriIslandModule } from "../native-module";
import { installSiriIslandWorklets } from "../utils";

if (NativeSiriIslandModule) {
  installSiriIslandWorklets();
}

function createController(): ISiriIslandController {
  return (
    NativeSiriIslandModule
      ? new NativeSiriIslandModule.SiriIslandController()
      : null
  ) as ISiriIslandController;
}

function useSiriController(): ISiriIslandController | null {
  return useReleasingSharedObject(
    createController,
    [],
  ) as ISiriIslandController | null;
}

export { useSiriController };
