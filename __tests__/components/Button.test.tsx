jest.mock("@/hooks/useMaskedField", () => ({}));
jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", white: "#FFF", black: "#000", text: "#000", textMuted: "#999", border: "#ccc", inputBg: "#fff", card: "#fff", muted: "#999", error: "#E53935" },
    mode: "light",
  }),
}));

import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import { Button } from "@/components/Button";

describe("Button", () => {
  describe("renderização", () => {
    it("exibe o título", () => {
      const { getByText } = render(<Button title="Confirmar" />);
      expect(getByText("Confirmar")).toBeTruthy();
    });

    it("exibe ActivityIndicator quando loading externo é true", () => {
      const { queryByText, getByTestId } = render(
        <Button title="Salvar" loading={true} testID="btn" />,
      );
      expect(queryByText("Salvar")).toBeNull();
    });

    it("exibe o título quando loading é false", () => {
      const { getByText } = render(<Button title="Salvar" loading={false} />);
      expect(getByText("Salvar")).toBeTruthy();
    });
  });

  describe("onPress", () => {
    it("chama onPress ao pressionar", () => {
      const onPress = jest.fn();
      const { getByText } = render(<Button title="Clique" onPress={onPress} />);
      fireEvent.press(getByText("Clique"));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("não chama onPress quando loading externo está ativo", () => {
      const onPress = jest.fn();
      const { UNSAFE_getByType } = render(
        <Button title="Clique" onPress={onPress} loading={true} />,
      );
      fireEvent.press(UNSAFE_getByType("TouchableOpacity" as any));
      expect(onPress).not.toHaveBeenCalled();
    });

    it("não chama onPress quando loading externo é true", () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Button title="Clique" onPress={onPress} loading={true} testID="btn" />,
      );
      fireEvent.press(getByTestId("btn"));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe("loading interno para funções async", () => {
    it("aguarda a promise antes de liberar novo press", async () => {
      let resolve: () => void;
      const asyncOnPress = jest.fn(
        () => new Promise<void>((r) => { resolve = r; }),
      );

      const { getByText } = render(<Button title="Enviar" onPress={asyncOnPress} />);

      await act(async () => {
        fireEvent.press(getByText("Enviar"));
      });

      expect(asyncOnPress).toHaveBeenCalledTimes(1);

      await act(async () => { resolve!(); });
    });

    it("não dispara segundo press enquanto loading interno está ativo", async () => {
      let resolve: () => void;
      const asyncOnPress = jest.fn(
        () => new Promise<void>((r) => { resolve = r; }),
      );

      const { UNSAFE_getByType } = render(<Button title="Enviar" onPress={asyncOnPress} />);
      const touchable = UNSAFE_getByType("TouchableOpacity" as any);

      fireEvent.press(touchable);
      fireEvent.press(touchable);

      await act(async () => { resolve!(); });

      expect(asyncOnPress).toHaveBeenCalledTimes(1);
    });
  });

  describe("loading controlado externamente", () => {
    it("não ativa loading interno para onPress síncrono quando externalLoading é definido", () => {
      const onPress = jest.fn(() => {});
      const { getByText } = render(
        <Button title="Salvar" onPress={onPress} loading={false} />,
      );
      fireEvent.press(getByText("Salvar"));
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });
});
