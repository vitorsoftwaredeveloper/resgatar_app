const mockCoach = {
  active: false,
  step: null as any,
  targetRect: null as any,
  stepIndex: 0,
  totalSteps: 5,
  next: jest.fn(),
  prev: jest.fn(),
  stop: jest.fn(),
};

jest.mock("@/context/CoachContext", () => ({
  useCoach: () => mockCoach,
}));
jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", white: "#FFF", text: "#3E2F23", textMuted: "#8C7A6B", card: "#FFF" },
    mode: "light",
  }),
}));
// react-native-svg mock inline (adiciona Mask que falta no mock compartilhado)
jest.mock("react-native-svg", () => {
  const React = require("react");
  const el = (tag: string) => ({ children, ...props }: any) =>
    React.createElement(tag, props, children);
  return {
    __esModule: true,
    default: el("Svg"),
    Defs: el("Defs"),
    Mask: el("Mask"),
    Rect: el("Rect"),
  };
});

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { CoachOverlay } from "@/components/CoachOverlay";

const step = { id: "streak-card", title: "Ofensiva", text: "Sua sequência diária" };

describe("CoachOverlay", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCoach.active = false;
    mockCoach.step = null;
    mockCoach.targetRect = null;
    mockCoach.stepIndex = 0;
    mockCoach.totalSteps = 5;
  });

  it("não renderiza nada quando active=false", () => {
    const { queryByText } = render(<CoachOverlay />);
    expect(queryByText("Ofensiva")).toBeNull();
  });

  it("renderiza o balão com title e text quando active=true", () => {
    mockCoach.active = true;
    mockCoach.step = step;
    const { getByText } = render(<CoachOverlay />);
    expect(getByText("Ofensiva")).toBeTruthy();
    expect(getByText("Sua sequência diária")).toBeTruthy();
  });

  it("exibe contador 'X de Y'", () => {
    mockCoach.active = true;
    mockCoach.step = step;
    mockCoach.stepIndex = 1;
    mockCoach.totalSteps = 5;
    const { getByText } = render(<CoachOverlay />);
    expect(getByText("2 de 5")).toBeTruthy();
  });

  it("chama stop ao pressionar 'Pular'", () => {
    mockCoach.active = true;
    mockCoach.step = step;
    const { getByText } = render(<CoachOverlay />);
    fireEvent.press(getByText("Pular"));
    expect(mockCoach.stop).toHaveBeenCalledTimes(1);
  });

  it("chama next ao pressionar 'Próximo'", () => {
    mockCoach.active = true;
    mockCoach.step = step;
    const { getByText } = render(<CoachOverlay />);
    fireEvent.press(getByText("Próximo"));
    expect(mockCoach.next).toHaveBeenCalledTimes(1);
  });

  it("exibe 'Concluir' no último passo", () => {
    mockCoach.active = true;
    mockCoach.step = step;
    mockCoach.stepIndex = 4;
    mockCoach.totalSteps = 5;
    const { getByText } = render(<CoachOverlay />);
    expect(getByText("Concluir")).toBeTruthy();
  });

  it("exibe botão 'Anterior' quando stepIndex > 0", () => {
    mockCoach.active = true;
    mockCoach.step = step;
    mockCoach.stepIndex = 2;
    const { getByText } = render(<CoachOverlay />);
    expect(getByText("Anterior")).toBeTruthy();
  });

  it("não exibe botão 'Anterior' no primeiro passo", () => {
    mockCoach.active = true;
    mockCoach.step = step;
    mockCoach.stepIndex = 0;
    const { queryByText } = render(<CoachOverlay />);
    expect(queryByText("Anterior")).toBeNull();
  });

  it("chama prev ao pressionar 'Anterior'", () => {
    mockCoach.active = true;
    mockCoach.step = step;
    mockCoach.stepIndex = 3;
    const { getByText } = render(<CoachOverlay />);
    fireEvent.press(getByText("Anterior"));
    expect(mockCoach.prev).toHaveBeenCalledTimes(1);
  });
});
