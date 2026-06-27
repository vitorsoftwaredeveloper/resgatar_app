import React from "react";

// Mock leve do reanimated para o jest (que não transforma o pacote nativo).
// Componentes animados viram Views/Texts simples e os hooks são no-ops.
const passthrough =
  (tag: string) =>
  ({ children, style, ...props }: any) =>
    React.createElement(tag, { style, ...props }, children);

const Animated: any = {
  View: passthrough("View"),
  Text: passthrough("Text"),
  ScrollView: passthrough("ScrollView"),
  Image: passthrough("Image"),
  createAnimatedComponent: (c: any) => c,
};

export default Animated;

export const Easing = {
  linear: (t: number) => t,
  inOut: () => (t: number) => t,
  out: () => (t: number) => t,
};

export const useSharedValue = (initial: any) => ({ value: initial });
export const useAnimatedStyle = (fn: any) => (typeof fn === "function" ? fn() : {});
export const withTiming = (v: any) => v;
export const withSpring = (v: any) => v;
export const withRepeat = (v: any) => v;
export const withDelay = (_d: any, v: any) => v;
