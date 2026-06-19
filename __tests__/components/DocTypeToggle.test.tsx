jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: {
      primary: "#6B4F3A",
      text: "#000",
      border: "#ccc",
    },
  }),
}));

import React from "react";
import { TouchableOpacity } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";
import { DocTypeToggle } from "@/components/DocTypeToggle";

describe("DocTypeToggle", () => {
  describe("renderização", () => {
    it("exibe as opções CPF e CNPJ", () => {
      const { getByText } = render(
        <DocTypeToggle value="CPF" onChange={jest.fn()} />,
      );
      expect(getByText("CPF")).toBeTruthy();
      expect(getByText("CNPJ")).toBeTruthy();
    });

    it("renderiza exatamente dois botões", () => {
      const { UNSAFE_getAllByType } = render(
        <DocTypeToggle value="CPF" onChange={jest.fn()} />,
      );
      expect(UNSAFE_getAllByType(TouchableOpacity)).toHaveLength(2);
    });
  });

  describe("seleção visual", () => {
    it("aplica backgroundColor primary no botão CPF quando value é CPF", () => {
      const { UNSAFE_getAllByType } = render(
        <DocTypeToggle value="CPF" onChange={jest.fn()} />,
      );
      const [cpfButton] = UNSAFE_getAllByType(TouchableOpacity);
      const flatStyles = [cpfButton.props.style].flat();
      const hasActiveColor = flatStyles.some(
        (s: any) => s && s.backgroundColor === "#6B4F3A",
      );
      expect(hasActiveColor).toBe(true);
    });

    it("não aplica backgroundColor primary no botão CNPJ quando value é CPF", () => {
      const { UNSAFE_getAllByType } = render(
        <DocTypeToggle value="CPF" onChange={jest.fn()} />,
      );
      const [, cnpjButton] = UNSAFE_getAllByType(TouchableOpacity);
      const flatStyles = [cnpjButton.props.style].flat();
      const hasActiveColor = flatStyles.some(
        (s: any) => s && s.backgroundColor === "#6B4F3A",
      );
      expect(hasActiveColor).toBe(false);
    });

    it("aplica backgroundColor primary no botão CNPJ quando value é CNPJ", () => {
      const { UNSAFE_getAllByType } = render(
        <DocTypeToggle value="CNPJ" onChange={jest.fn()} />,
      );
      const [, cnpjButton] = UNSAFE_getAllByType(TouchableOpacity);
      const flatStyles = [cnpjButton.props.style].flat();
      const hasActiveColor = flatStyles.some(
        (s: any) => s && s.backgroundColor === "#6B4F3A",
      );
      expect(hasActiveColor).toBe(true);
    });

    it("não aplica backgroundColor primary no botão CPF quando value é CNPJ", () => {
      const { UNSAFE_getAllByType } = render(
        <DocTypeToggle value="CNPJ" onChange={jest.fn()} />,
      );
      const [cpfButton] = UNSAFE_getAllByType(TouchableOpacity);
      const flatStyles = [cpfButton.props.style].flat();
      const hasActiveColor = flatStyles.some(
        (s: any) => s && s.backgroundColor === "#6B4F3A",
      );
      expect(hasActiveColor).toBe(false);
    });

    it("aplica textActive (branco) no texto do tipo selecionado", () => {
      const { getByText } = render(
        <DocTypeToggle value="CPF" onChange={jest.fn()} />,
      );
      const cpfText = getByText("CPF");
      const flatStyles = [cpfText.props.style].flat();
      const hasWhite = flatStyles.some((s: any) => s && s.color === "#FFF");
      expect(hasWhite).toBe(true);
    });

    it("não aplica textActive no texto do tipo não selecionado", () => {
      const { getByText } = render(
        <DocTypeToggle value="CPF" onChange={jest.fn()} />,
      );
      const cnpjText = getByText("CNPJ");
      const flatStyles = [cnpjText.props.style].flat();
      const hasWhite = flatStyles.some((s: any) => s && s.color === "#FFF");
      expect(hasWhite).toBe(false);
    });
  });

  describe("interação", () => {
    it("chama onChange com 'CNPJ' ao pressionar CNPJ", () => {
      const onChange = jest.fn();
      const { getByText } = render(
        <DocTypeToggle value="CPF" onChange={onChange} />,
      );
      fireEvent.press(getByText("CNPJ"));
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith("CNPJ");
    });

    it("chama onChange com 'CPF' ao pressionar CPF", () => {
      const onChange = jest.fn();
      const { getByText } = render(
        <DocTypeToggle value="CNPJ" onChange={onChange} />,
      );
      fireEvent.press(getByText("CPF"));
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith("CPF");
    });

    it("chama onChange ao pressionar o tipo já selecionado", () => {
      const onChange = jest.fn();
      const { getByText } = render(
        <DocTypeToggle value="CPF" onChange={onChange} />,
      );
      fireEvent.press(getByText("CPF"));
      expect(onChange).toHaveBeenCalledWith("CPF");
    });

    it("não chama onChange antes de qualquer interação", () => {
      const onChange = jest.fn();
      render(<DocTypeToggle value="CPF" onChange={onChange} />);
      expect(onChange).not.toHaveBeenCalled();
    });

    it("chama onChange apenas uma vez por press", () => {
      const onChange = jest.fn();
      const { getByText } = render(
        <DocTypeToggle value="CPF" onChange={onChange} />,
      );
      fireEvent.press(getByText("CNPJ"));
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("borderColor do container", () => {
    it("aplica borderColor do tema no container", () => {
      const { UNSAFE_getByType } = render(
        <DocTypeToggle value="CPF" onChange={jest.fn()} />,
      );
      const view = UNSAFE_getByType(require("react-native").View);
      const flatStyles = [view.props.style].flat();
      const hasBorderColor = flatStyles.some(
        (s: any) => s && s.borderColor === "#ccc",
      );
      expect(hasBorderColor).toBe(true);
    });
  });
});
