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
import {
  saveMember,
  getStoredMember,
  removeMember,
  getLiturgyCache,
  setLiturgyCache,
} from "@/storage/asyncStorage";
import { IMemberWithContribution } from "@/types/Member";
import { ILiturgia } from "@/types/Liturgy";

const mockedAsync = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedSecure = SecureStore as jest.Mocked<typeof SecureStore>;

const makeMember = (): IMemberWithContribution => ({
  _id: "abc123",
  firstName: "João",
  lastName: "Silva",
  profileImage: "data:image/png;base64,AAAA",
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

    it("persiste a profileImage nos dados públicos (não no SecureStore)", async () => {
      mockedAsync.setItem.mockResolvedValue(undefined);
      mockedSecure.setItemAsync.mockResolvedValue(undefined);

      await saveMember(makeMember());

      const publicArg = JSON.parse(
        (mockedAsync.setItem as jest.Mock).mock.calls[0][1],
      );
      const sensitiveArg = JSON.parse(
        (mockedSecure.setItemAsync as jest.Mock).mock.calls[0][1],
      );

      expect(publicArg.profileImage).toBe("data:image/png;base64,AAAA");
      expect(sensitiveArg.profileImage).toBeUndefined();
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

  describe("setLiturgyCache", () => {
    const makeLiturgia = (): ILiturgia => ({
      data: "25/06/2026",
      liturgia: "Tempo Comum",
      cor: "Verde",
      leituras: {
        primeiraLeitura: { referencia: "Gn 1,1", titulo: "Criação", texto: "No princípio" },
        salmo: { referencia: "Sl 1", refrao: "Feliz o homem", texto: "Texto do salmo" },
        evangelho: { referencia: "Mt 1,1", titulo: "Genealogia", texto: "Texto do evangelho" },
      },
    });

    it("persiste com a chave no formato @liturgy:<dateKey>", async () => {
      mockedAsync.setItem.mockResolvedValue(undefined);

      await setLiturgyCache("2026-06-25", makeLiturgia());

      expect(mockedAsync.setItem).toHaveBeenCalledWith(
        "@liturgy:2026-06-25",
        expect.any(String),
      );
    });

    it("serializa os dados como JSON contendo os campos da liturgia", async () => {
      mockedAsync.setItem.mockResolvedValue(undefined);

      await setLiturgyCache("2026-06-25", makeLiturgia());

      const stored = (mockedAsync.setItem as jest.Mock).mock.calls[0][1] as string;
      expect(JSON.parse(stored)).toMatchObject({ data: "25/06/2026", cor: "Verde" });
    });
  });

  describe("getLiturgyCache", () => {
    const makeLiturgia = (): ILiturgia => ({
      data: "25/06/2026",
      liturgia: "Tempo Comum",
      cor: "Verde",
      leituras: {
        primeiraLeitura: { referencia: "Gn 1,1", titulo: "Criação", texto: "No princípio" },
        salmo: { referencia: "Sl 1", refrao: "Feliz o homem", texto: "Texto do salmo" },
        evangelho: { referencia: "Mt 1,1", titulo: "Genealogia", texto: "Texto do evangelho" },
      },
    });

    it("retorna os dados parseados quando há cache para a chave", async () => {
      mockedAsync.getItem.mockResolvedValue(JSON.stringify(makeLiturgia()));

      const result = await getLiturgyCache("2026-06-25");

      expect(result).toMatchObject({ data: "25/06/2026", cor: "Verde" });
    });

    it("retorna null quando não há item para a chave", async () => {
      mockedAsync.getItem.mockResolvedValue(null);

      const result = await getLiturgyCache("2026-06-25");

      expect(result).toBeNull();
    });

    it("retorna null quando o JSON armazenado é inválido", async () => {
      mockedAsync.getItem.mockResolvedValue("{ invalid json }");

      const result = await getLiturgyCache("2026-06-25");

      expect(result).toBeNull();
    });

    it("lê a chave correta do AsyncStorage", async () => {
      mockedAsync.getItem.mockResolvedValue(null);

      await getLiturgyCache("2026-06-25");

      expect(mockedAsync.getItem).toHaveBeenCalledWith("@liturgy:2026-06-25");
    });
  });
});
