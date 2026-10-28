import type { ReactNode, Ref } from "react";

interface ISlot {
  children?: ReactNode;
  ref?: Ref<unknown>;
  [prop: string]: unknown;
}

type TSlotComponentProps = ISlot;

export type { ISlot, TSlotComponentProps };
