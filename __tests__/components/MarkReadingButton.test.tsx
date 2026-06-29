jest.mock("lucide-react-native", () => ({ Flame: () => null }));
jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", white: "#FFF" },
    mode: "light",
  }),
}));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MarkReadingButton } from "@/components/MarkReadingButton";

describe("MarkReadingButton", () => {
  it("renderiza o texto do botão", () => {
    const { getByText } = render(<MarkReadingButton onPress={jest.fn()} />);
    expect(getByText("Marcar leitura como feita?")).toBeTruthy();
  });

  it("chama onPress ao ser pressionado", () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(<MarkReadingButton onPress={onPress} />);
    fireEvent.press(getByLabelText("Marcar leitura como feita"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("fica desabilitado quando loading=true", () => {
    const { getByLabelText } = render(<MarkReadingButton onPress={jest.fn()} loading />);
    const btn = getByLabelText("Marcar leitura como feita");
    // O mock de TouchableOpacity expõe accessibilityState: { disabled: true }
    expect(btn.props.accessibilityState?.disabled).toBe(true);
  });

  it("exibe ActivityIndicator quando loading=true", () => {
    const { UNSAFE_getByType } = render(
      <MarkReadingButton onPress={jest.fn()} loading />,
    );
    expect(UNSAFE_getByType("ActivityIndicator" as any)).toBeTruthy();
  });

  it("o texto é sempre visível (mesmo durante loading)", () => {
    const { getByText } = render(<MarkReadingButton onPress={jest.fn()} loading />);
    expect(getByText("Marcar leitura como feita?")).toBeTruthy();
  });

  it("tem accessibilityLabel correto", () => {
    const { getByLabelText } = render(<MarkReadingButton onPress={jest.fn()} />);
    expect(getByLabelText("Marcar leitura como feita")).toBeTruthy();
  });
});
