import {
  formatDateFromTimestamp,
  formatLiturgicalDate,
  formatMoneyBRL,
  normalizeText,
  parseDateBRToTimestamp,
} from "@/utils/helper";

describe("formatDateFromTimestamp", () => {
  it("formata timestamp para data brasileira", () => {
    const ts = new Date(2026, 5, 17).getTime(); // 17/06/2026
    expect(formatDateFromTimestamp(ts)).toBe("17/06/2026");
  });

  it("retorna string vazia para undefined", () => {
    expect(formatDateFromTimestamp(undefined)).toBe("");
  });

  it("retorna string vazia para 0", () => {
    expect(formatDateFromTimestamp(0)).toBe("");
  });
});

describe("parseDateBRToTimestamp", () => {
  it("converte data BR para timestamp", () => {
    const ts = parseDateBRToTimestamp("17/06/2026");
    const date = new Date(ts);
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(5); // junho = 5
    expect(date.getDate()).toBe(17);
  });

  it("é inverso de formatDateFromTimestamp", () => {
    const original = "17/06/2026";
    const ts = parseDateBRToTimestamp(original);
    expect(formatDateFromTimestamp(ts)).toBe(original);
  });
});

describe("formatMoneyBRL", () => {
  it("formata número como moeda brasileira", () => {
    expect(formatMoneyBRL(1000)).toBe("R$ 1.000,00");
    expect(formatMoneyBRL(0)).toBe("R$ 0,00");
    expect(formatMoneyBRL(1.5)).toBe("R$ 1,50");
  });

  it("formata string numérica", () => {
    expect(formatMoneyBRL("250.50")).toBe("R$ 250,50");
  });

  it("retorna R$ 0,00 para valor inválido", () => {
    expect(formatMoneyBRL("abc")).toBe("R$ 0,00");
  });
});

describe("formatLiturgicalDate", () => {
  it("formata data BR com dia da semana por extenso", () => {
    const result = formatLiturgicalDate("17/06/2026");
    expect(result).toMatch(/quarta/i);
    expect(result).toMatch(/junho/i);
    expect(result).toMatch(/2026/);
    expect(result).toMatch(/17/);
  });

  it("inicia com letra maiúscula", () => {
    const result = formatLiturgicalDate("17/06/2026");
    expect(result[0]).toBe(result[0].toUpperCase());
  });

  it("formata diferentes dias da semana", () => {
    expect(formatLiturgicalDate("21/06/2026")).toMatch(/domingo/i);
    expect(formatLiturgicalDate("20/06/2026")).toMatch(/sábado/i);
  });
});

describe("normalizeText", () => {
  it("converte <br> em nova linha", () => {
    expect(normalizeText("linha1<br>linha2")).toBe("linha1\nlinha2");
    expect(normalizeText("linha1<br/>linha2")).toBe("linha1\nlinha2");
  });

  it("remove tags HTML", () => {
    expect(normalizeText("<b>negrito</b>")).toBe("negrito");
    expect(normalizeText("<p>parágrafo</p>")).toBe("parágrafo");
  });

  it("converte entidades HTML", () => {
    expect(normalizeText("&amp;")).toBe("&");
    expect(normalizeText("&lt;")).toBe("<");
    expect(normalizeText("&gt;")).toBe(">");
    expect(normalizeText("&quot;")).toBe('"');
    expect(normalizeText("texto&nbsp;fim")).toBe("texto fim");
  });

  it("colapsa múltiplas linhas em branco", () => {
    expect(normalizeText("a\n\n\n\nb")).toBe("a\n\nb");
  });

  it("remove espaços no início e fim", () => {
    expect(normalizeText("  texto  ")).toBe("texto");
  });
});
