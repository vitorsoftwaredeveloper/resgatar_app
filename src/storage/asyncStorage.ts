import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { IMemberWithContribution } from "@/types/Member/index";
import { ILiturgia } from "@/types/Liturgy";

const MEMBER_PUBLIC_KEY = "@auth:member_public";
const LITURGY_CACHE_PREFIX = "@liturgy:";
const MEMBER_SENSITIVE_KEY = "auth_member_sensitive";
const ONBOARDING_KEY_PREFIX = "@onboarding:seen:";
const STREAK_KEY_PREFIX = "@streak:";

// Reading streak — kept per member so the same device can host more than one
// account without mixing progress. Stored locally only.
export interface IStreakData {
  current: number; // consecutive days up to and including lastReadKey
  best: number; // all-time longest streak
  lastReadKey: string; // "YYYY-MM-DD" of the most recent counted day
  totalDays: number; // total distinct days read, for milestones
  history: string[]; // recent counted day keys, capped, ascending
  grace: number; // available "grace days" that forgive a single missed day
  unlockedBadges: string[]; // ids of achievements already celebrated
  // Synced from the backend after each contribution load. Stored locally so
  // badges remain evaluable offline. Migrate to backend-derived source later.
  paidMonths: number;
  // Keyed by year so reloading the same year never double-counts.
  // Total = sum of all values. Migrate to backend-derived source later.
  donationsByYear: Record<number, number>;
  // 0-3: +1 bio filled, +1 profileImage filled, +1 address complete.
  // Migrate to backend-derived source later.
  profileScore: number;
  // Id da moldura (FRAME_TIERS) que o membro escolheu exibir, ou null para usar
  // automaticamente a mais alta já desbloqueada.
  selectedFrame: string | null;
  // Id do efeito (EFFECTS) escolhido, ou null (nenhum). Cosmético independente
  // da moldura.
  selectedEffect: string | null;
  // Dias em que o membro ouviu o áudio de alguma leitura (TTS). Conta no máximo
  // uma vez por dia.
  audioListens: number;
  // "YYYY-MM-DD" do último dia contabilizado em audioListens.
  lastAudioKey: string;
  // Dias em que completou a leitura inteira (1ª leitura + salmo + evangelho).
  completeReadings: number;
  // Dias em que completou a leitura inteira antes das 8h.
  earlyReadings: number;
  // "YYYY-MM-DD" do último dia em que a leitura completa foi contabilizada,
  // para contar no máximo uma vez por dia.
  lastCompleteKey: string;
  // true depois que o membro assistiu o tutorial (coach) até o fim.
  tutorialDone: boolean;
  // Quantos vídeos o membro publicou.
  videosPosted: number;
}

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

async function getStreak(memberId: string): Promise<IStreakData | null> {
  const raw = await AsyncStorage.getItem(`${STREAK_KEY_PREFIX}${memberId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as IStreakData;
  } catch {
    return null;
  }
}

async function setStreak(memberId: string, data: IStreakData): Promise<void> {
  await AsyncStorage.setItem(
    `${STREAK_KEY_PREFIX}${memberId}`,
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
  getLiturgyCache,
  setLiturgyCache,
  getStreak,
  setStreak,
};
