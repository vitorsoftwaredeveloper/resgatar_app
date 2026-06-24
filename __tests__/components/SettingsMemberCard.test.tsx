jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", background: "#F6F1EB", card: "#FFF", white: "#FFF" },
    mode: "light",
  }),
}));
jest.mock("@/utils/image", () => ({
  resolveAvatarUri: (photo: string | null | undefined) => photo ?? null,
}));
jest.mock("lucide-react-native", () => {
  const React = require("react");
  return {
    UserRound: (props: any) => React.createElement("UserRound", props),
    Camera: (props: any) => React.createElement("Camera", props),
  };
});

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SettingsMemberCard } from "@/components/SettingsMemberCard";

const member = {
  _id: "1",
  email: "joao@email.com",
  phoneNumber: "11999991234",
  firstName: "João",
  lastName: "Silva",
  dateOfBirth: 0,
  paymentInfo: { datePayment: 0, amount: "50" },
  identification: { type: "CPF" as const, numberType: "52998224725" },
};

const memberWithPhoto = {
  ...member,
  profileImage: "data:image/png;base64,iVBORw0KGgo=",
};

describe("SettingsMemberCard", () => {
  const defaultProps = {
    member,
    onAction: jest.fn(),
    iconAction: null,
  };

  beforeEach(() => jest.clearAllMocks());

  it("exibe o nome do membro", () => {
    const { getByText } = render(<SettingsMemberCard {...defaultProps} />);
    expect(getByText("João")).toBeTruthy();
  });

  it("exibe o email do membro", () => {
    const { getByText } = render(<SettingsMemberCard {...defaultProps} />);
    expect(getByText("joao@email.com")).toBeTruthy();
  });

  it("renderiza o placeholder Avatar quando não há foto", () => {
    const { UNSAFE_getByType } = render(<SettingsMemberCard {...defaultProps} />);
    expect(UNSAFE_getByType("UserRound" as any)).toBeTruthy();
  });

  it("renderiza a imagem do Avatar quando há foto", () => {
    const { UNSAFE_getByType } = render(
      <SettingsMemberCard {...defaultProps} member={memberWithPhoto} />,
    );
    const image = UNSAFE_getByType("Image" as any);
    expect(image.props.source.uri).toBe("data:image/png;base64,iVBORw0KGgo=");
  });

  it("chama onAction com o membro ao pressionar o botão de ação", () => {
    const onAction = jest.fn();
    const { UNSAFE_getByType } = render(
      <SettingsMemberCard {...defaultProps} onAction={onAction} />,
    );
    fireEvent.press(UNSAFE_getByType("Pressable" as any));
    expect(onAction).toHaveBeenCalledWith(member);
  });

  it("chama onAction com variant delete", () => {
    const onAction = jest.fn();
    const { UNSAFE_getByType } = render(
      <SettingsMemberCard {...defaultProps} onAction={onAction} variant="delete" />,
    );
    fireEvent.press(UNSAFE_getByType("Pressable" as any));
    expect(onAction).toHaveBeenCalledWith(member);
  });
});
