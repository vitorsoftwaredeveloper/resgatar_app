jest.mock("react-native-reanimated", () => {
  const React = require("react");
  const AnimatedView = ({ children, style }: any) =>
    React.createElement("View", { style }, children);
  return {
    __esModule: true,
    default: { View: AnimatedView },
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: () => ({}),
    withTiming: (v: any) => v,
    Easing: {
      out: jest.fn(() => jest.fn()),
      inOut: jest.fn(() => jest.fn()),
      cubic: jest.fn(),
      ease: jest.fn(),
    },
  };
});
jest.mock("lucide-react-native", () => ({ ChevronDown: () => null }));
jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", text: "#000", textMuted: "#999", card: "#FFF", border: "#ccc" },
    mode: "light",
  }),
}));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ReadingCard } from "@/components/ReadingCard";

const baseProps = {
  label: "PRIMEIRA LEITURA",
  referencia: "Gn 1,1-5",
  texto: "No princípio, Deus criou os céus e a terra.",
};

describe("ReadingCard", () => {
  it("exibe o label", () => {
    const { getByText } = render(<ReadingCard {...baseProps} />);
    expect(getByText("PRIMEIRA LEITURA")).toBeTruthy();
  });

  it("exibe a referência", () => {
    const { getByText } = render(<ReadingCard {...baseProps} />);
    expect(getByText("Gn 1,1-5")).toBeTruthy();
  });

  it("exibe o título quando fornecido", () => {
    const { getByText } = render(
      <ReadingCard {...baseProps} titulo="Criação do mundo" />,
    );
    expect(getByText("Criação do mundo")).toBeTruthy();
  });

  it("não exibe título quando não fornecido", () => {
    const { queryByText } = render(<ReadingCard {...baseProps} />);
    expect(queryByText("Criação do mundo")).toBeNull();
  });

  it("exibe 'Ver mais' quando defaultExpanded é false", () => {
    const { getByText } = render(
      <ReadingCard {...baseProps} defaultExpanded={false} />,
    );
    expect(getByText("Ver mais")).toBeTruthy();
  });

  it("exibe 'Ocultar' quando defaultExpanded é true", () => {
    const { getByText } = render(
      <ReadingCard {...baseProps} defaultExpanded={true} />,
    );
    expect(getByText("Ocultar")).toBeTruthy();
  });

  it("alterna entre 'Ver mais' e 'Ocultar' ao pressionar", () => {
    const { getByText } = render(<ReadingCard {...baseProps} />);
    fireEvent.press(getByText("Ver mais"));
    expect(getByText("Ocultar")).toBeTruthy();
    fireEvent.press(getByText("Ocultar"));
    expect(getByText("Ver mais")).toBeTruthy();
  });

  it("exibe a fórmula final quando fornecida", () => {
    const { getAllByText } = render(
      <ReadingCard {...baseProps} formulaFinal="Palavra do Senhor." />,
    );
    const results = getAllByText(/Palavra do Senhor/);
    expect(results.length).toBeGreaterThan(0);
  });

  it("aciona handleContentLayout ao receber evento de layout com height > 0", () => {
    const { UNSAFE_getAllByType } = render(<ReadingCard {...baseProps} />);
    const views = UNSAFE_getAllByType("View" as any);
    expect(() =>
      fireEvent(views[views.length - 1], "layout", {
        nativeEvent: { layout: { height: 200 } },
      }),
    ).not.toThrow();
  });
});
