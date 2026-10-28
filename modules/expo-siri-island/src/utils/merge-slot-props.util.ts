type TSlotProps = Record<string, unknown>;

type TCallable = (...args: unknown[]) => unknown;

const HANDLER_PATTERN = /^on[A-Z]/;

function isCallable(value: unknown): value is TCallable {
  return typeof value === "function";
}

function isRecord(value: unknown): value is TSlotProps {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function resolveStyle(style: unknown, state: unknown): unknown {
  return isCallable(style) ? style(state) : style;
}

function mergeStyles(slotStyle: unknown, childStyle: unknown): unknown {
  if (slotStyle == null) return childStyle;
  if (childStyle == null) return slotStyle;
  if (isCallable(slotStyle) || isCallable(childStyle)) {
    return (state: unknown) => [
      resolveStyle(slotStyle, state),
      resolveStyle(childStyle, state),
    ];
  }
  return [slotStyle, childStyle];
}

function mergeSlotProps<T extends TSlotProps>(
  slotProps: T,
  childProps: TSlotProps,
): TSlotProps {
  const merged: TSlotProps = { ...slotProps, ...childProps };

  for (const key of Object.keys(slotProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (childValue === undefined) {
      merged[key] = slotValue;
    } else if (HANDLER_PATTERN.test(key)) {
      if (isCallable(slotValue) && isCallable(childValue)) {
        merged[key] = (...args: unknown[]) => {
          const result = childValue(...args);
          slotValue(...args);
          return result;
        };
      }
    } else if (key === "style") {
      merged.style = mergeStyles(slotValue, childValue);
    } else if (isRecord(slotValue) && isRecord(childValue)) {
      merged[key] = { ...slotValue, ...childValue };
    }
  }

  return merged;
}

export { mergeSlotProps };
export type { TSlotProps };
