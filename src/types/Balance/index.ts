// Balanço anual (year-to-date) que cruza entradas (arrecadação efetiva,
// `collected`) com saídas (despesas), consumido pelo painel de admin via
// GET /balance/annual. `month` é 1-indexado (1 = janeiro), alinhado ao annual
// summary de charges. Valores monetários são números. O saldo acumulado corre
// dentro do ano (jan → mês); o resultado mensal pode ser negativo.
interface IAnnualBalanceMonth {
  month: number;
  entradas: number;
  saidas: number;
  resultado: number;
  saldoAcumulado: number;
}

interface IAnnualBalance {
  year: number;
  asOfMonth: number;
  totals: {
    entradas: number;
    saidas: number;
    resultado: number;
    saldoFinal: number;
  };
  byMonth: IAnnualBalanceMonth[];
  expensesByCategory: Record<string, number>;
}

export { IAnnualBalance, IAnnualBalanceMonth };
