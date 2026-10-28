# expo-siri-ai-animations

**Siri-inspired** Dynamic Island animation, with Metal shaders.

<!-- TODO: drop the demo video link here -->

---

## ⚙️ Installation

```bash
git clone https://github.com/rit3zh/expo-siri-ai-animations
cd expo-siri-ai-animations
bun install
bunx expo prebuild
bun ios
```

Peer dependencies (already set up in this template):

```bash
bunx expo install react-native-reanimated react-native-worklets react-native-teleport expo-backdrop expo-symbols @expo/ui
```

The island is a local Expo module in [`modules/expo-siri-island`](modules/expo-siri-island), aliased as `expo-siri-island` in `tsconfig.json`. It is iOS only (16.4+). On Android and web, `Siri.Portal` and `Siri.Content` render nothing.

---

## 🚀 Usage

Wrap a screen in `Siri.Root` and render `Siri.Portal` once inside it.

```tsx
import { Siri, type TSiriPhaseLabels } from "expo-siri-island";
import { View } from "react-native";

const LABELS: TSiriPhaseLabels = {
  answer: "The result is 19.77.",
};

export default function Screen() {
  return (
    <Siri.Root labels={LABELS}>
      <View style={{ flex: 1 }}>
        {/* your screen */}

        <Siri.Portal glassEffect gradientEffect />
      </View>
    </Siri.Root>
  );
}
```

Tapping the island starts the sequence. You can also drive it from anywhere inside `Siri.Root`:

```tsx
import { Phase, Siri, useSiri } from "expo-siri-island";
import { Button } from "react-native";

export function Controls() {
  const siri = useSiri();

  return (
    <>
      <Button
        title={siri.playing ? "Stop" : "Ask Siri"}
        onPress={siri.playing ? siri.stop : siri.play}
      />
      <Button title="Think" onPress={() => siri.setPhase(Phase.Thinking)} />

      <Siri.Trigger phase={Phase.Answer}>
        {/* any pressable content */}
      </Siri.Trigger>
    </>
  );
}
```

Put your own UI inside the expanded island with `Siri.Content`. It shows during the `answer` phase:

```tsx
import { HARDWARE_ISLAND, Siri } from "expo-siri-island";
import { Text, View } from "react-native";

export function WeatherAnswer() {
  return (
    <Siri.Content height={180}>
      <View style={{ flex: 1, paddingTop: HARDWARE_ISLAND.height + 4 }}>
        <Text style={{ color: "white", fontSize: 19 }}>
          It’s 21° and mostly sunny.
        </Text>
      </View>
    </Siri.Content>
  );
}
```

---

## 🧩 API

### `<Siri.Root>`

| Prop            | Type                     | Default                         | Description                                  |
| --------------- | ------------------------ | ------------------------------- | -------------------------------------------- |
| `phase`         | `TSiriPhaseValue`        | none                            | Controlled phase.                            |
| `defaultPhase`  | `TSiriPhaseValue`        | `Phase.Idle`                    | Starting phase when uncontrolled.            |
| `onPhaseChange` | `(phase: Phase) => void` | none                            | Called whenever the phase changes.           |
| `labels`        | `TSiriPhaseLabels`       | `searching`, `reasoning` labels | Text shown in the island for each phase.     |
| `durations`     | `TSiriPhaseDurations`    | see below                       | How long each phase lasts (ms) when playing. |

### `<Siri.Portal>`

| Prop              | Type                               | Default                        | Description                                                                       |
| ----------------- | ---------------------------------- | ------------------------------ | --------------------------------------------------------------------------------- |
| `label`           | `string`                           | `labels[phase]`                | Overrides the label for the current phase.                                        |
| `shimmer`         | `boolean`                          | on for `searching`/`reasoning` | Shimmer effect on the label.                                                      |
| `hidesStatusBar`  | `boolean`                          | `true` unless `idle`           | Hides the status bar while the island is active.                                  |
| `glassEffect`     | `boolean`                          | `true`                         | Liquid glass orb.                                                                 |
| `gradientEffect`  | `boolean`                          | `true`                         | Gradient behind the island. Turned off while content is shown.                    |
| `gradientStart`   | `number`                           | `0.5`                          | Where the gradient starts (0–1).                                                  |
| `gradientEnd`     | `number`                           | `1`                            | Where the gradient ends (0–1).                                                    |
| `gradientOpacity` | `number`                           | `0`                            | Base opacity of the gradient.                                                     |
| `gradientColor`   | `ColorValue`                       | `"black"`                      | Gradient color.                                                                   |
| `onPress`         | `(event: ISiriPressEvent) => void` | none                           | Called on island tap. Call `event.preventDefault()` to skip the default behavior. |

### `<Siri.Content>`

| Prop     | Type                   | Default | Description                      |
| -------- | ---------------------- | ------- | -------------------------------- |
| `height` | `number`               | `92`    | Height of the expanded island.   |
| `style`  | `StyleProp<ViewStyle>` | none    | Style for the content container. |

### `<Siri.Trigger>`

Accepts every `Pressable` prop, plus:

| Prop      | Type              | Default | Description                                                  |
| --------- | ----------------- | ------- | ------------------------------------------------------------ |
| `phase`   | `TSiriPhaseValue` | none    | Jumps to this phase. Without it, the trigger starts playing. |
| `asChild` | `boolean`         | `false` | Merges props into the child instead of wrapping it.          |

### `useSiri()`

| Field      | Type                               | Description                                        |
| ---------- | ---------------------------------- | -------------------------------------------------- |
| `phase`    | `Phase`                            | Current phase.                                     |
| `playing`  | `boolean`                          | Whether the timeline is auto-advancing.            |
| `play`     | `() => void`                       | Starts from `listening` and runs through `answer`. |
| `stop`     | `() => void`                       | Returns to `idle`.                                 |
| `setPhase` | `(phase: TSiriPhaseValue) => void` | Jumps to a phase and stops the timeline.           |

### Phases

`TSiriPhaseValue` is a `Phase` enum member or its string (`"thinking"`). Durations are in ms.

| Phase       | Default duration | Next        |
| ----------- | ---------------- | ----------- |
| `idle`      | none             | none        |
| `listening` | `4200`           | `thinking`  |
| `thinking`  | `2400`           | `searching` |
| `searching` | `2600`           | `reasoning` |
| `reasoning` | `3200`           | `answer`    |
| `answer`    | `5500`           | `idle`      |

---

## 🧱 Stack

[Expo SDK 58](https://expo.dev/changelog) · [React Native 0.88](https://reactnative.dev/) · [Expo Modules](https://docs.expo.dev/modules/overview/) · [Metal](https://developer.apple.com/metal/) · [Reanimated 4](https://docs.swmansion.com/react-native-reanimated/) · [Worklets](https://docs.swmansion.com/react-native-worklets/) · [react-native-teleport](https://github.com/kirillzyusko/react-native-teleport) · [@expo/ui](https://docs.expo.dev/versions/latest/sdk/ui/) · [expo-backdrop](https://www.npmjs.com/package/expo-backdrop) · [expo-symbols](https://docs.expo.dev/versions/latest/sdk/symbols/) · [Expo Router](https://docs.expo.dev/router/introduction/)

---
