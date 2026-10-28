import { useLocalSearchParams } from "expo-router";
import { Phase, useSiri } from "expo-siri-island";
import { useEffect } from "react";

const PHASES = new Set<string>(Object.values(Phase));

function isPhase(value: string | undefined): value is Phase {
  return value !== undefined && PHASES.has(value);
}

const useSiriDeepLink = () => {
  const { play, setPhase } = useSiri();
  const params = useLocalSearchParams<{
    phase?: string;
    play?: string;
    t?: string;
  }>();

  useEffect(() => {
    if (params.play) {
      play();
    } else if (isPhase(params.phase)) {
      setPhase(params.phase);
    }
  }, [params.phase, params.play, params.t, play, setPhase]);
};

export { useSiriDeepLink };
