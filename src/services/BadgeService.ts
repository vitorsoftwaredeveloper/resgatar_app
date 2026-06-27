import { IStreakData } from "@/storage/asyncStorage";

// Achievements are derived purely from the locally stored streak data, so they
// require no backend and recompute deterministically on every read. The service
// stays free of UI deps — `iconId` is mapped to a component in the view layer.
export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  iconId: string;
  // Value/threshold the badge tracks, used for both unlock and progress bar.
  threshold: number;
  valueOf: (s: IStreakData) => number;
}

export interface BadgeStatus {
  def: BadgeDefinition;
  unlocked: boolean;
  value: number; // current progress value, capped at threshold for display
  progress: number; // 0..1
}

// Two progression axes on purpose: consistency (longest streak) rewards
// momentum, while devotion (total days) rewards the long haul without
// punishing the occasional miss.
export const BADGES: BadgeDefinition[] = [
  {
    id: "primeiros-passos",
    title: "Primeiros passos",
    description: "Primeira liturgia lida",
    iconId: "footprints",
    threshold: 1,
    valueOf: (s) => s.totalDays,
  },
  {
    id: "semaneiro",
    title: "Semaneiro",
    description: "7 dias seguidos",
    iconId: "star",
    threshold: 7,
    valueOf: (s) => s.best,
  },
  {
    id: "quinzena",
    title: "Quinzena fiel",
    description: "15 dias seguidos",
    iconId: "sparkles",
    threshold: 15,
    valueOf: (s) => s.best,
  },
  {
    id: "mes-de-constancia",
    title: "Mês de constância",
    description: "30 dias seguidos",
    iconId: "medal",
    threshold: 30,
    valueOf: (s) => s.best,
  },
  {
    id: "centuriao",
    title: "Centurião",
    description: "100 dias seguidos",
    iconId: "crown",
    threshold: 100,
    valueOf: (s) => s.best,
  },
  {
    id: "caminhante",
    title: "Caminhante",
    description: "30 dias no total",
    iconId: "sunrise",
    threshold: 30,
    valueOf: (s) => s.totalDays,
  },
  {
    id: "devoto",
    title: "Devoto",
    description: "100 dias no total",
    iconId: "book-open",
    threshold: 100,
    valueOf: (s) => s.totalDays,
  },
  {
    id: "peregrino",
    title: "Peregrino",
    description: "365 dias no total",
    iconId: "mountain",
    threshold: 365,
    valueOf: (s) => s.totalDays,
  },
  {
    id: "perseveranca",
    title: "Perseverança",
    description: "1 ano seguido",
    iconId: "gem",
    threshold: 365,
    valueOf: (s) => s.best,
  },
  // Profile badges — profileScore: +1 bio, +1 photo, +1 full address.
  {
    id: "perfil-1",
    title: "Me apresentei",
    description: "Bio preenchida",
    iconId: "user",
    threshold: 1,
    valueOf: (s) => s.profileScore,
  },
  {
    id: "perfil-2",
    title: "Rosto na comunidade",
    description: "Bio e foto",
    iconId: "user-circle",
    threshold: 2,
    valueOf: (s) => s.profileScore,
  },
  {
    id: "perfil-3",
    title: "Perfil completo",
    description: "Bio, foto e endereço",
    iconId: "badge-check",
    threshold: 3,
    valueOf: (s) => s.profileScore,
  },
  // Donation badges — progress tracked via donationsByYear synced from backend.
  {
    id: "doador-1",
    title: "Primeiro dom",
    description: "1ª doação feita",
    iconId: "hand-heart",
    threshold: 1,
    valueOf: (s) => Object.values(s.donationsByYear ?? {}).reduce((a, b) => a + b, 0),
  },
  {
    id: "doador-5",
    title: "Coração generoso",
    description: "5 doações",
    iconId: "heart",
    threshold: 5,
    valueOf: (s) => Object.values(s.donationsByYear ?? {}).reduce((a, b) => a + b, 0),
  },
  {
    id: "doador-10",
    title: "Mãos abertas",
    description: "10 doações",
    iconId: "hands",
    threshold: 10,
    valueOf: (s) => Object.values(s.donationsByYear ?? {}).reduce((a, b) => a + b, 0),
  },
  {
    id: "doador-25",
    title: "Servo fiel",
    description: "25 doações",
    iconId: "gift",
    threshold: 25,
    valueOf: (s) => Object.values(s.donationsByYear ?? {}).reduce((a, b) => a + b, 0),
  },
  // Contribution badges — progress tracked via paidMonths synced from backend.
  {
    id: "fiel-1",
    title: "Primeiro mês",
    description: "1º mês pago",
    iconId: "hand-coins",
    threshold: 1,
    valueOf: (s) => s.paidMonths,
  },
  {
    id: "fiel-3",
    title: "Trimestre fiel",
    description: "3 meses pagos",
    iconId: "shield",
    threshold: 3,
    valueOf: (s) => s.paidMonths,
  },
  {
    id: "fiel-6",
    title: "Semestral",
    description: "6 meses pagos",
    iconId: "shield-check",
    threshold: 6,
    valueOf: (s) => s.paidMonths,
  },
  {
    id: "fiel-12",
    title: "Anual",
    description: "12 meses pagos",
    iconId: "trophy",
    threshold: 12,
    valueOf: (s) => s.paidMonths,
  },
  {
    id: "fiel-24",
    title: "Dois anos de fidelidade",
    description: "24 meses pagos",
    iconId: "diamond",
    threshold: 24,
    valueOf: (s) => s.paidMonths,
  },
  // Audio badges — dias em que ouviu a liturgia em áudio (TTS), 1x/dia.
  {
    id: "ouvinte-1",
    title: "Primeira escuta",
    description: "Ouviu uma leitura",
    iconId: "headphones",
    threshold: 1,
    valueOf: (s) => s.audioListens,
  },
  {
    id: "ouvinte-10",
    title: "Bons ouvidos",
    description: "Ouviu em 10 dias",
    iconId: "ear",
    threshold: 10,
    valueOf: (s) => s.audioListens,
  },
  {
    id: "ouvinte-50",
    title: "Voz constante",
    description: "Ouviu em 50 dias",
    iconId: "audio-lines",
    threshold: 50,
    valueOf: (s) => s.audioListens,
  },
  // Complete reading badges — abrir 1ª leitura + salmo + evangelho no mesmo dia.
  {
    id: "completa-1",
    title: "Leitura completa",
    description: "Liturgia inteira lida",
    iconId: "book-marked",
    threshold: 1,
    valueOf: (s) => s.completeReadings,
  },
  {
    id: "completa-10",
    title: "Leitor dedicado",
    description: "10 dias completos",
    iconId: "library",
    threshold: 10,
    valueOf: (s) => s.completeReadings,
  },
  {
    id: "completa-30",
    title: "Leitor fiel",
    description: "30 dias completos",
    iconId: "graduation-cap",
    threshold: 30,
    valueOf: (s) => s.completeReadings,
  },
  // Video badges — publicar vídeos na comunidade.
  {
    id: "video-1",
    title: "Primeiro vídeo",
    description: "Publicou um vídeo",
    iconId: "video",
    threshold: 1,
    valueOf: (s) => s.videosPosted,
  },
  {
    id: "video-5",
    title: "Produtor",
    description: "Publicou 5 vídeos",
    iconId: "clapperboard",
    threshold: 5,
    valueOf: (s) => s.videosPosted,
  },
  {
    id: "video-15",
    title: "Canal ativo",
    description: "Publicou 15 vídeos",
    iconId: "youtube",
    threshold: 15,
    valueOf: (s) => s.videosPosted,
  },
  // Tutorial badge — assistir o tour de boas-vindas até o fim.
  {
    id: "guiado",
    title: "Bem guiado",
    description: "Viu todo o tutorial",
    iconId: "compass",
    threshold: 1,
    valueOf: (s) => (s.tutorialDone ? 1 : 0),
  },
  // Early bird badges — completar a liturgia inteira antes das 8h.
  {
    id: "madrugador-1",
    title: "Primeira manhã",
    description: "Completa antes das 8h",
    iconId: "sunrise",
    threshold: 1,
    valueOf: (s) => s.earlyReadings,
  },
  {
    id: "madrugador-7",
    title: "Madrugador",
    description: "7 dias antes das 8h",
    iconId: "alarm-clock",
    threshold: 7,
    valueOf: (s) => s.earlyReadings,
  },
  {
    id: "madrugador-30",
    title: "Alvorada fiel",
    description: "30 dias antes das 8h",
    iconId: "sun",
    threshold: 30,
    valueOf: (s) => s.earlyReadings,
  },
];

