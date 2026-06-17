jest.mock("react-native-reanimated", () => {
  const React = require("react");
  const AnimatedView = ({ children, style }: any) =>
    React.createElement("View", { style }, children);
  return {
    __esModule: true,
    default: { View: AnimatedView },
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: () => ({}),
    withRepeat: (v: any) => v,
    withTiming: (v: any) => v,
  };
});
jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { skeletonBg: "#ccc", card: "#FFF" },
    mode: "light",
  }),
}));

import React from "react";
import { render } from "@testing-library/react-native";
import { RemoveMemberSkeleton } from "@/components/Skeleton/RemoveMemberSkeleton";

describe("RemoveMemberSkeleton", () => {
  it("renderiza sem erros", () => {
    expect(() => render(<RemoveMemberSkeleton />)).not.toThrow();
  });

  it("renderiza os blocos de skeleton", () => {
    const { UNSAFE_getAllByType } = render(<RemoveMemberSkeleton />);
    expect(UNSAFE_getAllByType("View" as any).length).toBeGreaterThan(0);
  });
});
