import React from "react";

export const GestureHandlerRootView = ({ children, style }: any) =>
  React.createElement("View", { style }, children);

export const Gesture = {
  Pan: () => ({
    activeOffsetX: () => Gesture.Pan(),
    failOffsetY: () => Gesture.Pan(),
    runOnJS: () => Gesture.Pan(),
    onEnd: () => Gesture.Pan(),
  }),
};

export const GestureDetector = ({ children }: any) => children;

export const Swipeable = ({ children }: any) => children;

export const PanGestureHandler = ({ children }: any) => children;

export const State = {};
export const Directions = {};
