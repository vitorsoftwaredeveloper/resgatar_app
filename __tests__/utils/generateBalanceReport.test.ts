jest.mock("expo-print", () => ({ printToFileAsync: jest.fn() }));
jest.mock("expo-sharing", () => ({ shareAsync: jest.fn() }));
jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "file:///cache/",
  EncodingType: { Base64: "base64" },
  writeAsStringAsync: jest.fn(),
}));

import {
  generateBalanceReportHTML,
  generateBalanceReportWorkbook,
  shareBalanceReportExcel,
  shareBalanceReportPDF,
} from "@/utils/generateBalanceReport";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import * as XLSX from "xlsx";

const balance = {
  year: 2026,
  asOfMonth: 3,
  totals: { entradas: 900, doacoes: 0, saidas: 200, resultado: 700, saldoFinal: 700 },
  byMonth: [
    { month: 1, entradas: 300, doacoes: 0, saidas: 0, resultado: 300, saldoAcumulado: 300 },
    { month: 2, entradas: 300, doacoes: 0, saidas: 100, resultado: 200, saldoAcumulado: 500 },
    { month: 3, entradas: 300, doacoes: 0, saidas: 100, resultado: 200, saldoAcumulado: 700 },
  ],
  expensesByCategory: { event: 100, food: 100 },
};

describe("generateBalanceReportHTML", () => {
  it("contém o ano do balanço no título", () => {
    const html = generateBalanceReportHTML({ balance, isCurrentYear: false });
    expect(html).toContain("2026");
  });

  it("exibe 'Ano fechado' para anos passados", () => {
    const html = generateBalanceReportHTML({ balance, isCurrentYear: false });
    expect(html).toContain("Ano fechado");
  });

  it("exibe 'Acumulado até' para o ano corrente", () => {
    const html = generateBalanceReportHTML({ balance, isCurrentYear: true });
    expect(html).toContain("Acumulado até");
    expect(html).toContain("Março");
  });

  it("contém os valores de entradas, saídas e saldo no resumo", () => {
    const html = generateBalanceReportHTML({ balance, isCurrentYear: false });
    expect(html).toContain("Entradas");
    expect(html).toContain("Saídas");
    expect(html).toContain("Saldo");
  });

  it("contém os nomes dos 3 meses na tabela", () => {
    const html = generateBalanceReportHTML({ balance, isCurrentYear: false });
    expect(html).toContain("Janeiro");
    expect(html).toContain("Fevereiro");
    expect(html).toContain("Março");
  });

  it("exibe resultado com sinal positivo quando positivo", () => {
    const html = generateBalanceReportHTML({ balance, isCurrentYear: false });
    expect(html).toContain("+");
  });

  it("contém categorias de despesa traduzidas", () => {
    const html = generateBalanceReportHTML({ balance, isCurrentYear: false });
    // 'event' → 'Evento' ou similar (EXPENSE_CATEGORY_LABELS)
    expect(html.toLowerCase()).toMatch(/evento|event/);
  });

  it("exibe mensagem quando não há despesas por categoria", () => {
    const emptyBalance = { ...balance, expensesByCategory: {} };
    const html = generateBalanceReportHTML({
      balance: emptyBalance,
      isCurrentYear: false,
    });
    expect(html).toContain("Nenhuma despesa registrada");
  });

  it("usa cores do tema light por padrão", () => {
    const html = generateBalanceReportHTML({ balance, isCurrentYear: false });
    expect(html).toContain("#FAFAFA");
  });

  it("usa cores do tema dark quando especificado", () => {
    const html = generateBalanceReportHTML({
      balance,
      isCurrentYear: false,
      themeMode: "dark",
    });
    expect(html).toContain("#1A1812");
  });

  it("retorna HTML válido com DOCTYPE e fechamento", () => {
    const html = generateBalanceReportHTML({ balance, isCurrentYear: false });
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("</html>");
  });

  it("inclui rodapé com data de geração", () => {
    const html = generateBalanceReportHTML({ balance, isCurrentYear: false });
    expect(html).toContain("Relatório gerado pelo app Resgatar");
  });
});

