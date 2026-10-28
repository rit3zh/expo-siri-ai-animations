import type { ComponentType } from "react";

const registerComponent = <T extends ComponentType<any>>(
  name: string,
  component: T,
): T => {
  component.displayName = name;
  return component;
};

export { registerComponent };
