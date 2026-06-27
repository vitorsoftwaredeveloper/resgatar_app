interface ICharge {
  transactionId: string;
  memberId: string;
  status: string;
  statusDetail: string;
  transactionAmount: number;
  paymentMethodId: string;
  currencyId: string;
  dateCreated: string;
  dateOfExpiration: string;
  dateApproved?: string;
  payer: {
    firstName: string;
    lastName: string;
    email: string;
    identification: {
      type: string;
      numberType: string;
    };
  };
  transactionData: {
    qrCode: string;
    qrCodeBase64?: string;
    ticketUrl: string;
  };
}

// Resumo agregado de um mês de arrecadação, consumido pelo painel de admin.
// O backend calcula a meta como a soma dos `paymentInfo.amount` dos membros.
interface IChargeSummaryMember {
  id: string;
  name: string;
  photo?: string | null;
  paid: boolean;
  method?: "pix" | "cash";
  paidAt?: string;
  amount: number;
}

interface IChargeSummary {
  goal: number;
  collected: number;
  remaining: number;
  byMethod: {
    pix: number;
    cash: number;
  };
  counts: {
    paid: number;
    pending: number;
    total: number;
  };
  members: IChargeSummaryMember[];
}

// Progresso da meta do mês, exposto a todos os membros (sem dados por membro).
// `percent` é 0–100; `month` é 1-indexado.
interface IGoalProgress {
  year: number;
  month: number;
  goal: number;
  collected: number;
  remaining: number;
  percent: number;
}

// Balanço anual (year-to-date) consumido pelo painel de admin via
// /charges/annual-summary. `asOfMonth` é o corte: ano corrente conta só até o
// mês atual, anos passados fecham os 12. Valores monetários são números.
interface IAnnualMethodSplit {
  pix: number;
  cash: number;
}

interface IAnnualByMonth {
  month: number;
  goal: number;
  collected: number;
  remaining: number;
  percent: number;
  counts: {
    paid: number;
    pending: number;
    total: number;
  };
  byMethod: IAnnualMethodSplit;
}

interface IAnnualByMember {
  id: string;
  name: string;
  photo?: string | null;
  status: string;
  monthsPaid: number;
  monthsPending: number;
  totalPaid: number;
  totalDue: number;
  byMethod: IAnnualMethodSplit;
}

interface IAnnualSummary {
  year: number;
  asOfMonth: number;
  totals: {
    goal: number;
    collected: number;
    remaining: number;
    percent: number;
    byMethod: IAnnualMethodSplit;
    counts: {
      paid: number;
      pending: number;
    };
  };
  byMonth: IAnnualByMonth[];
  byMember: IAnnualByMember[];
}

const TRANSACTION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
  CHARGED_BACK: "charged_back",
};

// Transações cujo dinheiro voltou para quem pagou: não entram em nenhum total
// nem aparecem nas listas (cobranças e doações). Mesmo que tenham sido
// aprovadas antes, o valor não está mais em caixa.
const RETURNED_TRANSACTION_STATUSES: string[] = [
  TRANSACTION_STATUS.REFUNDED,
  TRANSACTION_STATUS.CHARGED_BACK,
];

const isReturnedTransaction = (status?: string): boolean =>
  status != null && RETURNED_TRANSACTION_STATUSES.includes(status);

// Valor enviado pelo backend no campo `data.type` do push (FCM) quando o
// webhook do Mercado Pago confirma a atualização de uma cobrança.
const PAYMENT_NOTIFICATION_TYPE = "PAYMENT_UPDATE";

// Push enviado pelo backend quando um pagamento é confirmado (PIX ou dinheiro).
// O campo `data.paymentMethod` distingue o método: "cash" ou ausente para PIX.
const PAYMENT_CONFIRMED_NOTIFICATION_TYPE = "PAYMENT_CONFIRMED";

export {
  ICharge,
  IChargeSummary,
  IChargeSummaryMember,
  IGoalProgress,
  IAnnualSummary,
  IAnnualByMonth,
  IAnnualByMember,
  TRANSACTION_STATUS,
  isReturnedTransaction,
  PAYMENT_NOTIFICATION_TYPE,
  PAYMENT_CONFIRMED_NOTIFICATION_TYPE,
};
