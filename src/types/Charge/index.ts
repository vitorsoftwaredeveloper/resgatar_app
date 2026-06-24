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

export { ICharge, TRANSACTION_STATUS, PAYMENT_NOTIFICATION_TYPE, PAYMENT_CONFIRMED_NOTIFICATION_TYPE };
