import type { ISiriState } from "../interfaces";
import { useSiriContext } from "./use-siri-context.hook";

function useSiri(): ISiriState {
  const { phase, playing, play, stop, setPhase } =
    useSiriContext<string>("useSiri");
  return { phase, playing, play, stop, setPhase };
}

export { useSiri };