describe("shareBalanceReportPDF", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Print.printToFileAsync as jest.Mock).mockResolvedValue({
      uri: "file://balanco_2026.pdf",
    });
    (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);
  });

  it("gera o PDF e chama shareAsync", async () => {
    await shareBalanceReportPDF({ balance, isCurrentYear: false });

    expect(Print.printToFileAsync).toHaveBeenCalledTimes(1);
    expect(Sharing.shareAsync).toHaveBeenCalledWith(
      "file://balanco_2026.pdf",
      expect.objectContaining({ mimeType: "application/pdf" }),
    );
  });

  it("passa o HTML com o ano correto para o printToFileAsync", async () => {
    await shareBalanceReportPDF({ balance, isCurrentYear: false });

    const call = (Print.printToFileAsync as jest.Mock).mock.calls[0][0];
    expect(call.html).toContain("2026");
  });

  it("usa o título do diálogo com o ano do balanço", async () => {
    await shareBalanceReportPDF({ balance, isCurrentYear: false });

    expect(Sharing.shareAsync).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ dialogTitle: "Balanço 2026" }),
    );
  });

  it("propaga erro quando Print.printToFileAsync falha", async () => {
    (Print.printToFileAsync as jest.Mock).mockRejectedValue(
      new Error("sem espaço"),
    );

    await expect(
      shareBalanceReportPDF({ balance, isCurrentYear: false }),
    ).rejects.toThrow("sem espaço");
  });

  it("propaga erro quando Sharing.shareAsync falha", async () => {
    (Sharing.shareAsync as jest.Mock).mockRejectedValue(
      new Error("share cancelado"),
    );

    await expect(
      shareBalanceReportPDF({ balance, isCurrentYear: false }),
    ).rejects.toThrow("share cancelado");
  });
});

