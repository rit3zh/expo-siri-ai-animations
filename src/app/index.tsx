import {
  Button,
  HStack,
  Host,
  Menu,
  NavigationStack,
  ScrollView,
  Text,
  Toggle,
  Toolbar,
  ToolbarItem,
  VStack,
} from "@expo/ui/swift-ui";
import {
  buttonStyle,
  controlSize,
  font,
  foregroundStyle,
  labelStyle,
  navigationBarTitleDisplayMode,
  navigationTitle,
  padding,
} from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { SiriBackdrop, WeatherAnswer } from "@/components/siri";
import { useSiriDeepLink } from "@/hooks";
import { Phase, Siri, useSiri, type TSiriPhaseLabels } from "expo-siri-island";

const LABELS: TSiriPhaseLabels = {
  answer: "The result is 19.77.",
};

const PHASES: { phase: Phase; title: string }[] = [
  { phase: Phase.Idle, title: "Idle" },
  { phase: Phase.Listening, title: "Listen" },
  { phase: Phase.Thinking, title: "Think" },
  { phase: Phase.Searching, title: "Search" },
  { phase: Phase.Reasoning, title: "Reason" },
  { phase: Phase.Answer, title: "Answer" },
];

const SECONDARY = foregroundStyle({ type: "hierarchical", style: "secondary" });

export default function Index() {
  const [glassEffect, setGlassEffect] = useState<boolean>(true);
  const [gradientEffect, setGradientEffect] = useState<boolean>(true);
  const [customContent, setCustomContent] = useState<boolean>(false);

  return (
    <Siri.Root labels={LABELS}>
      <View style={styles.screen}>
        <Host style={styles.screen}>
          <NavigationStack>
            <Controls
              glassEffect={glassEffect}
              gradientEffect={gradientEffect}
              customContent={customContent}
              onGlassEffectChange={setGlassEffect}
              onGradientEffectChange={setGradientEffect}
              onCustomContentChange={setCustomContent}
            />
          </NavigationStack>
        </Host>

        {customContent && <WeatherAnswer />}

        <SiriBackdrop />

        <Siri.Portal
          glassEffect={glassEffect}
          gradientEffect={gradientEffect}
        />
      </View>
    </Siri.Root>
  );
}

interface IControls {
  glassEffect: boolean;
  gradientEffect: boolean;
  customContent: boolean;
  onGlassEffectChange: (enabled: boolean) => void;
  onGradientEffectChange: (enabled: boolean) => void;
  onCustomContentChange: (enabled: boolean) => void;
}

function Controls({
  glassEffect,
  gradientEffect,
  customContent,
  onGlassEffectChange,
  onGradientEffectChange,
  onCustomContentChange,
}: IControls) {
  const siri = useSiri();
  useSiriDeepLink();

  const ask = <T extends boolean>(custom: T) => {
    onCustomContentChange(custom);
    siri.play();
  };

  return (
    <Toolbar>
      <ScrollView
        modifiers={[
          navigationTitle("Siri"),
          navigationBarTitleDisplayMode("large"),
        ]}
      >
        <VStack
          alignment="leading"
          spacing={36}
          modifiers={[padding({ horizontal: 20, top: 4, bottom: 40 })]}
        >
          <Text modifiers={[font({ textStyle: "body" }), SECONDARY]}>
            Tap the Dynamic Island, or pick a request below.
          </Text>

          <HStack spacing={10}>
            {siri.playing ? (
              <Button
                label="Stop"
                systemImage="stop.fill"
                onPress={siri.stop}
                modifiers={[buttonStyle("glass"), controlSize("large")]}
              />
            ) : (
              <>
                <Button
                  label="Ask Siri"
                  systemImage="waveform"
                  onPress={() => ask(false)}
                  modifiers={[
                    buttonStyle("glassProminent"),
                    controlSize("large"),
                  ]}
                />
                <Button
                  label="Weather"
                  systemImage="cloud.sun"
                  onPress={() => ask(true)}
                  modifiers={[buttonStyle("glass"), controlSize("large")]}
                />
              </>
            )}
          </HStack>

          <VStack alignment="leading" spacing={12}>
            <Text modifiers={[font({ textStyle: "footnote" }), SECONDARY]}>
              PHASE
            </Text>
            <ScrollView axes="horizontal" showsIndicators={false}>
              <HStack spacing={8}>
                {PHASES.map(({ phase, title }) => (
                  <Button
                    key={phase}
                    label={title}
                    onPress={() => siri.setPhase(phase)}
                    modifiers={[
                      buttonStyle(
                        siri.phase === phase ? "glassProminent" : "glass",
                      ),
                    ]}
                  />
                ))}
              </HStack>
            </ScrollView>
          </VStack>
        </VStack>
      </ScrollView>

      <Toolbar.Content>
        <ToolbarItem placement="topBarTrailing">
          <Menu
            label="Options"
            systemImage="slider.horizontal.3"
            modifiers={[labelStyle("iconOnly")]}
          >
            <Toggle
              label="Glass"
              isOn={glassEffect}
              onIsOnChange={onGlassEffectChange}
            />
            <Toggle
              label="Gradient"
              isOn={gradientEffect}
              onIsOnChange={onGradientEffectChange}
            />
            <Toggle
              label="Custom Content"
              isOn={customContent}
              onIsOnChange={onCustomContentChange}
            />
          </Menu>
        </ToolbarItem>
      </Toolbar.Content>
    </Toolbar>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
