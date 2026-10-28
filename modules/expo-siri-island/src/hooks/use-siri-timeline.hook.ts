import { useEffect } from "react";

import { DEFAULT_PHASE_DURATIONS, NEXT_PHASE } from "../constants";
import type { Phase } from "../enums";
import type { TSiriPhaseDurations } from "../interfaces";

function useSiriTimeline(
  phase: Phase,
  playing: boolean,
  durations: TSiriPhaseDurations | undefined,
  advance: (next: Phase) => void,
): void {
  const next = NEXT_PHASE[phase];
  const delay = durations?.[phase] ?? DEFAULT_PHASE_DURATIONS[phase];

  useEffect(() => {
    if (!playing || !next || delay === undefined) return;

    const timer = setTimeout(() => advance(next), delay);
    return () => clearTimeout(timer);
  }, [playing, next, delay, advance]);
}

export { useSiriTimeline };
