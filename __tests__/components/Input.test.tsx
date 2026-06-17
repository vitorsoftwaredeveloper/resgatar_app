jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", white: "#FFF", black: "#000", text: "#000", textMuted: "#999", border: "#ccc", inputBg: "#fff", card: "#fff", muted: "#999", error: "#E53935" },
    mode: "light",
  }),
}));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Input } from "@/components/Input";

describe("Input", () => {
  describe("renderização", () => {
    it("exibe o label quando fornecido", () => {
      const { getByText } = render(<Input label="Nome" />);
      expect(getByText("Nome")).toBeTruthy();
    });

    it("não exibe label quando não fornecido", () => {
      const { queryByText } = render(<Input />);
      expect(queryByText("Nome")).toBeNull();
    });

    it("exibe mensagem de erro quando error é string", () => {
      const { getByText } = render(<Input error="Campo obrigatório" />);
      expect(getByText("Campo obrigatório")).toBeTruthy();
    });

    it("não exibe mensagem de erro quando error é false", () => {
      const { queryByText } = render(<Input error={false} />);
      expect(queryByText("Campo obrigatório")).toBeNull();
    });

    it("não exibe mensagem de erro quando error não é passado", () => {
      const { queryByTestId } = render(<Input />);
      expect(queryByTestId("error-text")).toBeNull();
    });

    it("exibe o valor atual", () => {
      const { getByDisplayValue } = render(<Input value="João" />);
      expect(getByDisplayValue("João")).toBeTruthy();
    });
  });

  describe("interação", () => {
    it("chama onChangeText ao digitar", () => {
      const onChangeText = jest.fn();
      const { getByDisplayValue } = render(
        <Input value="teste" onChangeText={onChangeText} />,
      );
      fireEvent.changeText(getByDisplayValue("teste"), "novo valor");
      expect(onChangeText).toHaveBeenCalledWith("novo valor");
    });

    it("chama onChangeText com string vazia", () => {
      const onChangeText = jest.fn();
      const { getByDisplayValue } = render(
        <Input value="abc" onChangeText={onChangeText} />,
      );
      fireEvent.changeText(getByDisplayValue("abc"), "");
      expect(onChangeText).toHaveBeenCalledWith("");
    });
  });

  describe("foco", () => {
    it("não lança erro ao focar no input", () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Digite aqui" />,
      );
      expect(() =>
        fireEvent(getByPlaceholderText("Digite aqui"), "onFocus"),
      ).not.toThrow();
    });

    it("não lança erro ao perder foco", () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Digite aqui" />,
      );
      expect(() =>
        fireEvent(getByPlaceholderText("Digite aqui"), "onBlur"),
      ).not.toThrow();
    });
  });
});
