jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));
jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { saveMember, getStoredMember, removeMember } from "@/storage/asyncStorage";
import { IMemberWithContribution } from "@/types/Member";

const mockedAsync = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedSecure = SecureStore as jest.Mocked<typeof SecureStore>;

const makeMember = (): IMemberWithContribution => ({
  _id: "abc123",
  firstName: "João",
  lastName: "Silva",
  bio: "Bio do João",
  role: "user",
  email: "joao@email.com",
  phoneNumber: "11999991234",
  dateOfBirth: 946684800,
  address: { street: "Rua A", number: "10", city: "SP", state: "SP", zip: "01001-000" },
  paymentInfo: { datePayment: 1735689600, amount: "50" },
  identification: { type: "CPF", numberType: "52998224725" },
  contributions: {
    year: 2026,
    months: {
      january: { paid: true, value: 50, paidAt: "2026-01-10" },
      february: { paid: false, value: 50, paidAt: "" },
      march: { paid: false, value: 50, paidAt: "" },
      april: { paid: false, value: 50, paidAt: "" },
      may: { paid: false, value: 50, paidAt: "" },
      june: { paid: false, value: 50, paidAt: "" },
      july: { paid: false, value: 50, paidAt: "" },
      august: { paid: false, value: 50, paidAt: "" },
      september: { paid: false, value: 50, paidAt: "" },
      october: { paid: false, value: 50, paidAt: "" },
      november: { paid: false, value: 50, paidAt: "" },
      december: { paid: false, value: 50, paidAt: "" },
    },
  },
});

describe("asyncStorage", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("saveMember", () => {
    it("salva dados sensíveis no SecureStore", async () => {
      mockedAsync.setItem.mockResolvedValue(undefined);
      mockedSecure.setItemAsync.mockResolvedValue(undefined);

      await saveMember(makeMember());

      const sensitiveArg = JSON.parse(
        (mockedSecure.setItemAsync as jest.Mock).mock.calls[0][1],
      );
      expect(sensitiveArg).toMatchObject({
        email: "joao@email.com",
        phoneNumber: "11999991234",
        identification: { type: "CPF", numberType: "52998224725" },
        paymentInfo: { amount: "50" },
        dateOfBirth: 946684800,
      });
    });

    it("salva dados públicos no AsyncStorage", async () => {
      mockedAsync.setItem.mockResolvedValue(undefined);
      mockedSecure.setItemAsync.mockResolvedValue(undefined);

      await saveMember(makeMember());

      const publicArg = JSON.parse(
        (mockedAsync.setItem as jest.Mock).mock.calls[0][1],
      );
      expect(publicArg).toMatchObject({
        _id: "abc123",
        firstName: "João",
        lastName: "Silva",
        bio: "Bio do João",
        role: "user",
      });
    });

    it("não inclui campos sensíveis nos dados públicos", async () => {
      mockedAsync.setItem.mockResolvedValue(undefined);
      mockedSecure.setItemAsync.mockResolvedValue(undefined);

      await saveMember(makeMember());

      const publicArg = JSON.parse(
        (mockedAsync.setItem as jest.Mock).mock.calls[0][1],
      );
      expect(publicArg.email).toBeUndefined();
      expect(publicArg.phoneNumber).toBeUndefined();
      expect(publicArg.identification).toBeUndefined();
    });

    it("não inclui campos públicos nos dados sensíveis", async () => {
      mockedAsync.setItem.mockResolvedValue(undefined);
      mockedSecure.setItemAsync.mockResolvedValue(undefined);

      await saveMember(makeMember());

      const sensitiveArg = JSON.parse(
        (mockedSecure.setItemAsync as jest.Mock).mock.calls[0][1],
      );
      expect(sensitiveArg._id).toBeUndefined();
      expect(sensitiveArg.firstName).toBeUndefined();
      expect(sensitiveArg.contributions).toBeUndefined();
    });
  });

  describe("getStoredMember", () => {
    it("reconstitui o membro completo unindo público e sensível", async () => {
      const member = makeMember();
      const sensitive = {
        email: member.email,
        phoneNumber: member.phoneNumber,
        identification: member.identification,
        paymentInfo: member.paymentInfo,
        dateOfBirth: member.dateOfBirth,
        address: member.address,
      };
      const publicData = {
        _id: member._id,
        firstName: member.firstName,
        lastName: member.lastName,
        bio: member.bio,
        role: member.role,
        contributions: member.contributions,
      };

      mockedAsync.getItem.mockResolvedValue(JSON.stringify(publicData));
      mockedSecure.getItemAsync.mockResolvedValue(JSON.stringify(sensitive));

      const result = await getStoredMember();

      expect(result?._id).toBe("abc123");
      expect(result?.email).toBe("joao@email.com");
      expect(result?.firstName).toBe("João");
      expect(result?.identification.type).toBe("CPF");
    });

    it("retorna null quando AsyncStorage está vazio", async () => {
      mockedAsync.getItem.mockResolvedValue(null);
      mockedSecure.getItemAsync.mockResolvedValue(JSON.stringify({ email: "x" }));

      const result = await getStoredMember();

      expect(result).toBeNull();
    });

    it("retorna null quando SecureStore está vazio", async () => {
      mockedAsync.getItem.mockResolvedValue(JSON.stringify({ _id: "x" }));
      mockedSecure.getItemAsync.mockResolvedValue(null);

      const result = await getStoredMember();

      expect(result).toBeNull();
    });

    it("retorna null quando ambos estão vazios", async () => {
      mockedAsync.getItem.mockResolvedValue(null);
      mockedSecure.getItemAsync.mockResolvedValue(null);

      const result = await getStoredMember();

      expect(result).toBeNull();
    });
  });

  describe("removeMember", () => {
    it("remove do AsyncStorage e do SecureStore simultaneamente", async () => {
      mockedAsync.removeItem.mockResolvedValue(undefined);
      mockedSecure.deleteItemAsync.mockResolvedValue(undefined);

      await removeMember();

      expect(mockedAsync.removeItem).toHaveBeenCalledTimes(1);
      expect(mockedSecure.deleteItemAsync).toHaveBeenCalledTimes(1);
    });

    it("remove a chave correta do AsyncStorage", async () => {
      mockedAsync.removeItem.mockResolvedValue(undefined);
      mockedSecure.deleteItemAsync.mockResolvedValue(undefined);

      await removeMember();

      expect(mockedAsync.removeItem).toHaveBeenCalledWith("@auth:member_public");
    });

    it("remove a chave correta do SecureStore", async () => {
      mockedAsync.removeItem.mockResolvedValue(undefined);
      mockedSecure.deleteItemAsync.mockResolvedValue(undefined);

      await removeMember();

      expect(mockedSecure.deleteItemAsync).toHaveBeenCalledWith(
        "auth_member_sensitive",
      );
    });
  });
});
