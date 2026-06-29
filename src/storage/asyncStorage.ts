import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { IMemberWithContribution } from "@/types/Member/index";
import { ILiturgia } from "@/types/Liturgy";

const MEMBER_PUBLIC_KEY = "@auth:member_public";
const LITURGY_CACHE_PREFIX = "@liturgy:";
const MEMBER_SENSITIVE_KEY = "auth_member_sensitive";
const ONBOARDING_KEY_PREFIX = "@onboarding:seen:";

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
    profileImage: member.profileImage,
    bio: member.bio,
    role: member.role,
    contributions: member.contributions,
    readingStreak: member.readingStreak,
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

async function getOnboardingSeen(memberId: string): Promise<boolean> {
  const value = await AsyncStorage.getItem(`${ONBOARDING_KEY_PREFIX}${memberId}`);
  return value === "true";
}

async function setOnboardingSeen(memberId: string) {
  await AsyncStorage.setItem(`${ONBOARDING_KEY_PREFIX}${memberId}`, "true");
}

async function clearOnboardingSeen(memberId: string) {
  await AsyncStorage.removeItem(`${ONBOARDING_KEY_PREFIX}${memberId}`);
}

const DASHBOARD_ORDER_PREFIX = "@dashboard:order:";

async function getDashboardOrder(memberId: string): Promise<string[] | null> {
  const raw = await AsyncStorage.getItem(`${DASHBOARD_ORDER_PREFIX}${memberId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return null;
  }
}

async function setDashboardOrder(memberId: string, order: string[]): Promise<void> {
  await AsyncStorage.setItem(
    `${DASHBOARD_ORDER_PREFIX}${memberId}`,
    JSON.stringify(order),
  );
}

const READING_MARKED_PREFIX = "@reading:marked:";

function readingMarkedKey(memberId: string): string {
  return `${READING_MARKED_PREFIX}${memberId}`;
}

async function getReadingMarkedDate(memberId: string): Promise<string | null> {
  return AsyncStorage.getItem(readingMarkedKey(memberId));
}

async function setReadingMarkedDate(memberId: string, isoDate: string): Promise<void> {
  await AsyncStorage.setItem(readingMarkedKey(memberId), isoDate);
}

// Liturgy daily cache — key includes the date so yesterday's entry is never
// read again; no explicit expiration or cleanup required.
async function getLiturgyCache(dateKey: string): Promise<ILiturgia | null> {
  const raw = await AsyncStorage.getItem(`${LITURGY_CACHE_PREFIX}${dateKey}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ILiturgia;
  } catch {
    return null;
  }
}

async function setLiturgyCache(dateKey: string, data: ILiturgia): Promise<void> {
  await AsyncStorage.setItem(
    `${LITURGY_CACHE_PREFIX}${dateKey}`,
    JSON.stringify(data),
  );
}

export {
  saveMember,
  getStoredMember,
  removeMember,
  getOnboardingSeen,
  setOnboardingSeen,
  clearOnboardingSeen,
  getReadingMarkedDate,
  setReadingMarkedDate,
  getLiturgyCache,
  setLiturgyCache,
  getDashboardOrder,
  setDashboardOrder,
};
