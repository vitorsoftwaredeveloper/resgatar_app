import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { styles } from "./styles";

export function NotificationSkeleton() {
  const opacity = useSharedValue(0.3);

  opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.title} />
      <View style={styles.line} />
      <View style={styles.small} />
    </Animated.View>
  );
}
