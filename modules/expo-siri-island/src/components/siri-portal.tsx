import * as React from "react";
import { useCallback, type FC } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { PortalHost } from "react-native-teleport";
import { SHIMMER_PHASES } from "../constants";
import { Phase } from "../enums";
import { useSiriContext } from "../hooks";
import type { TSiriPortalProps } from "../interfaces";
import {
  NativeSiriIslandContentView,
  NativeSiriIslandView,
} from "../native-view";
import {
  createPressEvent,
  expandedContentWidth,
  registerComponent,
} from "../utils";

const Portal: FC<TSiriPortalProps> = ({
  children,
  label,
  shimmer,
  hidesStatusBar,
  glassEffect = true,
  gradientEffect = true,
  gradientStart = 0.5,
  gradientEnd = 1,
  gradientOpacity = 0,
  gradientColor = "black",
  onPress,
}: TSiriPortalProps &
  React.ComponentProps<typeof Portal>): React.ReactElement | null => {
  const {
    phase,
    labels,
    controller,
    hostName,
    hasContent,
    contentHeight,
    pressIsland,
  } = useSiriContext("Siri.Portal");
  const { width } = useWindowDimensions();
  const showsContent = hasContent && phase === Phase.Answer;
  const handleIslandPress = useCallback(() => {
    const event = createPressEvent(phase);
    onPress?.(event);
    if (!event.defaultPrevented) pressIsland();
  }, [phase, onPress, pressIsland]);

  if (!NativeSiriIslandView || !NativeSiriIslandContentView) return null;

  return (
    <NativeSiriIslandView
      controller={controller}
      phase={phase}
      label={label ?? labels[phase] ?? ""}
      shimmer={shimmer ?? SHIMMER_PHASES.includes(phase)}
      hidesStatusBar={hidesStatusBar ?? phase !== Phase.Idle}
      hasContent={showsContent}
      glassEffect={glassEffect}
      gradientEffect={gradientEffect && !showsContent}
      gradientStart={gradientStart}
      gradientEnd={gradientEnd}
      gradientOpacity={gradientOpacity}
      gradientColor={gradientColor}
      onIslandPress={handleIslandPress}
      style={styles.anchor}
    >
      <NativeSiriIslandContentView
        style={[
          styles.content,
          {
            width: expandedContentWidth(width, contentHeight),
            height: contentHeight,
          },
        ]}
      >
        <PortalHost name={hostName} style={StyleSheet.absoluteFill} />
      </NativeSiriIslandContentView>
      {children}
    </NativeSiriIslandView>
  );
};

const styles = StyleSheet.create({
  anchor: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    pointerEvents: "none",
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    pointerEvents: "box-none",
  },
});

const SiriPortal = registerComponent("Siri.Portal", Portal);

export { SiriPortal };
