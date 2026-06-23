import { RADIUS, SPACING } from "@/theme";
import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export function VideoCardSkeleton() {
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const cardWidth = width - SPACING.md * 2;
  const thumbHeight = Math.round((cardWidth * 9) / 16);

  const opacity = useSharedValue(0.4);
  opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const s = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    thumb: {
      width: cardWidth,
      height: thumbHeight,
      backgroundColor: colors.skeletonBg,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      padding: SPACING.sm,
    },
    avatar: {
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
      height: 13,
      borderRadius: 6,
      backgroundColor: colors.skeletonBg,
    },
    lineAuthor: {
      width: "45%",
      height: 11,
      borderRadius: 6,
      backgroundColor: colors.skeletonBg,
    },
  });

  return (
    <Animated.View style={[s.card, animatedStyle]}>
      <View style={s.thumb} />
      <View style={s.infoRow}>
        <View style={s.avatar} />
        <View style={s.lines}>
          <View style={s.lineTitle} />
          <View style={s.lineAuthor} />
        </View>
      </View>
    </Animated.View>
  );
}
