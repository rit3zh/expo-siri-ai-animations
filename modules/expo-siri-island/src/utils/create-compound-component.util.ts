import type { ComponentType } from "react";

import { registerComponent } from "./register-component.util";

const createCompoundComponent = <
  T extends ComponentType<any>,
  TCompound extends Record<string, unknown> = Record<never, never>,
>(
  name: string,
  component: T,
  compound: TCompound = {} as TCompound,
): T & TCompound =>
  Object.assign<T, TCompound>(registerComponent(name, component), compound);

export { createCompoundComponent };
