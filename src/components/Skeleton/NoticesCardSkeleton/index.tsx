import { SPACING } from "@/theme";
import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// Placeholder das linhas do NoticesCard enquanto os compromissos carregam.
// Espelha o layout real: nó (círculo) + título + linha de detalhe.
export function NoticesCardSkeleton({ rows = 3 }: { rows?: number }) {
  const { colors } = useAppTheme();

  const opacity = useSharedValue(0.4);
  opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const s = StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      paddingVertical: SPACING.sm2,
    },
    rowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    seq: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.skeletonBg,
    },
    lines: {
      flex: 1,
      gap: 6,
    },
    lineTitle: {
      width: "55%",
      height: 13,
      borderRadius: 6,
      backgroundColor: colors.skeletonBg,
    },
    lineMeta: {
      width: "80%",
      height: 11,
      borderRadius: 6,
      backgroundColor: colors.skeletonBg,
    },
  });

  return (
    <Animated.View style={animatedStyle}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={[s.row, i < rows - 1 && s.rowBorder]}>
          <View style={s.seq} />
          <View style={s.lines}>
            <View style={s.lineTitle} />
            <View style={s.lineMeta} />
          </View>
        </View>
      ))}
    </Animated.View>
  );
}
