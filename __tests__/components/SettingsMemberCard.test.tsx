jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", text: "#000", textMuted: "#999", card: "#FFF", error: "#E53935" },
    mode: "light",
  }),
}));
jest.mock("lucide-react-native", () => ({ User: () => null }));

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
