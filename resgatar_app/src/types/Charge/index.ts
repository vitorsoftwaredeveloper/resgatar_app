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
    qrCode?: string;
    qrCodeBase64?: string;
    ticketUrl?: string;
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

export { ICharge, TRANSACTION_STATUS };
