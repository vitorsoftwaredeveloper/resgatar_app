import {
  WEEKDAY_OPTIONS,
  ORDINAL_OPTIONS,
  commitmentScheduleLabel,
  isCommitmentToday,
} from "@/utils/commitment";
import { ICommitment } from "@/types/Commitment";

// Cria uma data ISO no fuso local (round-trip), para a comparação de dia ficar
// estável independentemente do timezone onde os testes rodam.
const isoLocal = (y: number, m: number, d: number, h = 12) =>
  new Date(y, m, d, h, 0, 0).toISOString();

const base: ICommitment = {
  id: "c1",
  title: "Missa",
  day: "Domingo",
  time: "19h",
  location: "Igreja Matriz",
  repeat: "weekly",
  weekday: 0,
  ordinal: null,
  date: null,
};

describe("utils/commitment", () => {
  describe("opções dos seletores", () => {
    it("WEEKDAY_OPTIONS tem 7 dias com nome completo e índice 0-6", () => {
      expect(WEEKDAY_OPTIONS).toHaveLength(7);
      expect(WEEKDAY_OPTIONS[0]).toEqual({ label: "Domingo", value: 0 });
      expect(WEEKDAY_OPTIONS[3]).toEqual({ label: "Quarta", value: 3 });
      expect(WEEKDAY_OPTIONS[6]).toEqual({ label: "Sábado", value: 6 });
    });

    it("ORDINAL_OPTIONS cobre 1-5 e 'last'", () => {
      expect(ORDINAL_OPTIONS.map((o) => o.value)).toEqual([1, 2, 3, 4, 5, "last"]);
      expect(ORDINAL_OPTIONS[5]).toEqual({ label: "Último", value: "last" });
    });
  });

  describe("commitmentScheduleLabel", () => {
    it("semanal: 'Toda <dia>'", () => {
      expect(
        commitmentScheduleLabel({ repeat: "weekly", day: "Quarta", date: null }),
      ).toBe("Toda Quarta");
    });

    it("mensal: nome do dia + data concreta dd/mm", () => {
      expect(
        commitmentScheduleLabel({
          repeat: "monthly",
          day: "Domingo",
          date: isoLocal(2026, 5, 14),
        }),
      ).toBe("Domingo, 14/06");
    });

    it("avulso (once): nome do dia + data concreta", () => {
      expect(
        commitmentScheduleLabel({
          repeat: "once",
          day: "Sexta",
          date: isoLocal(2026, 9, 12),
        }),
      ).toBe("Sexta, 12/10");
    });

    it("datado sem date cai no nome do dia", () => {
      expect(
        commitmentScheduleLabel({ repeat: "monthly", day: "Terça", date: null }),
      ).toBe("Terça");
    });
  });

  describe("isCommitmentToday — semanal", () => {
    const wed = new Date(2026, 5, 17); // quarta-feira
    const thu = new Date(2026, 5, 18); // quinta-feira

    it("destaca quando o dia da semana de hoje bate", () => {
      const c = { ...base, repeat: "weekly" as const, day: "Quarta", date: null };
      expect(isCommitmentToday(c, wed)).toBe(true);
    });

    it("não destaca em outro dia da semana", () => {
      const c = { ...base, repeat: "weekly" as const, day: "Quarta", date: null };
      expect(isCommitmentToday(c, thu)).toBe(false);
    });

    it("comparação ignora acento/caixa", () => {
      const c = { ...base, repeat: "weekly" as const, day: "QUARTA", date: null };
      expect(isCommitmentToday(c, wed)).toBe(true);
    });
  });

  describe("isCommitmentToday — datado (monthly/once)", () => {
    it("destaca quando a data concreta cai hoje", () => {
      const c: ICommitment = {
        ...base,
        repeat: "monthly",
        day: "Domingo",
        weekday: 0,
        ordinal: 2,
        date: isoLocal(2026, 5, 14),
      };
      expect(isCommitmentToday(c, new Date(2026, 5, 14))).toBe(true);
    });

    it("não destaca em outro dia do mês", () => {
      const c: ICommitment = {
        ...base,
        repeat: "monthly",
        date: isoLocal(2026, 5, 14),
      };
      expect(isCommitmentToday(c, new Date(2026, 5, 21))).toBe(false);
    });

    it("não destaca no mesmo dia de outro mês", () => {
      const c: ICommitment = {
        ...base,
        repeat: "once",
        date: isoLocal(2026, 5, 14),
      };
      expect(isCommitmentToday(c, new Date(2026, 6, 14))).toBe(false);
    });

    it("datado sem date nunca é hoje", () => {
      const c: ICommitment = { ...base, repeat: "monthly", date: null };
      expect(isCommitmentToday(c, new Date(2026, 5, 14))).toBe(false);
    });
  });
});
