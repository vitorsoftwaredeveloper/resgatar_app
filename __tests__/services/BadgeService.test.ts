import { IStreakData } from "@/storage/asyncStorage";
import {
  BADGES,
  EFFECTS,
  FRAME_TIERS,
  evaluateBadges,
  frameTier,
  frameTierIndex,
  resolveEffect,
  unlockedBadgeIds,
} from "@/services/BadgeService";

function makeStreak(over: Partial<IStreakData> = {}): IStreakData {
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
    ...over,
  };
}

describe("BadgeService", () => {
  it("não desbloqueia nada para um estado zerado", () => {
    expect(unlockedBadgeIds(makeStreak())).toEqual([]);
  });

  it("desbloqueia por recorde de sequência (best)", () => {
    const ids = unlockedBadgeIds(makeStreak({ best: 30 }));
    expect(ids).toEqual(
      expect.arrayContaining(["semaneiro", "quinzena", "mes-de-constancia"]),
    );
    expect(ids).not.toContain("centuriao");
  });

  it("desbloqueia por total acumulado (totalDays)", () => {
    const ids = unlockedBadgeIds(makeStreak({ totalDays: 100 }));
    expect(ids).toEqual(
      expect.arrayContaining(["primeiros-passos", "caminhante", "devoto"]),
    );
    expect(ids).not.toContain("peregrino");
  });

  it("calcula progresso parcial para medalhas bloqueadas", () => {
    const status = evaluateBadges(makeStreak({ best: 15 }));
    const centuriao = status.find((b) => b.def.id === "centuriao")!;
    expect(centuriao.unlocked).toBe(false);
    expect(centuriao.value).toBe(15);
    expect(centuriao.progress).toBeCloseTo(0.15);
  });

  it("limita o progresso em 1 para medalhas desbloqueadas", () => {
    const status = evaluateBadges(makeStreak({ best: 50 }));
    const semaneiro = status.find((b) => b.def.id === "semaneiro")!;
    expect(semaneiro.unlocked).toBe(true);
    expect(semaneiro.progress).toBe(1);
    expect(semaneiro.value).toBe(semaneiro.def.threshold);
  });

  it("toda medalha tem um iconId definido", () => {
    BADGES.forEach((b) => expect(b.iconId).toBeTruthy());
  });
});

describe("BadgeService — moldura da caminhada", () => {
  it("estado zerado fica no tier Semente (sem anel)", () => {
    const tier = frameTier(makeStreak());
    expect(tier.id).toBe("semente");
    expect(tier.ringColors).toEqual([]);
    expect(frameTierIndex(makeStreak())).toBe(0);
  });

  it("sobe de tier conforme a contagem de conquistas cruza os limites", () => {
    // best: 30 desbloqueia primeiros-passos? não — só por best. semaneiro,
    // quinzena, mes-de-constancia = 3 conquistas → tier mínimo 2 (>=2).
    const streak = makeStreak({ best: 30 });
    const count = unlockedBadgeIds(streak).length;
    const tier = frameTier(streak);
    expect(count).toBeGreaterThanOrEqual(tier.minBadges);
    // O próximo tier (se houver) exige mais do que a contagem atual.
    const next = FRAME_TIERS[FRAME_TIERS.indexOf(tier) + 1];
    if (next) expect(count).toBeLessThan(next.minBadges);
  });

  it("os limites de tier são estritamente crescentes", () => {
    for (let i = 1; i < FRAME_TIERS.length; i++) {
      expect(FRAME_TIERS[i].minBadges).toBeGreaterThan(
        FRAME_TIERS[i - 1].minBadges,
      );
    }
  });

  it("efeitos são uma categoria separada com limites crescentes", () => {
    expect(EFFECTS[0].id).toBe("none");
    expect(EFFECTS[0].minBadges).toBe(0);
    for (let i = 1; i < EFFECTS.length; i++) {
      expect(EFFECTS[i].minBadges).toBeGreaterThan(EFFECTS[i - 1].minBadges);
    }
  });

  it("resolveEffect só aplica efeito desbloqueado e escolhido", () => {
    const many = makeStreak({ best: 365, totalDays: 365, paidMonths: 24 });
    expect(resolveEffect(many, "glow")).toBe("glow");
    // não escolhido → nenhum; escolhido mas bloqueado → nenhum
    expect(resolveEffect(many, null)).toBe("none");
    expect(resolveEffect(makeStreak(), "glow")).toBe("none");
  });
});
