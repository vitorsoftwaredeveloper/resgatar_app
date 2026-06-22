jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", background: "#F6F1EB", card: "#FFF", white: "#FFF" },
    mode: "light",
  }),
}));
jest.mock("lucide-react-native", () => {
  const React = require("react");
  return {
    UserRound: (props: any) => React.createElement("UserRound", props),
    Camera: (props: any) => React.createElement("Camera", props),
  };
});

import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { Avatar } from "@/components/Avatar";

describe("Avatar", () => {
  describe("imagem x placeholder", () => {
    it("renderiza a imagem quando há foto válida", () => {
      const { UNSAFE_getByType, UNSAFE_queryByType } = render(
        <Avatar photo="data:image/png;base64,iVBORw0KGgo=" />,
      );
      const image = UNSAFE_getByType("Image" as any);
      expect(image.props.source.uri).toBe("data:image/png;base64,iVBORw0KGgo=");
      expect(UNSAFE_queryByType("UserRound" as any)).toBeNull();
    });

    it("monta o data URI a partir de base64 cru", () => {
      const { UNSAFE_getByType } = render(<Avatar photo="AAAABBBBCCCC" />);
      expect(UNSAFE_getByType("Image" as any).props.source.uri).toBe(
        "data:image/jpeg;base64,AAAABBBBCCCC",
      );
    });

    it("renderiza o placeholder UserRound quando não há foto", () => {
      const { UNSAFE_getByType, UNSAFE_queryByType } = render(<Avatar />);
      expect(UNSAFE_getByType("UserRound" as any)).toBeTruthy();
      expect(UNSAFE_queryByType("Image" as any)).toBeNull();
    });

    it("renderiza o placeholder quando o base64 é inválido", () => {
      const { UNSAFE_getByType } = render(<Avatar photo="not valid!!" />);
      expect(UNSAFE_getByType("UserRound" as any)).toBeTruthy();
    });
  });

  describe("selo de câmera (editable)", () => {
    it("mostra o selo quando editable", () => {
      const { UNSAFE_getByType } = render(<Avatar editable />);
      expect(UNSAFE_getByType("Camera" as any)).toBeTruthy();
    });

    it("não mostra o selo quando não editable", () => {
      const { UNSAFE_queryByType } = render(<Avatar />);
      expect(UNSAFE_queryByType("Camera" as any)).toBeNull();
    });
  });

  describe("interação", () => {
    it("envolve em TouchableOpacity e dispara onPress", () => {
      const onPress = jest.fn();
      const { UNSAFE_getByType } = render(<Avatar onPress={onPress} />);
      fireEvent.press(UNSAFE_getByType("TouchableOpacity" as any));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("não renderiza TouchableOpacity sem onPress", () => {
      const { UNSAFE_queryByType } = render(<Avatar />);
      expect(UNSAFE_queryByType("TouchableOpacity" as any)).toBeNull();
    });
  });
});
