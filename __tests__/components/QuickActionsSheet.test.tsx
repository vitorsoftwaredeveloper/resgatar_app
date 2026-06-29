jest.mock("lucide-react-native", () => ({
  Moon: () => null,
  Sun: () => null,
  Cake: () => null,
}));
jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", text: "#3E2F23", textMuted: "#8C7A6B", card: "#FFF" },
    mode: "light",
    toggleTheme: mockToggleTheme,
  }),
}));
jest.mock("@/context/CoachContext", () => ({
  useCoach: () => ({ active: false }),
}));
jest.mock("@/components/CoachTarget", () => {
  const React = require("react");
  return { CoachTarget: ({ children }: any) => React.createElement(React.Fragment, null, children) };
});
jest.mock("@/components/BirthdayModal", () => ({ BirthdayModal: () => null }));

const mockToggleTheme = jest.fn();

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { QuickActionsSheet } from "@/components/QuickActionsSheet";

describe("QuickActionsSheet", () => {
  beforeEach(() => jest.clearAllMocks());

  it("não renderiza o conteúdo quando visible=false", () => {
    const { queryByText } = render(
      <QuickActionsSheet visible={false} onClose={jest.fn()} />,
    );
    expect(queryByText("Modo escuro")).toBeNull();
  });

  it("exibe as opções quando visible=true", () => {
    const { getByText } = render(
      <QuickActionsSheet visible={true} onClose={jest.fn()} />,
    );
    expect(getByText("Modo escuro")).toBeTruthy();
    expect(getByText("Aniversariantes")).toBeTruthy();
  });

  it("chama toggleTheme e onClose ao pressionar o item de tema", () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <QuickActionsSheet visible={true} onClose={onClose} />,
    );
    fireEvent.press(getByText("Modo escuro"));
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("chama onClose ao pressionar Aniversariantes", () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <QuickActionsSheet visible={true} onClose={onClose} />,
    );
    fireEvent.press(getByText("Aniversariantes"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("exibe badge com contagem de aniversários quando todayBirthdays > 0", () => {
    const { getByText } = render(
      <QuickActionsSheet visible={true} onClose={jest.fn()} todayBirthdays={3} />,
    );
    expect(getByText("3")).toBeTruthy();
  });

  it("não exibe badge quando todayBirthdays é 0", () => {
    const { queryByText } = render(
      <QuickActionsSheet visible={true} onClose={jest.fn()} todayBirthdays={0} />,
    );
    // Badge com número 0 não deve aparecer
    expect(queryByText("0")).toBeNull();
  });
});
