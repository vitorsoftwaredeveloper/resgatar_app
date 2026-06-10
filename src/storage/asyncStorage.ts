import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { IMemberWithContribution } from "@/types/Member/index";

const MEMBER_PUBLIC_KEY = "@auth:member_public";
const MEMBER_SENSITIVE_KEY = "auth_member_sensitive";

type SensitiveFields = Pick<
  IMemberWithContribution,
  "email" | "phoneNumber" | "identification" | "paymentInfo" | "dateOfBirth" | "address"
>;

type PublicFields = Omit<IMemberWithContribution, keyof SensitiveFields>;

async function saveMember(member: IMemberWithContribution) {
  const sensitive: SensitiveFields = {
    email: member.email,
    phoneNumber: member.phoneNumber,
    identification: member.identification,
    paymentInfo: member.paymentInfo,
    dateOfBirth: member.dateOfBirth,
    address: member.address,
  };

  const publicData: PublicFields = {
    _id: member._id,
    firstName: member.firstName,
    lastName: member.lastName,
    bio: member.bio,
    role: member.role,
    contributions: member.contributions,
  };

  await Promise.all([
    SecureStore.setItemAsync(MEMBER_SENSITIVE_KEY, JSON.stringify(sensitive)),
    AsyncStorage.setItem(MEMBER_PUBLIC_KEY, JSON.stringify(publicData)),
  ]);
}

async function getStoredMember(): Promise<IMemberWithContribution | null> {
  const [publicRaw, sensitiveRaw] = await Promise.all([
    AsyncStorage.getItem(MEMBER_PUBLIC_KEY),
    SecureStore.getItemAsync(MEMBER_SENSITIVE_KEY),
  ]);

  if (!publicRaw || !sensitiveRaw) return null;

  const publicData: PublicFields = JSON.parse(publicRaw);
  const sensitive: SensitiveFields = JSON.parse(sensitiveRaw);

  return { ...publicData, ...sensitive };
}

async function removeMember() {
  await Promise.all([
    AsyncStorage.removeItem(MEMBER_PUBLIC_KEY),
    SecureStore.deleteItemAsync(MEMBER_SENSITIVE_KEY),
  ]);
}

export { saveMember, getStoredMember, removeMember };
