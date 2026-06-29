jest.mock("@/config/appEnv", () => ({ IS_PRODUCTION: true }));
jest.mock("lucide-react-native", () => ({ ShieldAlert: () => null }));
jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { error: "#E53935" },
    mode: "light",
  }),
}));

import React from "react";
import { Text } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";
import { isDeveloperModeEnabled } from "@dev-mode-detector";
import { DevModeGuard } from "@/components/DevModeGuard";

const mockIsDeveloperModeEnabled = isDeveloperModeEnabled as jest.Mock;

describe("DevModeGuard", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renderiza os filhos quando o modo desenvolvedor está desativado", () => {
    mockIsDeveloperModeEnabled.mockReturnValue(false);
    const { getByText } = render(
      <DevModeGuard><Text>Conteúdo do app</Text></DevModeGuard>,
    );
    expect(getByText("Conteúdo do app")).toBeTruthy();
  });

  it("exibe tela de bloqueio quando modo desenvolvedor está ativo (Android PROD)", () => {
    mockIsDeveloperModeEnabled.mockReturnValue(true);
    const { getByText, queryByText } = render(
      <DevModeGuard><Text>Conteúdo do app</Text></DevModeGuard>,
    );
    expect(getByText("Modo desenvolvedor ativo")).toBeTruthy();
    expect(queryByText("Conteúdo do app")).toBeNull();
  });

  it("exibe botão 'Verificar novamente' na tela de bloqueio", () => {
    mockIsDeveloperModeEnabled.mockReturnValue(true);
    const { getByText } = render(
      <DevModeGuard><Text>x</Text></DevModeGuard>,
    );
    expect(getByText("Verificar novamente")).toBeTruthy();
  });

  it("ao pressionar 'Verificar novamente' chama isDeveloperModeEnabled de novo", () => {
    mockIsDeveloperModeEnabled.mockReturnValue(true);
    const { getByText } = render(
      <DevModeGuard><Text>x</Text></DevModeGuard>,
    );
    fireEvent.press(getByText("Verificar novamente"));
    // 1 na montagem + 1 no press
    expect(mockIsDeveloperModeEnabled.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
