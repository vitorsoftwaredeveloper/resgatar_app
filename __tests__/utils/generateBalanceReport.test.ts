jest.mock("expo-print", () => ({ printToFileAsync: jest.fn() }));
jest.mock("expo-sharing", () => ({ shareAsync: jest.fn() }));

import {
  generateBalanceReportHTML,
  shareBalanceReportPDF,
} from "@/utils/generateBalanceReport";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const balance = {
  year: 2026,
  asOfMonth: 3,
  totals: { entradas: 900, saidas: 200, resultado: 700, saldoFinal: 700 },
  byMonth: [
    { month: 1, entradas: 300, saidas: 0, resultado: 300, saldoAcumulado: 300 },
    { month: 2, entradas: 300, saidas: 100, resultado: 200, saldoAcumulado: 500 },
    { month: 3, entradas: 300, saidas: 100, resultado: 200, saldoAcumulado: 700 },
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
