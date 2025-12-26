import React, { useEffect } from "react";
import { Text, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { styles } from "./styles";

export const EmptyNotices = () => {
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    fadeIn.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ translateY: fadeIn.value === 0 ? 10 : 0 }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Image
        source={require("@/assets/empty-notices.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Nenhuma notificação no momento</Text>
      <Text style={styles.description}>
        Quando houver notificaões, elas aparecerão aqui.
      </Text>
    </Animated.View>
  );
};
