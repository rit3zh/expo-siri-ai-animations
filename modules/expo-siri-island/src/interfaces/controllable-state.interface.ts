interface IControllableState<T> {
  prop?: T;
  defaultProp: T;
  onChange?: (value: T) => void;
}

export type { IControllableState };