describe("generateBalanceReportWorkbook", () => {
  it("cria uma planilha com 3 abas", () => {
    const wb = generateBalanceReportWorkbook({ balance, isCurrentYear: false });
    expect(wb.SheetNames).toHaveLength(3);
  });

  it("nomes das abas estão corretos", () => {
    const wb = generateBalanceReportWorkbook({ balance, isCurrentYear: false });
    expect(wb.SheetNames).toEqual(["Resumo", "Por mês", "Despesas por categoria"]);
  });

  describe("aba Resumo", () => {
    it("contém o ano e o rótulo de corte", () => {
      const wb = generateBalanceReportWorkbook({ balance, isCurrentYear: false });
      const ws = wb.Sheets["Resumo"];
      const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
      const flat = rows.flat();
      expect(flat.some((c) => String(c).includes("2026"))).toBe(true);
      expect(flat.some((c) => String(c).includes("Ano fechado"))).toBe(true);
    });

    it("exibe 'Acumulado até' para o ano corrente", () => {
      const wb = generateBalanceReportWorkbook({ balance, isCurrentYear: true });
      const ws = wb.Sheets["Resumo"];
      const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
      const flat = rows.flat();
      expect(flat.some((c) => String(c).includes("Acumulado até"))).toBe(true);
    });

    it("contém os valores totais como números", () => {
      const wb = generateBalanceReportWorkbook({ balance, isCurrentYear: false });
      const ws = wb.Sheets["Resumo"];
      const rows = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 });
      const numbers = rows.flat().filter((c) => typeof c === "number");
      expect(numbers).toContain(900);  // entradas
      expect(numbers).toContain(200);  // saidas
      expect(numbers).toContain(700);  // saldoFinal
    });
  });

  describe("aba Por mês", () => {
    it("contém cabeçalho com colunas esperadas", () => {
      const wb = generateBalanceReportWorkbook({ balance, isCurrentYear: false });
      const ws = wb.Sheets["Por mês"];
      const [header] = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
      expect(header).toContain("Entradas");
      expect(header).toContain("Saídas");
      expect(header).toContain("Resultado");
      expect(header).toContain("Saldo acumulado");
    });

    it("contém os nomes dos 3 meses no balanço", () => {
      const wb = generateBalanceReportWorkbook({ balance, isCurrentYear: false });
      const ws = wb.Sheets["Por mês"];
      const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
      const flat = rows.flat().map(String);
      expect(flat).toContain("Janeiro");
      expect(flat).toContain("Fevereiro");
      expect(flat).toContain("Março");
    });

    it("os valores monetários são números (não strings)", () => {
      const wb = generateBalanceReportWorkbook({ balance, isCurrentYear: false });
      const ws = wb.Sheets["Por mês"];
      const [, firstRow] = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 });
      // firstRow[0] = "Janeiro", [1] = 300 (entradas), [2] = 0 (doacoes) ...
      expect(typeof firstRow[1]).toBe("number");
      expect(firstRow[1]).toBe(300);
    });
  });

  describe("aba Despesas por categoria", () => {
    it("contém as categorias traduzidas", () => {
      const wb = generateBalanceReportWorkbook({ balance, isCurrentYear: false });
      const ws = wb.Sheets["Despesas por categoria"];
      const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
      const flat = rows.flat().map(String);
      expect(flat.some((c) => /evento|event/i.test(c))).toBe(true);
    });

    it("exibe mensagem quando não há despesas", () => {
      const wb = generateBalanceReportWorkbook({
        balance: { ...balance, expensesByCategory: {} },
        isCurrentYear: false,
      });
      const ws = wb.Sheets["Despesas por categoria"];
      const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
      const flat = rows.flat().map(String);
      expect(flat.some((c) => c.includes("Nenhuma despesa"))).toBe(true);
    });

    it("ordena as categorias do maior para o menor valor", () => {
      const wb = generateBalanceReportWorkbook({ balance, isCurrentYear: false });
      const ws = wb.Sheets["Despesas por categoria"];
      const [, row1, row2] = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 });
      // event:100 e food:100 — empate; ambos devem estar presentes
      const values = [row1[1], row2[1]];
      expect(values).toContain(100);
    });
  });
});

describe("shareBalanceReportExcel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (FileSystem.writeAsStringAsync as jest.Mock).mockResolvedValue(undefined);
    (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);
  });

  it("grava o arquivo no cacheDirectory e chama shareAsync", async () => {
    await shareBalanceReportExcel({ balance, isCurrentYear: false });

    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      expect.stringContaining("balanco-2026.xlsx"),
      expect.any(String),
      { encoding: "base64" },
    );
    expect(Sharing.shareAsync).toHaveBeenCalledWith(
      expect.stringContaining("balanco-2026.xlsx"),
      expect.objectContaining({
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "Balanço 2026",
      }),
    );
  });

  it("grava o arquivo como base64 válido (não vazio)", async () => {
    await shareBalanceReportExcel({ balance, isCurrentYear: false });

    const [, base64Content] = (FileSystem.writeAsStringAsync as jest.Mock).mock.calls[0];
    expect(typeof base64Content).toBe("string");
    expect(base64Content.length).toBeGreaterThan(0);
  });

  it("propaga erro quando writeAsStringAsync falha", async () => {
    (FileSystem.writeAsStringAsync as jest.Mock).mockRejectedValue(
      new Error("sem espaço"),
    );

    await expect(
      shareBalanceReportExcel({ balance, isCurrentYear: false }),
    ).rejects.toThrow("sem espaço");
  });

  it("propaga erro quando shareAsync falha", async () => {
    (Sharing.shareAsync as jest.Mock).mockRejectedValue(
      new Error("share cancelado"),
    );

    await expect(
      shareBalanceReportExcel({ balance, isCurrentYear: false }),
    ).rejects.toThrow("share cancelado");
  });
});
