interface IPreventableEvent {
  isDefaultPrevented?: () => boolean;
}

function composeEventHandlers<E extends IPreventableEvent>(
  original: ((event: E) => void) | null | undefined,
  handler: (event: E) => void,
): (event: E) => void {
  return (event: E) => {
    original?.(event);
    if (event.isDefaultPrevented?.() !== true) handler(event);
  };
}

export { composeEventHandlers };
