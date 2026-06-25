import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING } from "@/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// Placeholder do CommunityGoalCard exibido enquanto o andamento das
// contribuições carrega. Espelha o layout do card (header, percentual, barra)
// para não deslocar o conteúdo quando os dados reais chegam.
export function CommunityGoalCardSkeleton() {
  const { colors } = useAppTheme();

  const opacity = useSharedValue(0.4);
  opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const s = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.md,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.xxs,
      marginBottom: SPACING.sm2,
    },
    icon: {
      width: 18,
      height: 18,
      borderRadius: 6,
      backgroundColor: colors.skeletonBg,
    },
    title: {
      width: "55%",
      height: 16,
      borderRadius: 6,
      backgroundColor: colors.skeletonBg,
    },
    percent: {
      width: 96,
      height: 30,
      borderRadius: 8,
      backgroundColor: colors.skeletonBg,
      marginBottom: SPACING.sm,
    },
    track: {
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.skeletonBg,
    },
  });

  return (
    <Animated.View style={[s.card, animatedStyle]}>
      <View style={s.header}>
        <View style={s.icon} />
        <View style={s.title} />
      </View>
      <View style={s.percent} />
      <View style={s.track} />
    </Animated.View>
  );
}
