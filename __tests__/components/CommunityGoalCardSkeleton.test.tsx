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
    colors: {
      skeletonBg: "#D0C8C0",
      card: "#FFFFFF",
      border: "#DED6CC",
    },
    mode: "light",
  }),
}));

import React from "react";
import { render } from "@testing-library/react-native";
import { CommunityGoalCardSkeleton } from "@/components/Skeleton/CommunityGoalCardSkeleton";

describe("CommunityGoalCardSkeleton", () => {
  it("renderiza sem lançar erros", () => {
    expect(() => render(<CommunityGoalCardSkeleton />)).not.toThrow();
  });

  it("renderiza os blocos visuais do skeleton (ícone, título, percentual, barra)", () => {
    const { UNSAFE_getAllByType } = render(<CommunityGoalCardSkeleton />);
    // Card animado (Animated.View) + 4 blocos internos (icon, title, percent, track)
    expect(UNSAFE_getAllByType("View" as any).length).toBeGreaterThanOrEqual(4);
  });

  it("não exibe texto — é um placeholder visual puro", () => {
    const { queryByText } = render(<CommunityGoalCardSkeleton />);
    expect(queryByText(/./)).toBeNull();
  });
});