// Status of every badge for display (grid, progress bars).
export function evaluateBadges(streak: IStreakData): BadgeStatus[] {
  return BADGES.map((def) => {
    const raw = def.valueOf(streak);
    return {
      def,
      unlocked: raw >= def.threshold,
      value: Math.min(raw, def.threshold),
      progress: Math.min(raw / def.threshold, 1),
    };
  });
}

// Ids unlocked by the given streak state. Used to diff against what was already
// celebrated so a badge fires its toast exactly once.
export function unlockedBadgeIds(streak: IStreakData): string[] {
  return BADGES.filter((b) => b.valueOf(streak) >= b.threshold).map((b) => b.id);
}

// "Moldura da caminhada" — the avatar frame evolves as the member unlocks more
// achievements, turning prestige into something visible across the app. Tiers
// are derived purely from how many badges are unlocked (count-based), so they
// stay offline and recompute deterministically. ringColors: [] = no ring,
// 1 color = solid, 2+ = gradient. `effect` is an optional flourish drawn around
// the avatar — rendered by the Avatar component, so adding a new one is a data
// change here plus a render case there.
export interface FrameTier {
  id: string;
  name: string;
  minBadges: number;
  ringColors: string[];
  ringWidth: number;
}

export const FRAME_TIERS: FrameTier[] = [
  { id: "semente", name: "Semente", minBadges: 0, ringColors: [], ringWidth: 0 },
  { id: "orvalho", name: "Orvalho", minBadges: 2, ringColors: ["#5DCAA5"], ringWidth: 2 },
  { id: "brasa", name: "Brasa", minBadges: 4, ringColors: ["#EF9F27"], ringWidth: 3 },
  { id: "chama", name: "Chama", minBadges: 6, ringColors: ["#D85A30"], ringWidth: 4 },
  { id: "alvorada", name: "Alvorada", minBadges: 8, ringColors: ["#EF9F27", "#D85A30"], ringWidth: 4 },
  { id: "aurora", name: "Aurora", minBadges: 10, ringColors: ["#1D9E75", "#378ADD", "#7F77DD"], ringWidth: 5 },
  { id: "firmamento", name: "Firmamento", minBadges: 12, ringColors: ["#378ADD", "#534AB7"], ringWidth: 5 },
  { id: "prisma", name: "Prisma", minBadges: 14, ringColors: ["#D4537E", "#7F77DD", "#378ADD"], ringWidth: 5 },
  { id: "gloria", name: "Glória", minBadges: 17, ringColors: ["#EF9F27", "#D85A30", "#D4537E"], ringWidth: 6 },
  { id: "transfiguracao", name: "Transfiguração", minBadges: 20, ringColors: ["#FAC775", "#EF9F27", "#D85A30", "#D4537E"], ringWidth: 6 },
];

