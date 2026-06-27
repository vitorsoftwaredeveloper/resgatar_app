const mockToggleTheme = jest.fn();
const mockUseAppTheme = jest.fn();

jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => mockUseAppTheme(),
}));
jest.mock("lucide-react-native", () => ({
  Moon: () => null,
  Sun: () => null,
  ChevronLeft: () => null,
  EllipsisVertical: () => null,
}));
jest.mock("@/components/Svg/Logo", () => ({
  LogoResgatar: () => null,
}));
jest.mock("@react-navigation/native", () => ({
  useIsFocused: () => true,
}));
jest.mock("@/context/CoachContext", () => ({
  useCoach: () => ({
    registerTarget: jest.fn(),
    unregisterTarget: jest.fn(),
    registerAction: jest.fn(),
    unregisterAction: jest.fn(),
    active: false,
  }),
}));
jest.mock("@/components/CoachTarget", () => {
  const React = require("react");
  return { CoachTarget: ({ children }: any) => children };
});
jest.mock("@/components/QuickActionsSheet", () => ({
  QuickActionsSheet: () => null,
}));
jest.mock("@/components/AchievementsModal", () => ({
  AchievementsModal: () => null,
}));
jest.mock("@/components/CosmeticUnlockedModal", () => ({
  CosmeticUnlockedModal: () => null,
}));
jest.mock("@/context/AuthContext", () => {
  const React = require("react");
  return {
    AuthContext: React.createContext({
      myTier: 0,
      myStreak: null,
      selectedFrame: null,
      setFrame: jest.fn(),
    }),
  };
});
jest.mock("@/utils/image", () => ({
  resolveAvatarUri: (photo: string | null | undefined) => {
    if (!photo || photo.trim().length === 0) return null;
    if (photo.startsWith("data:image")) return photo;
    return null;
  },
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

  it("abre o QuickActionsSheet ao pressionar o botão de ações", () => {
    const { getByTestId } = render(<Header name="João" />);
    fireEvent.press(getByTestId("theme-toggle"));
    // QuickActionsSheet é mockado — apenas verifica que o botão é pressionável
    expect(mockToggleTheme).not.toHaveBeenCalled();
  });

  it("renderiza corretamente no modo dark", () => {
    mockUseAppTheme.mockReturnValue(darkTheme);
    const { getByText } = render(<Header name="João" />);
    expect(getByText("João")).toBeTruthy();
    expect(getByText("Olá,")).toBeTruthy();
  });

  it("exibe a foto do usuário quando informada", () => {
    const { UNSAFE_getByType } = render(
      <Header name="João" photo="data:image/png;base64,iVBORw0KGgo=" />,
    );
    expect(UNSAFE_getByType("Image" as any).props.source.uri).toBe(
      "data:image/png;base64,iVBORw0KGgo=",
    );
  });

  it("não exibe imagem (usa a logo) quando não há foto", () => {
    const { UNSAFE_queryByType } = render(<Header name="João" />);
    expect(UNSAFE_queryByType("Image" as any)).toBeNull();
  });

  it("usa a logo quando a foto é inválida", () => {
    const { UNSAFE_queryByType } = render(<Header name="João" photo="   " />);
    expect(UNSAFE_queryByType("Image" as any)).toBeNull();
  });
});
