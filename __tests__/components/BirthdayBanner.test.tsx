// BirthdayBanner usa __DEV__ que não existe no ambiente node
(global as any).__DEV__ = false;

const mockListMembers = jest.fn();

jest.mock("@/services/MemberService", () => ({
  MemberServices: { listMembers: (...args: any[]) => mockListMembers(...args) },
}));
jest.mock("lucide-react-native", () => ({
  Cake: () => null,
  PartyPopper: () => null,
}));
jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", text: "#3E2F23", textMuted: "#8C7A6B" },
    mode: "light",
  }),
}));
jest.mock("@/components/Avatar", () => {
  const React = require("react");
  return { Avatar: () => React.createElement("View", null) };
});

import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { BirthdayBanner } from "@/components/BirthdayBanner";

function makeMember(id: string, firstName: string, month: number, day: number) {
  return {
    _id: id,
    firstName,
    lastName: "Teste",
    dateOfBirth: new Date(1990, month, day).getTime(),
    email: "",
    phoneNumber: "",
    paymentInfo: { datePayment: 1, amount: "0" },
    identification: { type: "CPF", numberType: "" },
  };
}

describe("BirthdayBanner", () => {
  beforeEach(() => jest.clearAllMocks());

  it("mostra estado vazio quando não há aniversariantes no mês", async () => {
    mockListMembers.mockResolvedValue([]);
    const { getByText } = render(<BirthdayBanner />);
    await waitFor(() =>
      expect(getByText("Nenhum aniversariante este mês")).toBeTruthy(),
    );
  });

  it("exibe o cabeçalho quando há aniversariantes", async () => {
    const now = new Date();
    const member = makeMember("m1", "Ana", now.getMonth(), now.getDate());
    mockListMembers.mockResolvedValue([member]);
    const { getByText } = render(<BirthdayBanner />);
    await waitFor(() =>
      expect(getByText("ANIVERSARIANTES DO MÊS")).toBeTruthy(),
    );
  });

  it("exibe o nome do aniversariante", async () => {
    const now = new Date();
    const member = makeMember("m1", "Carlos", now.getMonth(), 5);
    mockListMembers.mockResolvedValue([member]);
    const { getByText } = render(<BirthdayBanner />);
    await waitFor(() => expect(getByText("Carlos")).toBeTruthy());
  });

  it("exibe 'hoje!' para aniversário no dia atual", async () => {
    const now = new Date();
    const member = makeMember("m1", "Vitor", now.getMonth(), now.getDate());
    mockListMembers.mockResolvedValue([member]);
    const { getByText } = render(<BirthdayBanner />);
    await waitFor(() => expect(getByText("hoje!")).toBeTruthy());
  });

  it("exibe 'dia X' para aniversário em outro dia do mês", async () => {
    const now = new Date();
    // Usa dia 1 para evitar coincidência com o dia atual
    const day = now.getDate() === 1 ? 2 : 1;
    const member = makeMember("m1", "Maria", now.getMonth(), day);
    mockListMembers.mockResolvedValue([member]);
    const { getByText } = render(<BirthdayBanner />);
    await waitFor(() => expect(getByText(`dia ${day}`)).toBeTruthy());
  });

  it("mostra estado vazio em caso de erro na API", async () => {
    mockListMembers.mockRejectedValue(new Error("network"));
    const { getByText } = render(<BirthdayBanner />);
    await waitFor(() =>
      expect(getByText("Nenhum aniversariante este mês")).toBeTruthy(),
    );
  });
});
