jest.mock("lucide-react-native", () => ({
  ChevronDown: () => null,
  ChevronUp: () => null,
  Check: () => null,
}));
jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: {
      primary: "#6B4F3A",
      text: "#3E2F23",
      textMuted: "#8C7A6B",
      error: "#E53935",
      border: "#DED6CC",
      card: "#FFF",
      inputBg: "#F6F1EB",
      muted: "#8C7A6B",
    },
    mode: "light",
  }),
}));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SelectField } from "@/components/SelectField";

const options = [
  { label: "Opção A", value: "a" },
  { label: "Opção B", value: "b" },
  { label: "Opção C", value: "c" },
];

// Helper: simula measureInWindow no View aninhado do anchorRef
function mockMeasure(node: any) {
  if (!node) return;
  const inner = node?.children?.[0]?.children?.[0];
  if (inner && !inner.measureInWindow) {
    inner.measureInWindow = (cb: any) => cb(0, 100, 200, 50);
  }
}

describe("SelectField", () => {
  it("exibe o placeholder quando nenhum valor está selecionado", () => {
    const { getByText } = render(
      <SelectField value={null} options={options} onSelect={jest.fn()} placeholder="Escolha..." />,
    );
    expect(getByText("Escolha...")).toBeTruthy();
  });

  it("exibe o label do valor selecionado", () => {
    const { getByText } = render(
      <SelectField value="b" options={options} onSelect={jest.fn()} />,
    );
    expect(getByText("Opção B")).toBeTruthy();
  });

  it("exibe o label quando informado", () => {
    const { getByText } = render(
      <SelectField label="Categoria" value={null} options={options} onSelect={jest.fn()} />,
    );
    expect(getByText("Categoria")).toBeTruthy();
  });

  it("exibe mensagem de erro quando error é informado", () => {
    const { getByText } = render(
      <SelectField value={null} options={options} onSelect={jest.fn()} error="Campo obrigatório" />,
    );
    expect(getByText("Campo obrigatório")).toBeTruthy();
  });

  it("não exibe erro quando error é false", () => {
    const { queryByText } = render(
      <SelectField value={null} options={options} onSelect={jest.fn()} error={false} />,
    );
    expect(queryByText("Campo obrigatório")).toBeNull();
  });

  it("exibe placeholder padrão 'Selecionar' quando placeholder não é informado", () => {
    const { getByText } = render(
      <SelectField value={null} options={options} onSelect={jest.fn()} />,
    );
    expect(getByText("Selecionar")).toBeTruthy();
  });

  it("não exibe opções na lista antes de abrir", () => {
    const { queryByText } = render(
      <SelectField value={null} options={options} onSelect={jest.fn()} />,
    );
    // Modal começa fechado (visible=false)
    expect(queryByText("Opção A")).toBeNull();
  });
});
