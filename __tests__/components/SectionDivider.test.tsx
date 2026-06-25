jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", border: "#DED6CC" },
    mode: "light",
  }),
}));

import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import { SectionDivider } from "@/components/SectionDivider";

describe("SectionDivider", () => {
  it("exibe o título", () => {
    const { getByText } = render(<SectionDivider title="Liturgia diária" />);
    expect(getByText("Liturgia diária")).toBeTruthy();
  });

  it("renderiza o ícone quando fornecido", () => {
    const { getByTestId, getByText } = render(
      <SectionDivider
        title="Liturgia diária"
        icon={<Text testID="divider-icon">+</Text>}
      />,
    );
    expect(getByTestId("divider-icon")).toBeTruthy();
    expect(getByText("Liturgia diária")).toBeTruthy();
  });

  it("renderiza sem ícone", () => {
    const { getByText } = render(<SectionDivider title="Nossas colaborações" />);
    expect(getByText("Nossas colaborações")).toBeTruthy();
  });
});
