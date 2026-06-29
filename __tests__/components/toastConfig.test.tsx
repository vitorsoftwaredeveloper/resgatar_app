import React from "react";
import { render } from "@testing-library/react-native";
import { toastConfig } from "@/components/Toast/toastConfig";

function renderType(type: "success" | "error" | "warning" | "info", text1 = "Título", text2?: string) {
  const element = toastConfig[type]!({ text1, text2 } as any);
  return render(element as any);
}

describe("toastConfig", () => {
  it("define os 4 tipos (success, error, warning, info)", () => {
    expect(typeof toastConfig.success).toBe("function");
    expect(typeof toastConfig.error).toBe("function");
    expect(typeof toastConfig.warning).toBe("function");
    expect(typeof toastConfig.info).toBe("function");
  });

  it("exibe o text1 quando fornecido", () => {
    const { getByText } = renderType("success", "Mensagem de sucesso");
    expect(getByText("Mensagem de sucesso")).toBeTruthy();
  });

  it("exibe o text2 quando fornecido", () => {
    const { getByText } = renderType("error", "Título", "Detalhe do erro");
    expect(getByText("Detalhe do erro")).toBeTruthy();
  });

  it("não exibe text2 quando não fornecido", () => {
    const { queryByText } = renderType("info", "Só título");
    expect(queryByText("Detalhe do erro")).toBeNull();
  });

  it("exibe o nome do app 'Resgatar' no cabeçalho", () => {
    const { getByText } = renderType("warning");
    expect(getByText("Resgatar")).toBeTruthy();
  });

  it.each([
    ["success", "✓"],
    ["error",   "✕"],
    ["warning", "!"],
    ["info",    "i"],
  ] as const)("exibe o símbolo correto para o tipo %s", (type, symbol) => {
    const { getByText } = renderType(type);
    expect(getByText(symbol)).toBeTruthy();
  });
});
