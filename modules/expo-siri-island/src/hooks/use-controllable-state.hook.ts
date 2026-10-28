import { useCallback, useLayoutEffect, useRef, useState } from "react";

import type { IControllableState } from "../interfaces";

function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: IControllableState<T>): [T, (next: T) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState<T>(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledValue;
  const latest = useRef({ value, isControlled, onChange });

  useLayoutEffect(() => {
    latest.current = { value, isControlled, onChange };
  });

  const setValue = useCallback((next: T) => {
    const current = latest.current;
    if (Object.is(next, current.value)) return;

    if (!current.isControlled) {
      latest.current = { ...current, value: next };
      setUncontrolledValue(next);
    }
    current.onChange?.(next);
  }, []);

  return [value, setValue];
}

export { useControllableState };
