import * as React from "react";
import { useMemo, type FC, type ReactNode } from "react";
import { Pressable, type GestureResponderEvent } from "react-native";

import { useSiriContext } from "../hooks";
import type { TSiriTriggerProps } from "../interfaces";
import { composeEventHandlers, registerComponent } from "../utils";
import { Slot } from "./slot";

const Trigger: FC<TSiriTriggerProps> = ({
  asChild = false,
  phase: targetPhase,
  onPress,
  accessibilityState,
  children,
  ...pressableProps
}: TSiriTriggerProps): React.ReactElement | null => {
  const { phase, play, setPhase } = useSiriContext("Siri.Trigger");

  const handlePress = useMemo(
    () =>
      composeEventHandlers<GestureResponderEvent>(onPress, () => {
        if (targetPhase === undefined) {
          play();
        } else {
          setPhase(targetPhase);
        }
      }),
    [onPress, targetPhase, play, setPhase],
  );

  const triggerProps = {
    ...pressableProps,
    accessibilityRole: "button" as const,
    accessibilityState:
      targetPhase === undefined
        ? accessibilityState
        : { ...accessibilityState, selected: targetPhase === phase },
    onPress: handlePress,
  };

  if (asChild) {
    return <Slot {...triggerProps}>{children as ReactNode}</Slot>;
  }

  return <Pressable {...triggerProps}>{children}</Pressable>;
};

const SiriTrigger = registerComponent("Siri.Trigger", Trigger);

export { SiriTrigger };
