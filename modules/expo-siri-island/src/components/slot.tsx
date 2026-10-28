import * as React from "react";
import { cloneElement, isValidElement, type FC, type Ref } from "react";

import type { TSlotComponentProps } from "../interfaces";
import {
  composeRefs,
  mergeSlotProps,
  registerComponent,
  type TSlotProps,
} from "../utils";

const SlotElement: FC<TSlotComponentProps> = ({
  children,
  ref,
  ...slotProps
}: TSlotComponentProps): React.ReactElement | null => {
  if (!isValidElement<TSlotProps>(children)) return null;

  const childProps = children.props as TSlotProps & { ref?: Ref<unknown> };

  return cloneElement(children, {
    ...mergeSlotProps(slotProps, childProps),
    ref: ref ? composeRefs(ref, childProps.ref) : childProps.ref,
  });
};

const Slot = registerComponent("Slot", SlotElement);

export { Slot };
