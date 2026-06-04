import React, { useCallback, useMemo } from "react";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

interface Props {
  children: React.ReactElement;
}

export function SwipeableTab({ children }: Props) {
  const navigation = useNavigation<any>();

  const go = useCallback(
    (delta: number) => {
      const state = navigation.getState();
      if (!state) return;
      const next = state.index + delta;
      if (next >= 0 && next < state.routes.length) {
        navigation.navigate(state.routes[next].name as never);
      }
    },
    [navigation],
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-20, 20])
        .failOffsetY([-15, 15])
        .runOnJS(true)
        .onEnd((e) => {
          if (e.velocityX < -300 && e.translationX < -30) go(1);
          else if (e.velocityX > 300 && e.translationX > 30) go(-1);
        }),
    [go],
  );

  return <GestureDetector gesture={gesture}>{children}</GestureDetector>;
}