// Efeitos cosméticos ao redor do avatar — categoria SEPARADA da moldura, com
// seus próprios desbloqueios. Renderizados pelo Avatar (um caso por id).
export type FrameEffect =
  | "none"
  | "glow"
  | "breathe"
  | "pulse"
  | "ripple"
  | "orbit"
  | "dual-orbit"
  | "dashed"
  | "rotate";

export interface EffectDef {
  id: FrameEffect;
  name: string;
  minBadges: number;
}

export const EFFECTS: EffectDef[] = [
  { id: "none", name: "Nenhum", minBadges: 0 },
  { id: "glow", name: "Brilho", minBadges: 5 },
  { id: "breathe", name: "Respiro", minBadges: 8 },
  { id: "pulse", name: "Pulso", minBadges: 11 },
  { id: "ripple", name: "Ondas", minBadges: 14 },
  { id: "orbit", name: "Órbita", minBadges: 17 },
  { id: "dual-orbit", name: "Órbita dupla", minBadges: 20 },
  { id: "dashed", name: "Tracejado", minBadges: 24 },
  { id: "rotate", name: "Rotação", minBadges: 28 },
];

// Highest tier whose badge requirement the member has met.
export function frameTier(streak: IStreakData): FrameTier {
  const count = unlockedBadgeIds(streak).length;
  let current = FRAME_TIERS[0];
  for (const tier of FRAME_TIERS) {
    if (count >= tier.minBadges) current = tier;
  }
  return current;
}

