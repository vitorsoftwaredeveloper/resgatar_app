const mockListBirthdayMembers = jest.fn();

jest.mock("@/services/MemberService", () => ({
  MemberServices: { listBirthdayMembers: (...args: any[]) => mockListBirthdayMembers(...args) },
}));

import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import { BirthdayProvider, useBirthday } from "@/context/BirthdayContext";

function makeMember(id: string, utcMonth: number, utcDay: number) {
  return {
    _id: id,
    firstName: "Test",
    lastName: "User",
    dateOfBirth: Date.UTC(1990, utcMonth, utcDay),
    email: "",
    phoneNumber: "",
    paymentInfo: { datePayment: 1, amount: "0" },
    identification: { type: "CPF", numberType: "" },
  };
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BirthdayProvider>{children}</BirthdayProvider>
);

describe("BirthdayContext", () => {
  beforeEach(() => jest.clearAllMocks());

  it("começa com todayBirthdays=0", () => {
    mockListBirthdayMembers.mockResolvedValue([]);
    const { result } = renderHook(() => useBirthday(), { wrapper });
    expect(result.current.todayBirthdays).toBe(0);
  });

  it("conta membros com aniversário hoje", async () => {
    const now = new Date();
    const m1 = makeMember("m1", now.getUTCMonth(), now.getUTCDate());
    const m2 = makeMember("m2", now.getUTCMonth(), now.getUTCDate());
    mockListBirthdayMembers.mockResolvedValue([m1, m2]);

    const { result } = renderHook(() => useBirthday(), { wrapper });
    await act(async () => { await Promise.resolve(); });
    expect(result.current.todayBirthdays).toBe(2);
  });

  it("não conta membros com aniversário em outro dia", async () => {
    const now = new Date();
    const otherDay = now.getUTCDate() === 1 ? 2 : 1;
    const m1 = makeMember("m1", now.getUTCMonth(), otherDay);
    mockListBirthdayMembers.mockResolvedValue([m1]);

    const { result } = renderHook(() => useBirthday(), { wrapper });
    await act(async () => { await Promise.resolve(); });
    expect(result.current.todayBirthdays).toBe(0);
  });

  it("mantém 0 quando a API falha", async () => {
    mockListBirthdayMembers.mockRejectedValue(new Error("network"));

    const { result } = renderHook(() => useBirthday(), { wrapper });
    await act(async () => { await Promise.resolve(); });
    expect(result.current.todayBirthdays).toBe(0);
  });

  it("ignora membros sem dateOfBirth", async () => {
    mockListBirthdayMembers.mockResolvedValue([
      { _id: "m1", firstName: "X", dateOfBirth: null },
    ]);

    const { result } = renderHook(() => useBirthday(), { wrapper });
    await act(async () => { await Promise.resolve(); });
    expect(result.current.todayBirthdays).toBe(0);
  });
});
