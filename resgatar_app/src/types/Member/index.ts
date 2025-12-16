interface IMember {
  email: string;
  phoneNumber: string;
  role: "admin" | "user";
  paymentInfo: {
    datePayment: number;
    amount: number;
  };
  identification: {
    type: "CPF" | "CNPJ";
    number: string;
  };
  status: "active" | "defaulter";
  firstName: string;
  lastName: string;
}

export { IMember };
