jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { card: "#FFF", text: "#000", textMuted: "#999", border: "#ccc" },
    mode: "light",
  }),
}));

import React from "react";
import { render } from "@testing-library/react-native";
import { Card } from "@/components/Card";

describe("Card", () => {
  it("exibe o título", () => {
    const { getByText } = render(<Card title="Meu Card" />);
    expect(getByText("Meu Card")).toBeTruthy();
  });

  it("exibe a descrição quando fornecida", () => {
    const { getByText } = render(
      <Card title="Título" description="Descrição do card" />,
    );
    expect(getByText("Descrição do card")).toBeTruthy();
  });

  it("não exibe descrição quando não fornecida", () => {
    const { queryByText } = render(<Card title="Título" />);
    expect(queryByText("Descrição do card")).toBeNull();
  });

  it("renderiza children", () => {
    const { getByText } = render(
      <Card title="Título">
        <React.Fragment>
          {React.createElement("Text" as any, null, "Conteúdo filho")}
        </React.Fragment>
      </Card>,
    );
    expect(getByText("Conteúdo filho")).toBeTruthy();
  });
});
