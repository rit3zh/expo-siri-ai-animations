import type { Phase } from "../enums";
import type { ISiriPressEvent } from "../interfaces";

function createPressEvent(phase: Phase): ISiriPressEvent {
  let defaultPrevented = false;

  return {
    phase,
    get defaultPrevented() {
      return defaultPrevented;
    },
    preventDefault: () => {
      defaultPrevented = true;
    },
  };
}

export { createPressEvent };
