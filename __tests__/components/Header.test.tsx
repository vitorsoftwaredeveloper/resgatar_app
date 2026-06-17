const mockToggleTheme = jest.fn();
const mockUseAppTheme = jest.fn();

jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => mockUseAppTheme(),
}));
jest.mock("lucide-react-native", () => ({
  Moon: () => null,
  Sun: () => null,
}));
jest.mock("@/components/Svg/Logo", () => ({
  LogoResgatar: () => null,
}));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Header } from "@/components/Header";

const lightTheme = {
  colors: { primary: "#6B4F3A" },
  mode: "light" as const,
  toggleTheme: mockToggleTheme,
};

const darkTheme = {
  colors: { primary: "#C9A055" },
  mode: "dark" as const,
  toggleTheme: mockToggleTheme,
};

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppTheme.mockReturnValue(lightTheme);
  });

  it("exibe o nome do usuário", () => {
    const { getByText } = render(<Header name="João" />);
    expect(getByText("João")).toBeTruthy();
  });

  it("exibe a saudação 'Olá,'", () => {
    const { getByText } = render(<Header name="Maria" />);
    expect(getByText("Olá,")).toBeTruthy();
  });

  it("chama toggleTheme ao pressionar o botão de tema", () => {
    const { UNSAFE_getByType } = render(<Header name="João" />);
    fireEvent.press(UNSAFE_getByType("TouchableOpacity" as any));
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("renderiza corretamente no modo dark", () => {
    mockUseAppTheme.mockReturnValue(darkTheme);
    const { getByText } = render(<Header name="João" />);
    expect(getByText("João")).toBeTruthy();
    expect(getByText("Olá,")).toBeTruthy();
  });
});
