import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { styles } from "./styles";

export function RemoveMemberSkeleton() {
  const opacity = useSharedValue(0.4);

  opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.left}>
        <View style={styles.avatar} />

        <View style={styles.texts}>
          <View style={styles.lineLarge} />
          <View style={styles.lineSmall} />
        </View>
      </View>

      <View style={styles.action} />
    </Animated.View>
  );
}
