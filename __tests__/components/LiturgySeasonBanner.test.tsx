jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", text: "#000", textMuted: "#999", border: "#ccc", card: "#FFF" },
    mode: "light",
  }),
}));

import React from "react";
import { render } from "@testing-library/react-native";
import { LiturgySeasonBanner } from "@/components/LiturgySeasonBanner";

const baseProps = {
  liturgia: "Domingo da Ressurreição",
  data: "17/06/2026",
  cor: "Verde" as const,
};

describe("LiturgySeasonBanner", () => {
  it("exibe o título da liturgia", () => {
    const { getByText } = render(<LiturgySeasonBanner {...baseProps} />);
    expect(getByText("Domingo da Ressurreição")).toBeTruthy();
  });

  it("exibe 'LITURGIA DO DIA'", () => {
    const { getByText } = render(<LiturgySeasonBanner {...baseProps} />);
    expect(getByText("LITURGIA DO DIA")).toBeTruthy();
  });

  it("exibe a cor litúrgica", () => {
    const { getByText } = render(<LiturgySeasonBanner {...baseProps} />);
    expect(getByText("Verde")).toBeTruthy();
  });

  it("exibe a data formatada por extenso", () => {
    const { getByText } = render(<LiturgySeasonBanner {...baseProps} />);
    expect(getByText(/quarta/i)).toBeTruthy();
    expect(getByText(/junho/i)).toBeTruthy();
  });

  it("exibe o tipo em badge quando fornecido", () => {
    const { getByText } = render(
      <LiturgySeasonBanner {...baseProps} tipo="Festa" />,
    );
    expect(getByText("FESTA")).toBeTruthy();
  });

  it("não exibe badge quando tipo não é fornecido", () => {
    const { queryByText } = render(<LiturgySeasonBanner {...baseProps} />);
    expect(queryByText("FESTA")).toBeNull();
  });

  it("funciona com cor Roxo", () => {
    const { getByText } = render(
      <LiturgySeasonBanner {...baseProps} cor="Roxo" />,
    );
    expect(getByText("Roxo")).toBeTruthy();
  });
});
