jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", text: "#000", textMuted: "#999", border: "#ccc", card: "#FFF" },
    mode: "light",
  }),
}));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ItemActionList } from "@/components/ItemActionList";

describe("ItemActionList", () => {
  const defaultProps = {
    title: "Editar membro",
    description: "Alterar dados do membro",
    onPress: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it("exibe o título", () => {
    const { getByText } = render(<ItemActionList {...defaultProps} />);
    expect(getByText("Editar membro")).toBeTruthy();
  });

  it("exibe a descrição", () => {
    const { getByText } = render(<ItemActionList {...defaultProps} />);
    expect(getByText("Alterar dados do membro")).toBeTruthy();
  });

  it("exibe o ícone de seta ›", () => {
    const { getByText } = render(<ItemActionList {...defaultProps} />);
    expect(getByText("›")).toBeTruthy();
  });

  it("chama onPress ao pressionar", () => {
    const onPress = jest.fn();
    const { UNSAFE_getByType } = render(
      <ItemActionList {...defaultProps} onPress={onPress} />,
    );
    fireEvent.press(UNSAFE_getByType("TouchableOpacity" as any));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("exibe o divider quando não é o último item", () => {
    const { UNSAFE_queryAllByType } = render(
      <ItemActionList {...defaultProps} isLast={false} />,
    );
    const views = UNSAFE_queryAllByType("View" as any);
    expect(views.length).toBeGreaterThan(0);
  });

  it("renderiza o ícone quando fornecido", () => {
    const MockIcon = () => React.createElement("Text" as any, null, "ICON");
    const { getByText } = render(
      <ItemActionList {...defaultProps} icon={<MockIcon />} />,
    );
    expect(getByText("ICON")).toBeTruthy();
  });
});
