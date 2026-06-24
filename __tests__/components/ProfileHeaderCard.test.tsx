jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", text: "#000", textMuted: "#999", card: "#FFF" },
    mode: "light",
  }),
}));
jest.mock("lucide-react-native", () => ({ UserRound: () => null }));
jest.mock("@/context/CoachContext", () => ({
  useCoach: () => ({ registerTarget: jest.fn(), unregisterTarget: jest.fn() }),
}));
jest.mock("@/components/CoachTarget", () => {
  const React = require("react");
  return { CoachTarget: ({ children }: any) => children };
});

import React from "react";
import { render } from "@testing-library/react-native";
import { ProfileHeaderCard } from "@/components/ProfileHeaderCard";

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

describe("ProfileHeaderCard", () => {
  it("exibe o nome completo do membro", () => {
    const { getByText } = render(<ProfileHeaderCard member={member} />);
    expect(getByText("João Silva")).toBeTruthy();
  });

  it("exibe o email do membro", () => {
    const { getByText } = render(<ProfileHeaderCard member={member} />);
    expect(getByText("joao@email.com")).toBeTruthy();
  });

  it("exibe o CPF formatado", () => {
    const { getByText } = render(<ProfileHeaderCard member={member} />);
    expect(getByText("529.982.247-25")).toBeTruthy();
  });

  it("exibe CNPJ formatado quando tipo é CNPJ", () => {
    const memberCnpj = {
      ...member,
      identification: { type: "CNPJ" as const, numberType: "11222333000181" },
    };
    const { getByText } = render(<ProfileHeaderCard member={memberCnpj} />);
    expect(getByText("11.222.333/0001-81")).toBeTruthy();
  });
});
