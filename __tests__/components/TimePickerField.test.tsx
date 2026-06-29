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
import { render } from "@testing-library/react-native";
import { TimePickerField } from "@/components/TimePickerField";

describe("TimePickerField", () => {
  it("renderiza o label quando informado", () => {
    const { getByText } = render(
      <TimePickerField label="Horário" value="" onChange={jest.fn()} />,
    );
    expect(getByText("Horário")).toBeTruthy();
  });

  it("exibe placeholder de hora quando value está vazio", () => {
    const { getByText } = render(
      <TimePickerField value="" onChange={jest.fn()} />,
    );
    expect(getByText("Hora")).toBeTruthy();
  });

  it("exibe placeholder de minuto quando value está vazio", () => {
    const { getByText } = render(
      <TimePickerField value="" onChange={jest.fn()} />,
    );
    expect(getByText("Min")).toBeTruthy();
  });

  it("pré-seleciona hora a partir do value '19h'", () => {
    const { getAllByText } = render(
      <TimePickerField value="19h" onChange={jest.fn()} />,
    );
    // "19h" deve aparecer como valor selecionado do SelectField de hora
    expect(getAllByText("19h").length).toBeGreaterThanOrEqual(1);
  });

  it("não renderiza o label quando não informado", () => {
    const { queryByText } = render(
      <TimePickerField value="" onChange={jest.fn()} />,
    );
    // Sem label, não há texto de label
    expect(queryByText("Horário")).toBeNull();
  });

  it("renderiza dois selects (hora e minuto)", () => {
    // SelectField usa "Selecionar" como placeholder padrão — mas aqui passamos "Hora" e "Min"
    const { getByText } = render(
      <TimePickerField value="" onChange={jest.fn()} />,
    );
    expect(getByText("Hora")).toBeTruthy();
    expect(getByText("Min")).toBeTruthy();
  });
});
