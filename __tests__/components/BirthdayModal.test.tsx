const mockListBirthdayMembers = jest.fn();

jest.mock("@/services/MemberService", () => ({
  MemberServices: { listBirthdayMembers: (...args: any[]) => mockListBirthdayMembers(...args) },
}));
jest.mock("lucide-react-native", () => ({ Cake: () => null }));
jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", text: "#3E2F23", textMuted: "#8C7A6B", card: "#FFF", border: "#DED6CC" },
    mode: "light",
  }),
}));
jest.mock("@/components/Avatar", () => {
  const React = require("react");
  return { Avatar: () => React.createElement("View", null) };
});
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 0, top: 0, left: 0, right: 0 }),
}));

import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { BirthdayModal } from "@/components/BirthdayModal";

function makeMember(id: string, firstName: string, lastName: string, month: number, day: number) {
  const date = new Date(Date.UTC(1990, month, day));
  return {
    _id: id,
    firstName,
    lastName,
    dateOfBirth: date.getTime(),
    email: "",
    phoneNumber: "",
    paymentInfo: { datePayment: 1, amount: "0" },
    identification: { type: "CPF", numberType: "" },
  };
}

describe("BirthdayModal", () => {
  beforeEach(() => jest.clearAllMocks());

  it("não renderiza quando visible=false", () => {
    mockListBirthdayMembers.mockResolvedValue([]);
    const { queryByText } = render(
      <BirthdayModal visible={false} onClose={jest.fn()} />,
    );
    expect(queryByText("Aniversariantes do mês")).toBeNull();
  });

  it("renderiza o título quando visible=true", async () => {
    mockListBirthdayMembers.mockResolvedValue([]);
    const { getByText } = render(
      <BirthdayModal visible={true} onClose={jest.fn()} />,
    );
    await waitFor(() => expect(getByText("Aniversariantes do mês")).toBeTruthy());
  });

  it("exibe mensagem de vazio quando não há aniversariantes no mês", async () => {
    mockListBirthdayMembers.mockResolvedValue([]);
    const { getByText } = render(
      <BirthdayModal visible={true} onClose={jest.fn()} />,
    );
    await waitFor(() =>
      expect(getByText("Nenhum aniversariante neste mês")).toBeTruthy(),
    );
  });

  it("exibe nome do membro com aniversário neste mês", async () => {
    const now = new Date();
    const member = makeMember("m1", "Ana", "Lima", now.getUTCMonth(), 5);
    mockListBirthdayMembers.mockResolvedValue([member]);
    const { getByText } = render(
      <BirthdayModal visible={true} onClose={jest.fn()} />,
    );
    await waitFor(() => expect(getByText("Ana Lima")).toBeTruthy());
  });

  it("exibe '🎉 Hoje!' para aniversário no dia atual (UTC)", async () => {
    const now = new Date();
    const member = makeMember("m1", "Vitor", "Silva", now.getUTCMonth(), now.getUTCDate());
    mockListBirthdayMembers.mockResolvedValue([member]);
    const { getByText } = render(
      <BirthdayModal visible={true} onClose={jest.fn()} />,
    );
    await waitFor(() => expect(getByText("🎉 Hoje!")).toBeTruthy());
  });
});
