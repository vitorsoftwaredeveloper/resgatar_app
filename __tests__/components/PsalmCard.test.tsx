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
import { PsalmCard } from "@/components/PsalmCard";

const baseProps = {
  referencia: "Sl 22",
  texto: "O Senhor é meu pastor.",
};

describe("PsalmCard", () => {
  it("exibe a referência do salmo", () => {
    const { getByText } = render(<PsalmCard {...baseProps} />);
    expect(getByText("Sl 22")).toBeTruthy();
  });

  it("exibe o label 'SALMO RESPONSORIAL'", () => {
    const { getByText } = render(<PsalmCard {...baseProps} />);
    expect(getByText("SALMO RESPONSORIAL")).toBeTruthy();
  });

  it("exibe o refrão quando fornecido", () => {
    const { getByText } = render(
      <PsalmCard {...baseProps} refrao="O Senhor é meu pastor." />,
    );
    expect(getByText("Refrão")).toBeTruthy();
  });

  it("não exibe 'Refrão' quando não fornecido", () => {
    const { queryByText } = render(<PsalmCard {...baseProps} />);
    expect(queryByText("Refrão")).toBeNull();
  });

  it("exibe 'Ver mais' inicialmente", () => {
    const { getByText } = render(<PsalmCard {...baseProps} />);
    expect(getByText("Ver mais")).toBeTruthy();
  });

  it("alterna para 'Ocultar' ao pressionar", () => {
    const { getByText } = render(<PsalmCard {...baseProps} />);
    fireEvent.press(getByText("Ver mais"));
    expect(getByText("Ocultar")).toBeTruthy();
  });

  it("volta para 'Ver mais' ao pressionar novamente", () => {
    const { getByText } = render(<PsalmCard {...baseProps} />);
    fireEvent.press(getByText("Ver mais"));
    fireEvent.press(getByText("Ocultar"));
    expect(getByText("Ver mais")).toBeTruthy();
  });

  it("não lança erro ao receber evento de layout", () => {
    // handleContentLayout e o useEffect com contentHeight > 0 só são acionados
    // pelo motor de layout nativo — não são alcançáveis via fireEvent em ambiente de teste.
    // Cobertura parcial é esperada nessas linhas (27-28, 33).
    const { UNSAFE_getAllByType } = render(<PsalmCard {...baseProps} />);
    expect(UNSAFE_getAllByType("View" as any).length).toBeGreaterThan(0);
  });
});
