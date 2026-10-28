import * as React from "react";
import { useCallback, useId, useMemo, useState, type FC } from "react";
import { PortalProvider } from "react-native-teleport";

import { DEFAULT_PHASE_LABELS, EXPANDED_ISLAND } from "../constants";
import { SiriContext } from "../context";
import { Phase } from "../enums";
import {
  useControllableState,
  useSiriController,
  useSiriMotion,
  useSiriTimeline,
} from "../hooks";
import type {
  ISiriContext,
  TSiriPhaseValue,
  TSiriRootProps,
} from "../interfaces";
import { registerComponent } from "../utils";

const Root: FC<TSiriRootProps> = ({
  children,
  phase: phaseProp,
  defaultPhase = Phase.Idle,
  onPhaseChange,
  labels,
  durations,
}: TSiriRootProps): React.ReactElement => {
  const [phase, setPhaseState] = useControllableState<Phase>({
    prop: phaseProp as Phase | undefined,
    defaultProp: defaultPhase as Phase,
    onChange: onPhaseChange,
  });
  const [playing, setPlaying] = useState<boolean>(false);
  const [contentHeights, setContentHeights] = useState<number[]>([]);
  const hostName = `siri-${useId()}`;
  const controller = useSiriController();
  const hasContent = contentHeights.length > 0;
  const contentHeight = hasContent
    ? Math.max(...contentHeights)
    : EXPANDED_ISLAND.height;

  useSiriMotion(phase, controller, contentHeight);

  const advance = useCallback(
    (next: Phase) => {
      setPhaseState(next);
      if (next === Phase.Idle) setPlaying(false);
    },
    [setPhaseState],
  );

  useSiriTimeline(phase, playing, durations, advance);

  const play = useCallback(() => {
    setPlaying(true);
    setPhaseState(Phase.Listening);
  }, [setPhaseState]);

  const stop = useCallback(() => {
    setPlaying(false);
    setPhaseState(Phase.Idle);
  }, [setPhaseState]);

  const setPhase = useCallback(
    (next: TSiriPhaseValue) => {
      setPlaying(false);
      setPhaseState(next as Phase);
    },
    [setPhaseState],
  );

  const pressIsland = useCallback(() => {
    if (phase === Phase.Idle) {
      play();
    } else if (phase === Phase.Listening) {
      setPhaseState(Phase.Thinking);
    } else {
      stop();
    }
  }, [phase, play, stop, setPhaseState]);

  const registerContent = useCallback((height: number) => {
    setContentHeights((heights) => [...heights, height]);
    return () =>
      setContentHeights((heights) => {
        const index = heights.indexOf(height);
        return index === -1 ? heights : heights.filter((_, i) => i !== index);
      });
  }, []);

  const resolvedLabels = useMemo(
    () => ({ ...DEFAULT_PHASE_LABELS, ...labels }),
    [labels],
  );

  const context = useMemo<ISiriContext>(
    () => ({
      phase,
      playing,
      labels: resolvedLabels,
      controller,
      hostName,
      hasContent,
      contentHeight,
      play,
      stop,
      setPhase,
      pressIsland,
      registerContent,
    }),
    [
      phase,
      playing,
      resolvedLabels,
      controller,
      hostName,
      hasContent,
      contentHeight,
      play,
      stop,
      setPhase,
      pressIsland,
      registerContent,
    ],
  );

  return (
    <PortalProvider>
      <SiriContext value={context}>{children}</SiriContext>
    </PortalProvider>
  );
};

const SiriRoot = registerComponent("Siri.Root", Root);

export { SiriRoot };