// Index into FRAME_TIERS, convenient for passing around as a plain number.
export function frameTierIndex(streak: IStreakData): number {
  return FRAME_TIERS.indexOf(frameTier(streak));
}

// Frames the member has already unlocked (badge requirement met). Always
// includes "Semente", so the member can opt out of any ring.
export function unlockedFrames(streak: IStreakData): FrameTier[] {
  const count = unlockedBadgeIds(streak).length;
  return FRAME_TIERS.filter((t) => count >= t.minBadges);
}

// Index of the frame to actually DISPLAY: the member's chosen one when it's set
// and unlocked, otherwise the highest unlocked. The member picks among unlocked
// frames; the auto-default keeps newcomers showing their best ring for free.
export function resolveFrameIndex(
  streak: IStreakData,
  selectedFrame: string | null,
): number {
  const unlocked = unlockedFrames(streak);
  if (selectedFrame) {
    const idx = FRAME_TIERS.findIndex((t) => t.id === selectedFrame);
    if (idx >= 0 && unlocked.includes(FRAME_TIERS[idx])) return idx;
  }
  return FRAME_TIERS.indexOf(unlocked[unlocked.length - 1]);
}

// Molduras e efeitos cuja exigência foi cruzada quando a contagem de conquistas
// passou de `prevCount` para `newCount`. Usado para avisar o membro do que abriu.
export function cosmeticsUnlockedBetween(
  prevCount: number,
  newCount: number,
): { frames: FrameTier[]; effects: EffectDef[] } {
  const between = (min: number) => min > 0 && min > prevCount && min <= newCount;
  return {
    frames: FRAME_TIERS.filter((f) => between(f.minBadges)),
    effects: EFFECTS.filter((e) => between(e.minBadges)),
  };
}

// Effects the member has unlocked (sempre inclui "none").
export function unlockedEffects(streak: IStreakData): EffectDef[] {
  const count = unlockedBadgeIds(streak).length;
  return EFFECTS.filter((e) => count >= e.minBadges);
}

// Efeito a EXIBIR: o escolhido se desbloqueado, senão nenhum (efeitos não se
// auto-aplicam — o membro opta por ativar).
export function resolveEffect(
  streak: IStreakData,
  selectedEffect: string | null,
): FrameEffect {
  if (selectedEffect) {
    const def = EFFECTS.find((e) => e.id === selectedEffect);
    if (def && unlockedEffects(streak).includes(def)) return def.id;
  }
  return "none";
}
