import { Phase } from "../enums";
import type { TSiriPhaseDurations, TSiriPhaseLabels } from "../interfaces";

const DEFAULT_PHASE_DURATIONS: Readonly<TSiriPhaseDurations> = {
  [Phase.Listening]: 4200,
  [Phase.Thinking]: 2400,
  [Phase.Searching]: 2600,
  [Phase.Reasoning]: 3200,
  [Phase.Answer]: 5500,
};

const DEFAULT_PHASE_LABELS: Readonly<TSiriPhaseLabels> = {
  [Phase.Searching]: "Searching",
  [Phase.Reasoning]: "Looking into it",
};

const NEXT_PHASE: Readonly<Partial<Record<Phase, Phase>>> = {
  [Phase.Listening]: Phase.Thinking,
  [Phase.Thinking]: Phase.Searching,
  [Phase.Searching]: Phase.Reasoning,
  [Phase.Reasoning]: Phase.Answer,
  [Phase.Answer]: Phase.Idle,
};

const SHIMMER_PHASES: readonly Phase[] = [Phase.Searching, Phase.Reasoning];

export {
  DEFAULT_PHASE_DURATIONS,
  DEFAULT_PHASE_LABELS,
  NEXT_PHASE,
  SHIMMER_PHASES,
};
