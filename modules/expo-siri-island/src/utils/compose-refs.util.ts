import type { Ref, RefCallback } from "react";

function setRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

function composeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (node: T | null) => {
    refs.forEach((ref) => setRef(ref, node));
  };
}

export { composeRefs };
