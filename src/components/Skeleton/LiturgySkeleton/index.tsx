import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useStyles } from "./styles";

export function LiturgySkeleton() {
  const styles = useStyles();
  const opacity = useSharedValue(0.4);
  opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.banner} />
      <View style={styles.card} />
      <View style={styles.cardSmall} />
      <View style={styles.cardTall} />
      <View style={styles.card} />
    </Animated.View>
  );
}
