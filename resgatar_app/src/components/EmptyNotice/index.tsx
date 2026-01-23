import React, { useEffect } from "react";
import { Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { styles } from "./styles";
import { Bell } from "lucide-react-native";
import { COLORS } from "@/theme";

export const EmptyNotices = () => {
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    fadeIn.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });
  });

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ translateY: fadeIn.value === 0 ? 10 : 0 }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Bell size={64} color={COLORS.primary} />

      <Text style={styles.title}>Nenhuma notificação no momento</Text>
      <Text style={styles.description}>
        Quando houver notificaões, elas aparecerão aqui.
      </Text>
    </Animated.View>
  );
};
