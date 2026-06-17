jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", text: "#000", textMuted: "#999", border: "#ccc", inputBg: "#FFF", error: "#E53935" },
    mode: "light",
  }),
}));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TextArea } from "@/components/TextArea";

describe("TextArea", () => {
  it("exibe o label quando fornecido", () => {
    const { getByText } = render(<TextArea label="Observações" />);
    expect(getByText("Observações")).toBeTruthy();
  });

  it("não exibe label quando não fornecido", () => {
    const { queryByText } = render(<TextArea />);
    expect(queryByText("Observações")).toBeNull();
  });

  it("exibe mensagem de erro quando error é string", () => {
    const { getByText } = render(<TextArea error="Campo obrigatório" />);
    expect(getByText("Campo obrigatório")).toBeTruthy();
  });

  it("não exibe mensagem de erro quando error é false", () => {
    const { queryByText } = render(<TextArea error={false} />);
    expect(queryByText("Campo obrigatório")).toBeNull();
  });

  it("exibe o valor atual", () => {
    const { getByDisplayValue } = render(<TextArea value="Texto longo aqui" />);
    expect(getByDisplayValue("Texto longo aqui")).toBeTruthy();
  });

  it("chama onChangeText ao digitar", () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <TextArea value="inicial" onChangeText={onChangeText} />,
    );
    fireEvent.changeText(getByDisplayValue("inicial"), "novo texto");
    expect(onChangeText).toHaveBeenCalledWith("novo texto");
  });

  it("não lança erro ao focar e perder foco", () => {
    const { getByDisplayValue } = render(<TextArea value="abc" />);
    expect(() => fireEvent(getByDisplayValue("abc"), "onFocus")).not.toThrow();
    expect(() => fireEvent(getByDisplayValue("abc"), "onBlur")).not.toThrow();
  });
});
