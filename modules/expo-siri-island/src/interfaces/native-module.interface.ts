import { NativeModule, SharedObject } from "expo";

import type { IIslandSize } from "./island-shape.interface";

declare class ISiriIslandController extends SharedObject {
  readonly __siri_island_controller__: true;
  update(values: number[]): void;
}

declare class INativeSiriIslandModule extends NativeModule {
  readonly hardwareIslandSize: IIslandSize;
  SiriIslandController: typeof ISiriIslandController;
}

interface IPackedSiriIslandController {
  objectId: number;
}

export type {
  INativeSiriIslandModule,
  IPackedSiriIslandController,
  ISiriIslandController,
};
