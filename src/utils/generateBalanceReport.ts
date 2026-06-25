import { ThemeMode } from "@/context/ThemeContext";
import { IAnnualBalance } from "@/types/Balance";
import { EXPENSE_CATEGORY_LABELS, ExpenseCategory } from "@/types/Expense";
import { formatMoneyBRL } from "@/utils/helper";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const MONTH_LABELS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const THEME_COLORS = {
  light: {
    body: "#FAFAFA",
    bodyText: "#1a1a1a",
    cardBg: "#FFFFFF",
    cardBorder: "#E5E5E5",
    muted: "#666666",
    primary: "#6B4F3A",
    success: "#1E7F43",
    error: "#C0392B",
    rowBorder: "#F0F0F0",
    headBg: "#F4F1EC",
    footerText: "#999999",
  },
  dark: {
    body: "#1A1812",
    bodyText: "#EDE0B8",
    cardBg: "#252118",
    cardBorder: "rgba(255,255,255,0.08)",
    muted: "#8A7D5A",
    primary: "#C9A055",
    success: "#4CAF6B",
    error: "#E07A6B",
    rowBorder: "rgba(255,255,255,0.06)",
    headBg: "#2E2A1E",
    footerText: "#4A3F28",
  },
};

const netColor = (value: number, C: (typeof THEME_COLORS)["light"]) =>
  value >= 0 ? C.success : C.error;

const signed = (value: number) =>
  `${value >= 0 ? "+" : "−"}${formatMoneyBRL(Math.abs(value))}`;

export const generateBalanceReportHTML = ({
  balance,
  isCurrentYear,
  themeMode = "light",
}: {
  balance: IAnnualBalance;
  isCurrentYear: boolean;
  themeMode?: ThemeMode;
}): string => {
  const C = THEME_COLORS[themeMode];

  const cutoffLabel = isCurrentYear
    ? `Acumulado até ${MONTH_LABELS[balance.asOfMonth - 1] ?? "o mês atual"}`
    : "Ano fechado";

  const generatedAt = new Date().toLocaleString("pt-BR");

  const monthRows = balance.byMonth
    .map(
      (m) => `
      <tr>
        <td class="month">${MONTH_LABELS[m.month - 1] ?? m.month}</td>
        <td class="num in">${formatMoneyBRL(m.entradas)}</td>
        <td class="num out">${formatMoneyBRL(m.saidas)}</td>
        <td class="num" style="color:${netColor(m.resultado, C)}">${signed(m.resultado)}</td>
        <td class="num strong" style="color:${netColor(m.saldoAcumulado, C)}">${formatMoneyBRL(m.saldoAcumulado)}</td>
      </tr>`,
    )
    .join("");

  const categoryEntries = Object.entries(balance.expensesByCategory).sort(
    (a, b) => b[1] - a[1],
  );

  const categoryRows = categoryEntries.length
    ? categoryEntries
        .map(
          ([cat, value]) => `
        <tr>
          <td>${EXPENSE_CATEGORY_LABELS[cat as ExpenseCategory] ?? cat}</td>
          <td class="num out">${formatMoneyBRL(value)}</td>
        </tr>`,
        )
        .join("")
    : `<tr><td colspan="2" class="empty">Nenhuma despesa registrada no período.</td></tr>`;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <style>
    body {
      font-family: Helvetica, Arial, sans-serif;
      padding: 36px;
      background-color: ${C.body};
      color: ${C.bodyText};
      font-size: 13px;
    }
    .title { font-size: 22px; font-weight: 700; color: ${C.primary}; margin: 0; }
    .subtitle { font-size: 13px; color: ${C.muted}; margin: 4px 0 0; }
    .summary { display: flex; gap: 12px; margin: 24px 0; }
    .summaryCard {
      flex: 1; background: ${C.cardBg}; border: 1px solid ${C.cardBorder};
      border-radius: 10px; padding: 14px;
    }
    .summaryLabel { font-size: 11px; color: ${C.muted}; text-transform: uppercase; letter-spacing: .5px; }
    .summaryValue { font-size: 20px; font-weight: 700; margin-top: 6px; }
    .sectionTitle { font-size: 15px; font-weight: 700; margin: 26px 0 10px; }
    table { width: 100%; border-collapse: collapse; background: ${C.cardBg};
      border: 1px solid ${C.cardBorder}; border-radius: 10px; overflow: hidden; }
    th { background: ${C.headBg}; color: ${C.muted}; font-size: 11px;
      text-align: left; padding: 10px 12px; text-transform: uppercase; letter-spacing: .4px; }
    td { padding: 10px 12px; border-top: 1px solid ${C.rowBorder}; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .month { font-weight: 600; }
    .in { color: ${C.success}; }
    .out { color: ${C.error}; }
    .strong { font-weight: 700; }
    .empty { color: ${C.muted}; text-align: center; }
    .footer { margin-top: 28px; font-size: 11px; color: ${C.footerText}; text-align: center; }
  </style>
</head>
<body>
  <p class="title">Balanço Anual · ${balance.year}</p>
  <p class="subtitle">${cutoffLabel}</p>

  <div class="summary">
    <div class="summaryCard">
      <div class="summaryLabel">Entradas</div>
      <div class="summaryValue" style="color:${C.success}">${formatMoneyBRL(balance.totals.entradas)}</div>
    </div>
    <div class="summaryCard">
      <div class="summaryLabel">Saídas</div>
      <div class="summaryValue" style="color:${C.error}">${formatMoneyBRL(balance.totals.saidas)}</div>
    </div>
    <div class="summaryCard">
      <div class="summaryLabel">Saldo</div>
      <div class="summaryValue" style="color:${netColor(balance.totals.saldoFinal, C)}">${formatMoneyBRL(balance.totals.saldoFinal)}</div>
    </div>
  </div>

  <div class="sectionTitle">Por mês</div>
  <table>
    <thead>
      <tr>
        <th>Mês</th>
        <th style="text-align:right">Entradas</th>
        <th style="text-align:right">Saídas</th>
        <th style="text-align:right">Resultado</th>
        <th style="text-align:right">Saldo acum.</th>
      </tr>
    </thead>
    <tbody>${monthRows}</tbody>
  </table>

  <div class="sectionTitle">Despesas por categoria</div>
  <table>
    <thead>
      <tr><th>Categoria</th><th style="text-align:right">Total</th></tr>
    </thead>
    <tbody>${categoryRows}</tbody>
  </table>

  <p class="footer">Relatório gerado pelo app Resgatar em ${generatedAt}.</p>
</body>
</html>
`;
};

export const shareBalanceReportPDF = async (params: {
  balance: IAnnualBalance;
  isCurrentYear: boolean;
  themeMode?: ThemeMode;
}): Promise<void> => {
  const html = generateBalanceReportHTML(params);

  const { uri } = await Print.printToFileAsync({ html, base64: false });

  await Sharing.shareAsync(uri, {
    mimeType: "application/pdf",
    dialogTitle: `Balanço ${params.balance.year}`,
    UTI: "com.adobe.pdf",
  });
};
