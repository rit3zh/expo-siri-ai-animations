import type { IIslandShape, IIslandSize } from "../interfaces";
import { NativeSiriIslandModule } from "../native-module";

const HARDWARE_ISLAND: Readonly<IIslandSize> =
  NativeSiriIslandModule?.hardwareIslandSize ?? { width: 125.33, height: 36.67 };

const ISLAND_SHAPE = {
  idle: { ...HARDWARE_ISLAND, offsetY: 0 },
  orb: { width: 172, height: 128, offsetY: -10 },
  compact: { width: 250, height: 60, offsetY: 0 },
} as const satisfies Record<string, IIslandShape>;

const EXPANDED_ISLAND = {
  margin: 18,
  height: 92,
  offsetY: 0,
  cardInset: 22,
} as const;

const CONTENT_INSET_RATIO = 0.44;

export { CONTENT_INSET_RATIO, EXPANDED_ISLAND, HARDWARE_ISLAND, ISLAND_SHAPE };
