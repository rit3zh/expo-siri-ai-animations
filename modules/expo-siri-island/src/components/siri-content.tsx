import * as React from "react";
import { useEffect, type FC } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Portal } from "react-native-teleport";

import { EXPANDED_ISLAND } from "../constants";
import { useSiriContext } from "../hooks";
import type { TSiriContentProps } from "../interfaces";
import { isSupported } from "../native-view";
import { expandedContentWidth, registerComponent } from "../utils";

const Content: FC<TSiriContentProps> = ({
  children,
  style,
  height = EXPANDED_ISLAND.height,
}: TSiriContentProps): React.ReactElement | null => {
  const { hostName, registerContent } = useSiriContext<string>("Siri.Content");
  const { width } = useWindowDimensions();

  useEffect(() => registerContent(height), [registerContent, height]);

  if (!isSupported) return null;

  return (
    <Portal hostName={hostName}>
      <View
        style={[
          styles.content,
          { width: expandedContentWidth(width, height), height },
          style,
        ]}
      >
        {children}
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  content: {
    justifyContent: "center",
    pointerEvents: "box-none",
  },
});

const SiriContent = registerComponent("Siri.Content", Content);

export { SiriContent };
