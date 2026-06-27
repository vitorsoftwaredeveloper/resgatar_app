import {
  getStreak,
  setStreak,
  IStreakData,
} from "@/storage/asyncStorage";
import {
  BadgeDefinition,
  BADGES,
  unlockedBadgeIds,
} from "@/services/BadgeService";

// Days kept in `history`; enough to render the weekly strip with room to spare.
const HISTORY_CAP = 30;

// Milestones that trigger a celebratory toast when first reached.
const MILESTONES = [7, 30, 100, 365];

// Grace ("dia de graça"): one full week of constancy earns a credit that
// forgives a single missed day. Capped so it can't be hoarded indefinitely.
const GRACE_EARN_EVERY = 7;
export const GRACE_MAX = 3;

export interface RecordResult {
  data: IStreakData;
  countedToday: boolean; // false when today was already counted (no-op)
  newRecord: boolean; // current streak surpassed the previous best
  milestone?: number; // a milestone reached on this read, if any
  graceUsed: boolean; // a grace credit was spent to preserve the streak
  graceEarned: boolean; // a new grace credit was earned on this read
  newBadges: BadgeDefinition[]; // achievements unlocked for the first time
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Whole-day distance between two "YYYY-MM-DD" keys, immune to timezone/DST
// because it compares calendar dates at UTC midnight.
function daysBetween(fromKey: string, toKey: string): number {
  const [fy, fm, fd] = fromKey.split("-").map(Number);
  const [ty, tm, td] = toKey.split("-").map(Number);
  const from = Date.UTC(fy, fm - 1, fd);
  const to = Date.UTC(ty, tm - 1, td);
  return Math.round((to - from) / 86_400_000);
}

function appendHistory(history: string[], key: string): string[] {
  const next = history.includes(key) ? history : [...history, key];
  return next.slice(-HISTORY_CAP);
}

// Estado zerado canônico — fonte única dos defaults, evita repetir o objeto
// inteiro em cada fluxo (recordRead/sync*).
export function emptyStreak(): IStreakData {
  return {
    current: 0,
    best: 0,
    lastReadKey: "",
    totalDays: 0,
    history: [],
    grace: 0,
    unlockedBadges: [],
    paidMonths: 0,
    donationsByYear: {},
    profileScore: 0,
    selectedFrame: null,
    selectedEffect: null,
    audioListens: 0,
    lastAudioKey: "",
    completeReadings: 0,
    earlyReadings: 0,
    lastCompleteKey: "",
    tutorialDone: false,
    videosPosted: 0,
  };
}

// Backfills fields missing from streaks saved before grace/badges existed.
function normalize(data: IStreakData): IStreakData {
  return {
    ...emptyStreak(),
    ...data,
    grace: data.grace ?? 0,
    unlockedBadges: data.unlockedBadges ?? [],
    history: data.history ?? [],
    donationsByYear: data.donationsByYear ?? {},
  };
}

// Recalcula conquistas desbloqueadas (diff contra as já celebradas), persiste
// e devolve apenas as novas. Centraliza o padrão usado pelos vários eventos.
async function commitWithBadges(
  memberId: string,
  data: IStreakData,
): Promise<BadgeDefinition[]> {
  const nowUnlocked = unlockedBadgeIds(data);
  const previously = new Set(data.unlockedBadges);
  const newIds = nowUnlocked.filter((id) => !previously.has(id));
  data.unlockedBadges = nowUnlocked;
  await setStreak(memberId, data);
  return BADGES.filter((b) => newIds.includes(b.id));
}

export const StreakService = {
  // Call once when the member opens TODAY's liturgy. Idempotent within a day.
  async recordRead(memberId: string): Promise<RecordResult> {
    const today = dayKey(new Date());
    const stored = await getStreak(memberId);
    const prev = stored ? normalize(stored) : null;

    // Already counted today — surface current state without mutating.
    if (prev && prev.lastReadKey === today) {
      return {
        data: prev,
        countedToday: false,
        newRecord: false,
        graceUsed: false,
        graceEarned: false,
        newBadges: [],
      };
    }

    const prevCurrent = prev?.current ?? 0;
    const prevBest = prev?.best ?? 0;
    let grace = prev?.grace ?? 0;
    let graceUsed = false;
    let current: number;

    if (!prev) {
      current = 1;
    } else {
      const gap = daysBetween(prev.lastReadKey, today);
      if (gap === 1) {
        current = prev.current + 1;
      } else {
        // gap >= 2 → at least one day missed. Spend grace to bridge it if we
        // have enough credits; otherwise the streak resets.
        const missed = gap - 1;
        if (missed >= 1 && grace >= missed) {
          grace -= missed;
          graceUsed = true;
          current = prev.current + 1;
        } else {
          current = 1;
        }
      }
    }

    // Earn a credit each time the streak crosses a new multiple of a week.
    const earned = Math.max(
      0,
      Math.floor(current / GRACE_EARN_EVERY) -
        Math.floor(prevCurrent / GRACE_EARN_EVERY),
    );
    const graceBefore = grace;
    grace = Math.min(GRACE_MAX, grace + earned);
    const graceEarned = grace > graceBefore;

    const data: IStreakData = {
      ...(prev ?? emptyStreak()),
      current,
      best: Math.max(prevBest, current),
      lastReadKey: today,
      totalDays: (prev?.totalDays ?? 0) + 1,
      history: appendHistory(prev?.history ?? [], today),
      grace,
    };

    // Diff achievements so each badge celebrates exactly once.
    const nowUnlocked = unlockedBadgeIds(data);
    const previously = new Set(data.unlockedBadges);
    const newIds = nowUnlocked.filter((id) => !previously.has(id));
    data.unlockedBadges = nowUnlocked;
    const newBadges = BADGES.filter((b) => newIds.includes(b.id));

    await setStreak(memberId, data);

    return {
      data,
      countedToday: true,
      newRecord: current > prevBest && current > 1,
      milestone: MILESTONES.includes(current) ? current : undefined,
      graceUsed,
      graceEarned,
      newBadges,
    };
  },

  // Read-only status for display. Reflects a broken streak as current = 0,
  // but only when grace can no longer save it — so a member with a credit in
  // hand keeps seeing their streak alive until they actually open the app.
  async getStatus(memberId: string): Promise<IStreakData | null> {
    const stored = await getStreak(memberId);
    if (!stored) return null;
    const data = normalize(stored);
    const gap = daysBetween(data.lastReadKey, dayKey(new Date()));
    if (gap <= 1) return data;
    const missed = gap - 1;
    return data.grace >= missed ? data : { ...data, current: 0 };
  },

  // Persists which unlocked frame the member chose to display (or null to fall
  // back to the highest unlocked). Returns the updated streak, or null if none.
  async setSelectedFrame(
    memberId: string,
    frameId: string | null,
  ): Promise<IStreakData | null> {
    const stored = await getStreak(memberId);
    if (!stored) return null;
    const data = { ...normalize(stored), selectedFrame: frameId };
    await setStreak(memberId, data);
    return data;
  },

  // Persists the chosen avatar effect (or null). Returns the updated streak.
  async setSelectedEffect(
    memberId: string,
    effectId: string | null,
  ): Promise<IStreakData | null> {
    const stored = await getStreak(memberId);
    if (!stored) return null;
    const data = { ...normalize(stored), selectedEffect: effectId };
    await setStreak(memberId, data);
    return data;
  },

  // Conta a escuta de áudio no máximo uma vez por dia (cliques repetidos no
  // mesmo dia não contam). Retorna conquistas novas (vazio se já contou hoje).
  async recordAudioListen(memberId: string): Promise<BadgeDefinition[]> {
    const today = dayKey(new Date());
    const stored = await getStreak(memberId);
    const prev = stored ? normalize(stored) : emptyStreak();
    if (prev.lastAudioKey === today) return [];

    const data: IStreakData = {
      ...prev,
      audioListens: prev.audioListens + 1,
      lastAudioKey: today,
    };
    return commitWithBadges(memberId, data);
  },

  // Conta um vídeo publicado e retorna conquistas novas.
  async recordVideoPosted(memberId: string): Promise<BadgeDefinition[]> {
    const stored = await getStreak(memberId);
    const prev = stored ? normalize(stored) : emptyStreak();
    return commitWithBadges(memberId, {
      ...prev,
      videosPosted: prev.videosPosted + 1,
    });
  },

  // Marca o tutorial como concluído (uma vez). Retorna conquistas novas.
  async recordTutorialDone(memberId: string): Promise<BadgeDefinition[]> {
    const stored = await getStreak(memberId);
    const prev = stored ? normalize(stored) : emptyStreak();
    if (prev.tutorialDone) return [];
    return commitWithBadges(memberId, { ...prev, tutorialDone: true });
  },

  // Marks today's liturgy as fully read (1ª leitura + salmo + evangelho abertos).
  // Counts at most once per day; flags an early read when before 8h. Returns any
  // newly unlocked badges (empty if already counted today).
  async recordCompleteReading(
    memberId: string,
    beforeEight: boolean,
  ): Promise<BadgeDefinition[]> {
    const today = dayKey(new Date());
    const stored = await getStreak(memberId);
    const prev = stored ? normalize(stored) : emptyStreak();
    if (prev.lastCompleteKey === today) return [];

    const data: IStreakData = {
      ...prev,
      completeReadings: prev.completeReadings + 1,
      earlyReadings: prev.earlyReadings + (beforeEight ? 1 : 0),
      lastCompleteKey: today,
    };
    return commitWithBadges(memberId, data);
  },

  // Called after loading donations for a given year. Keying by year prevents
  // double-counting when the same year is loaded more than once.
  // TODO: replace with server-side evaluation when badges migrate to backend.
  async syncDonations(
    memberId: string,
    year: number,
    count: number,
  ): Promise<BadgeDefinition[]> {
    const stored = await getStreak(memberId);
    const prev = stored ? normalize(stored) : null;
    if ((prev?.donationsByYear ?? {})[year] === count) return [];

    const donationsByYear = { ...(prev?.donationsByYear ?? {}), [year]: count };
    const data: IStreakData = { ...(prev ?? emptyStreak()), donationsByYear };

    const nowUnlocked = unlockedBadgeIds(data);
    const previously = new Set(data.unlockedBadges);
    const newIds = nowUnlocked.filter((id) => !previously.has(id));
    data.unlockedBadges = nowUnlocked;
    const newBadges = BADGES.filter((b) => newIds.includes(b.id));

    await setStreak(memberId, data);
    return newBadges;
  },

  // Called whenever member data is loaded. Persists how many profile groups
  // the member has completed so profile badges can be evaluated offline.
  // TODO: replace with server-side evaluation when badges migrate to backend.
  async syncProfile(
    memberId: string,
    profileScore: number,
  ): Promise<BadgeDefinition[]> {
    const stored = await getStreak(memberId);
    const prev = stored ? normalize(stored) : null;
    if ((prev?.profileScore ?? 0) === profileScore) return [];

    const data: IStreakData = { ...(prev ?? emptyStreak()), profileScore };

    const nowUnlocked = unlockedBadgeIds(data);
    const previously = new Set(data.unlockedBadges);
    const newIds = nowUnlocked.filter((id) => !previously.has(id));
    data.unlockedBadges = nowUnlocked;
    const newBadges = BADGES.filter((b) => newIds.includes(b.id));

    await setStreak(memberId, data);
    return newBadges;
  },

  // Called after loading contributions from the backend. Persists the total
  // count of paid months locally and returns any newly unlocked badges.
  // TODO: when badges migrate to the backend, remove paidMonths from
  // IStreakData and replace this with a server-side evaluation call.
  async syncContributions(
    memberId: string,
    paidMonths: number,
  ): Promise<BadgeDefinition[]> {
    const stored = await getStreak(memberId);
    const prev = stored ? normalize(stored) : null;
    if (prev?.paidMonths === paidMonths) return []; // nothing changed

    const data: IStreakData = { ...(prev ?? emptyStreak()), paidMonths };

    const nowUnlocked = unlockedBadgeIds(data);
    const previously = new Set(data.unlockedBadges);
    const newIds = nowUnlocked.filter((id) => !previously.has(id));
    data.unlockedBadges = nowUnlocked;
    const newBadges = BADGES.filter((b) => newIds.includes(b.id));

    await setStreak(memberId, data);
    return newBadges;
  },
};
