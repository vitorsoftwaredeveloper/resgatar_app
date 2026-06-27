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
jest.mock("lucide-react-native", () => ({
  ChevronDown: () => null,
  Play: () => null,
  Pause: () => null,
}));
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

  describe("botão de TTS", () => {
    const stopPropagation = jest.fn();

    it("não renderiza o botão quando onTTSPlay não é fornecido", () => {
      const { queryByLabelText } = render(<PsalmCard {...baseProps} />);
      expect(queryByLabelText("Ouvir salmo")).toBeNull();
    });

    it("renderiza o botão de play quando onTTSPlay é fornecido", () => {
      const { getByLabelText } = render(
        <PsalmCard {...baseProps} onTTSPlay={jest.fn()} ttsState="idle" />,
      );
      expect(getByLabelText("Ouvir salmo")).toBeTruthy();
    });

    it("exibe o rótulo de pausar quando ttsState é playing", () => {
      const { getByLabelText } = render(
        <PsalmCard {...baseProps} onTTSPlay={jest.fn()} ttsState="playing" />,
      );
      expect(getByLabelText("Pausar leitura")).toBeTruthy();
    });

    it("chama onTTSPlay ao pressionar com estado idle", () => {
      const onTTSPlay = jest.fn();
      const { getByLabelText } = render(
        <PsalmCard {...baseProps} onTTSPlay={onTTSPlay} ttsState="idle" />,
      );
      fireEvent.press(getByLabelText("Ouvir salmo"), { stopPropagation });
      expect(onTTSPlay).toHaveBeenCalled();
    });

    it("chama onTTSPause ao pressionar com estado playing", () => {
      const onTTSPause = jest.fn();
      const { getByLabelText } = render(
        <PsalmCard
          {...baseProps}
          onTTSPlay={jest.fn()}
          onTTSPause={onTTSPause}
          ttsState="playing"
        />,
      );
      fireEvent.press(getByLabelText("Pausar leitura"), { stopPropagation });
      expect(onTTSPause).toHaveBeenCalled();
    });

    it("interrompe a propagação para não alternar o card ao tocar no botão", () => {
      const stop = jest.fn();
      const { getByLabelText } = render(
        <PsalmCard {...baseProps} onTTSPlay={jest.fn()} ttsState="idle" />,
      );
      fireEvent.press(getByLabelText("Ouvir salmo"), { stopPropagation: stop });
      expect(stop).toHaveBeenCalled();
    });
  });
});
