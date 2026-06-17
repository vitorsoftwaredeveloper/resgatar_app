jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A" },
    mode: "light",
  }),
}));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { IconButton } from "@/components/IconButton";

const MockIcon = () => null;

describe("IconButton", () => {
  it("chama onPress ao pressionar", () => {
    const onPress = jest.fn();
    const { UNSAFE_getByType } = render(
      <IconButton onPress={onPress} icon={MockIcon} color="#000" />,
    );
    fireEvent.press(UNSAFE_getByType("TouchableOpacity" as any));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("não chama onPress sem interação", () => {
    const onPress = jest.fn();
    render(<IconButton onPress={onPress} icon={MockIcon} color="#000" />);
    expect(onPress).not.toHaveBeenCalled();
  });
});
