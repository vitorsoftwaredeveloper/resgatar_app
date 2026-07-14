import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useStyles } from "./styles";

// Placeholder do cabeçalho editorial da liturgia (eyebrow + título + pílula da
// cor), exibido enquanto a liturgia do dia não chega — espelha o skeleton do
// browser (readings.module.css: .skelEyebrow/.skelTitle).
export function LiturgyHeadSkeleton() {
  const styles = useStyles();
  const opacity = useSharedValue(0.4);
  opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.wrap, animatedStyle]}>
      <View style={styles.eyebrow} />
      <View style={styles.title} />
      <View style={styles.pill} />
    </Animated.View>
  );
}
