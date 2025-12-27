import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { styles } from "./styles";

export function RemoveMemberSkeleton() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
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
