import React, { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Festive palette, leaning on the warm flame accent of the streak theme.
const COLORS = [
  "#E8862E",
  "#E0B96A",
  "#6B4F3A",
  "#2E7D32",
  "#C62828",
  "#7B1FA2",
];

interface PieceConfig {
  startX: number;
  color: string;
  size: number;
  delay: number;
  fallDuration: number;
  sway: number;
  swayDuration: number;
  rounded: boolean;
}

function buildPieces(count: number): PieceConfig[] {
  return Array.from({ length: count }, () => ({
    startX: Math.random() * SCREEN_W,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 8,
    delay: Math.random() * 400,
    fallDuration: 1800 + Math.random() * 1400,
    sway: (Math.random() - 0.5) * 80,
    swayDuration: 600 + Math.random() * 600,
    rounded: Math.random() > 0.5,
  }));
}

function ConfettiPiece({ config }: { config: PieceConfig }) {
  const progress = useSharedValue(0);
  const sway = useSharedValue(0);
  const spin = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      config.delay,
      withTiming(1, {
        duration: config.fallDuration,
        easing: Easing.linear,
      }),
    );
    sway.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(1, { duration: config.swayDuration, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      ),
    );
    spin.value = withRepeat(
      withTiming(1, { duration: config.swayDuration, easing: Easing.linear }),
      -1,
    );
    // Animations are driven once on mount; remount (via key) replays them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: progress.value * (SCREEN_H + 60) },
      { translateX: sway.value * config.sway },
      { rotate: `${spin.value * 360}deg` },
    ],
    // Fade out over the last third of the fall.
    opacity: progress.value < 0.7 ? 1 : 1 - (progress.value - 0.7) / 0.3,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          top: -20,
          left: config.startX,
          width: config.size,
          height: config.size,
          backgroundColor: config.color,
          borderRadius: config.rounded ? config.size / 2 : 2,
        },
        style,
      ]}
    />
  );
}

interface Props {
  count?: number;
}

export function Confetti({ count = 26 }: Props) {
  const pieces = useMemo(() => buildPieces(count), [count]);

  return (
    <Animated.View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      collapsable={false}
    >
      {pieces.map((config, i) => (
        <ConfettiPiece key={i} config={config} />
      ))}
    </Animated.View>
  );
}
