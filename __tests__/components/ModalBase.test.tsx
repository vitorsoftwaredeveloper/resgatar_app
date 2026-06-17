jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", white: "#FFF", text: "#000", card: "#FFF", border: "#ccc" },
    mode: "light",
  }),
}));
jest.mock("lucide-react-native", () => ({ X: () => null }));
jest.mock("react-native-toast-message", () => ({ __esModule: true, default: () => null }));
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children, style }: any) => {
    const React = require("react");
    return React.createElement("View", { style }, children);
  },
}));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ModalBase } from "@/components/ModalBase";

describe("ModalBase", () => {
  const onClose = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  describe("quando visible é true", () => {
    it("renderiza os children", () => {
      const { getByText } = render(
        <ModalBase visible={true} title="Título" onClose={onClose}>
          {React.createElement("Text" as any, null, "Conteúdo interno")}
        </ModalBase>,
      );
      expect(getByText("Conteúdo interno")).toBeTruthy();
    });

    it("exibe o título no header quando fornecido", () => {
      const { getByText } = render(
        <ModalBase visible={true} title="Meu Modal" onClose={onClose}>
          {null}
        </ModalBase>,
      );
      expect(getByText("Meu Modal")).toBeTruthy();
    });

    it("não exibe o header quando title é string vazia", () => {
      const { queryByText } = render(
        <ModalBase visible={true} title="" onClose={onClose}>
          {null}
        </ModalBase>,
      );
      expect(queryByText("Meu Modal")).toBeNull();
    });

    it("chama onClose ao pressionar o botão de fechar", () => {
      const { UNSAFE_getByType } = render(
        <ModalBase visible={true} title="Modal" onClose={onClose}>
          {null}
        </ModalBase>,
      );
      fireEvent.press(UNSAFE_getByType("TouchableOpacity" as any));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("quando visible é false", () => {
    it("não renderiza conteúdo", () => {
      const { queryByText } = render(
        <ModalBase visible={false} title="Modal" onClose={onClose}>
          {React.createElement("Text" as any, null, "Conteúdo oculto")}
        </ModalBase>,
      );
      expect(queryByText("Conteúdo oculto")).toBeNull();
    });
  });
});
