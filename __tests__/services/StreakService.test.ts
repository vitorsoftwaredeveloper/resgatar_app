jest.mock("@/storage/asyncStorage", () => ({
  getStreak: jest.fn(),
  setStreak: jest.fn(),
}));

import { getStreak, setStreak, IStreakData } from "@/storage/asyncStorage";
import { StreakService, dayKey, GRACE_MAX } from "@/services/StreakService";

const mockedGet = getStreak as jest.Mock;
const mockedSet = setStreak as jest.Mock;

const MEMBER = "member-1";

function makeStreak(over: Partial<IStreakData> = {}): IStreakData {
  return {
    current: 1,
    best: 1,
    lastReadKey: "2026-06-26",
    totalDays: 1,
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

function setToday(iso: string) {
  jest.useFakeTimers();
  // Noon local time avoids any edge where parsing shifts the calendar day.
  jest.setSystemTime(new Date(`${iso}T12:00:00`));
}

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("dayKey", () => {
  it("formata a data local como YYYY-MM-DD com zero à esquerda", () => {
    expect(dayKey(new Date(2026, 0, 5, 23, 0))).toBe("2026-01-05");
  });
});

describe("StreakService.recordRead", () => {
  it("inicia em 1 quando não há histórico e desbloqueia 'primeiros-passos'", async () => {
    setToday("2026-06-27");
    mockedGet.mockResolvedValue(null);

    const result = await StreakService.recordRead(MEMBER);

    expect(result.countedToday).toBe(true);
    expect(result.data).toMatchObject({
      current: 1,
      best: 1,
      lastReadKey: "2026-06-27",
      totalDays: 1,
      history: ["2026-06-27"],
      grace: 0,
    });
    expect(result.data.unlockedBadges).toContain("primeiros-passos");
    expect(result.newBadges.map((b) => b.id)).toContain("primeiros-passos");
    expect(mockedSet).toHaveBeenCalledWith(MEMBER, result.data);
  });

  it("incrementa quando a última leitura foi ontem", async () => {
    setToday("2026-06-27");
    mockedGet.mockResolvedValue(
      makeStreak({
        current: 3,
        best: 5,
        lastReadKey: "2026-06-26",
        totalDays: 10,
        history: ["2026-06-24", "2026-06-25", "2026-06-26"],
      }),
    );

    const result = await StreakService.recordRead(MEMBER);

    expect(result.data.current).toBe(4);
    expect(result.data.best).toBe(5);
    expect(result.data.totalDays).toBe(11);
    expect(result.data.history).toContain("2026-06-27");
    expect(result.newRecord).toBe(false);
  });

  it("é idempotente quando já foi contado hoje", async () => {
    setToday("2026-06-27");
    const existing = makeStreak({
      current: 4,
      best: 5,
      lastReadKey: "2026-06-27",
      totalDays: 11,
      history: ["2026-06-27"],
    });
    mockedGet.mockResolvedValue(existing);

    const result = await StreakService.recordRead(MEMBER);

    expect(result.countedToday).toBe(false);
    expect(result.data).toEqual(existing);
    expect(mockedSet).not.toHaveBeenCalled();
  });

  it("zera para 1 quando um dia foi pulado e não há graça", async () => {
    setToday("2026-06-27");
    mockedGet.mockResolvedValue(
      makeStreak({
        current: 8,
        best: 8,
        lastReadKey: "2026-06-25", // pulou o dia 26
        totalDays: 20,
        grace: 0,
      }),
    );

    const result = await StreakService.recordRead(MEMBER);

    expect(result.data.current).toBe(1);
    expect(result.data.best).toBe(8); // recorde preservado
    expect(result.graceUsed).toBe(false);
  });

  it("sinaliza novo recorde ao superar o best anterior", async () => {
    setToday("2026-06-27");
    mockedGet.mockResolvedValue(
      makeStreak({
        current: 5,
        best: 5,
        lastReadKey: "2026-06-26",
        totalDays: 12,
      }),
    );

    const result = await StreakService.recordRead(MEMBER);

    expect(result.data.current).toBe(6);
    expect(result.data.best).toBe(6);
    expect(result.newRecord).toBe(true);
  });

  it("sinaliza marco e desbloqueia 'semaneiro' ao atingir 7 dias", async () => {
    setToday("2026-06-27");
    mockedGet.mockResolvedValue(
      makeStreak({
        current: 6,
        best: 6,
        lastReadKey: "2026-06-26",
        totalDays: 6,
      }),
    );

    const result = await StreakService.recordRead(MEMBER);

    expect(result.milestone).toBe(7);
    expect(result.data.unlockedBadges).toContain("semaneiro");
    expect(result.newBadges.map((b) => b.id)).toContain("semaneiro");
  });
});

describe("StreakService — dia de graça", () => {
  it("ganha uma graça ao completar 7 dias seguidos", async () => {
    setToday("2026-06-27");
    mockedGet.mockResolvedValue(
      makeStreak({ current: 6, best: 6, lastReadKey: "2026-06-26", grace: 0 }),
    );

    const result = await StreakService.recordRead(MEMBER);

    expect(result.data.current).toBe(7);
    expect(result.data.grace).toBe(1);
    expect(result.graceEarned).toBe(true);
  });

  it("gasta uma graça para perdoar um dia perdido e preserva a sequência", async () => {
    setToday("2026-06-27");
    mockedGet.mockResolvedValue(
      makeStreak({
        current: 9,
        best: 9,
        lastReadKey: "2026-06-25", // faltou dia 26
        grace: 2,
      }),
    );

    const result = await StreakService.recordRead(MEMBER);

    expect(result.graceUsed).toBe(true);
    expect(result.data.current).toBe(10); // sequência continua
    expect(result.data.grace).toBe(1); // consumiu 1 crédito
  });

  it("não usa graça quando faltam mais dias do que créditos", async () => {
    setToday("2026-06-27");
    mockedGet.mockResolvedValue(
      makeStreak({
        current: 9,
        best: 9,
        lastReadKey: "2026-06-23", // faltou 24, 25, 26 → 3 dias
        grace: 1,
      }),
    );

    const result = await StreakService.recordRead(MEMBER);

    expect(result.graceUsed).toBe(false);
    expect(result.data.current).toBe(1);
    expect(result.data.grace).toBe(1); // crédito intacto
  });

  it("nunca acumula graça acima do teto", async () => {
    setToday("2026-06-28");
    mockedGet.mockResolvedValue(
      makeStreak({
        current: 13, // próxima leitura cruza o múltiplo de 14
        best: 13,
        lastReadKey: "2026-06-27",
        grace: GRACE_MAX,
      }),
    );

    const result = await StreakService.recordRead(MEMBER);

    expect(result.data.current).toBe(14);
    expect(result.data.grace).toBe(GRACE_MAX);
    expect(result.graceEarned).toBe(false);
  });
});

describe("StreakService.getStatus", () => {
  it("retorna null quando não há dados", async () => {
    mockedGet.mockResolvedValue(null);
    expect(await StreakService.getStatus(MEMBER)).toBeNull();
  });

  it("mantém current quando leitura foi ontem", async () => {
    setToday("2026-06-27");
    mockedGet.mockResolvedValue(
      makeStreak({ current: 4, best: 5, lastReadKey: "2026-06-26" }),
    );

    const status = await StreakService.getStatus(MEMBER);
    expect(status?.current).toBe(4);
  });

  it("mantém a sequência viva quando há graça suficiente para cobrir a falta", async () => {
    setToday("2026-06-27");
    mockedGet.mockResolvedValue(
      makeStreak({ current: 4, best: 5, lastReadKey: "2026-06-25", grace: 1 }),
    );

    const status = await StreakService.getStatus(MEMBER);
    expect(status?.current).toBe(4); // ainda recuperável
  });

  it("reflete sequência quebrada como current 0 quando não há graça", async () => {
    setToday("2026-06-27");
    mockedGet.mockResolvedValue(
      makeStreak({
        current: 4,
        best: 5,
        lastReadKey: "2026-06-24", // mais de 1 dia atrás
        grace: 0,
      }),
    );

    const status = await StreakService.getStatus(MEMBER);
    expect(status?.current).toBe(0);
    expect(status?.best).toBe(5);
    expect(mockedSet).not.toHaveBeenCalled();
  });

  it("normaliza dados antigos sem grace/unlockedBadges", async () => {
    setToday("2026-06-27");
    mockedGet.mockResolvedValue({
      current: 2,
      best: 2,
      lastReadKey: "2026-06-26",
      totalDays: 2,
      history: ["2026-06-26"],
    });

    const status = await StreakService.getStatus(MEMBER);
    expect(status?.grace).toBe(0);
    expect(status?.unlockedBadges).toEqual([]);
  });
});

describe("StreakService — áudio e leitura completa", () => {
  it("conta a escuta de áudio uma vez por dia e desbloqueia 'ouvinte-1'", async () => {
    setToday("2026-06-27");
    mockedGet.mockResolvedValue(
      makeStreak({ audioListens: 0, lastAudioKey: "" }),
    );
    const newBadges = await StreakService.recordAudioListen(MEMBER);
    const saved = mockedSet.mock.calls[0][1];
    expect(saved.audioListens).toBe(1);
    expect(saved.lastAudioKey).toBe("2026-06-27");
    expect(newBadges.map((b) => b.id)).toContain("ouvinte-1");
  });

  it("não conta a escuta de áudio duas vezes no mesmo dia", async () => {
    setToday("2026-06-27");
    mockedGet.mockResolvedValue(
      makeStreak({ audioListens: 1, lastAudioKey: "2026-06-27" }),
    );
    const newBadges = await StreakService.recordAudioListen(MEMBER);
    expect(newBadges).toEqual([]);
    expect(mockedSet).not.toHaveBeenCalled();
  });

  it("conta leitura completa uma vez por dia e marca madrugador antes das 8h", async () => {
    setToday("2026-06-27");
    jest.setSystemTime(new Date("2026-06-27T07:00:00"));
    mockedGet.mockResolvedValue(
      makeStreak({ completeReadings: 0, earlyReadings: 0, lastCompleteKey: "" }),
    );

    const newBadges = await StreakService.recordCompleteReading(MEMBER, true);
    const saved = mockedSet.mock.calls[0][1];
    expect(saved.completeReadings).toBe(1);
    expect(saved.earlyReadings).toBe(1);
    expect(saved.lastCompleteKey).toBe("2026-06-27");
    expect(newBadges.map((b) => b.id)).toEqual(
      expect.arrayContaining(["completa-1", "madrugador-1"]),
    );
  });

  it("não conta leitura completa duas vezes no mesmo dia", async () => {
    setToday("2026-06-27");
    mockedGet.mockResolvedValue(
      makeStreak({ completeReadings: 1, lastCompleteKey: "2026-06-27" }),
    );
    const newBadges = await StreakService.recordCompleteReading(MEMBER, false);
    expect(newBadges).toEqual([]);
    expect(mockedSet).not.toHaveBeenCalled();
  });
});
