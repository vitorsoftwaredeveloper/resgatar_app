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

const TRANSACTION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
  CHARGED_BACK: "charged_back",
};

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
  TRANSACTION_STATUS,
  PAYMENT_NOTIFICATION_TYPE,
  PAYMENT_CONFIRMED_NOTIFICATION_TYPE,
};
