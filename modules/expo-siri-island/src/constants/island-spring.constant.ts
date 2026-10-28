import type { WithSpringConfig } from "react-native-reanimated";

const ISLAND_SPRING = {
  pop: { stiffness: 220, damping: 21, mass: 1 },
  orb: { stiffness: 220, damping: 28, mass: 1 },
  settle: { stiffness: 420, damping: 40, mass: 1 },
  stretch: { stiffness: 160, damping: 16, mass: 1 },
  grow: { stiffness: 190, damping: 22, mass: 1 },
  dismiss: { stiffness: 300, damping: 33, mass: 1 },
  dots: { stiffness: 120, damping: 20, mass: 1 },
} as const satisfies Record<string, WithSpringConfig>;

export { ISLAND_SPRING };
