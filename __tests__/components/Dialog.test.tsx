jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", white: "#FFF", text: "#000", card: "#FFF", border: "#ccc", textMuted: "#999", inputBg: "#FFF", black: "#000", error: "#E53935" },
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
import { Dialog } from "@/components/Dialog";

const onClose = jest.fn();

describe("Dialog", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("quando visible é true", () => {
    it("exibe o título", () => {
      const { getByText } = render(
        <Dialog visible={true} title="Confirmar exclusão" onClose={onClose} />,
      );
      expect(getByText("Confirmar exclusão")).toBeTruthy();
    });

    it("exibe a descrição", () => {
      const { getByText } = render(
        <Dialog
          visible={true}
          description="Deseja realmente excluir?"
          onClose={onClose}
        />,
      );
      expect(getByText("Deseja realmente excluir?")).toBeTruthy();
    });

    it("não exibe título quando não fornecido", () => {
      const { queryByText } = render(
        <Dialog visible={true} onClose={onClose} />,
      );
      expect(queryByText("Confirmar exclusão")).toBeNull();
    });

    it("não exibe descrição quando não fornecida", () => {
      const { queryByText } = render(
        <Dialog visible={true} title="Título" onClose={onClose} />,
      );
      expect(queryByText("Deseja realmente excluir?")).toBeNull();
    });

    it("renderiza os botões de ação", () => {
      const { getByText } = render(
        <Dialog
          visible={true}
          onClose={onClose}
          actions={[
            { label: "Cancelar", onPress: jest.fn(), variant: "secondary" },
            { label: "Confirmar", onPress: jest.fn(), variant: "primary" },
          ]}
        />,
      );
      expect(getByText("Cancelar")).toBeTruthy();
      expect(getByText("Confirmar")).toBeTruthy();
    });

    it("chama o handler correto ao pressionar cada ação", () => {
      const onCancel = jest.fn();
      const onConfirm = jest.fn();
      const { getByText } = render(
        <Dialog
          visible={true}
          onClose={onClose}
          actions={[
            { label: "Cancelar", onPress: onCancel },
            { label: "Confirmar", onPress: onConfirm },
          ]}
        />,
      );
      fireEvent.press(getByText("Cancelar"));
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onConfirm).not.toHaveBeenCalled();

      fireEvent.press(getByText("Confirmar"));
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("renderiza sem actions quando array está vazio", () => {
      expect(() =>
        render(<Dialog visible={true} onClose={onClose} actions={[]} />),
      ).not.toThrow();
    });
  });

  describe("quando visible é false", () => {
    it("não renderiza conteúdo", () => {
      const { queryByText } = render(
        <Dialog visible={false} title="Oculto" onClose={onClose} />,
      );
      expect(queryByText("Oculto")).toBeNull();
    });
  });
});
