interface IMember {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  bio?: string;
  dateOfBirth: number;
  address?: {
    street?: string;
    number?: string;
    city?: string;
    state?: string;
    zip?: string;
    complement?: string;
  };
  paymentInfo: {
    datePayment: number;
    amount: number;
  };
  identification: {
    type: "CPF" | "CNPJ";
    number: string;
  };
  role?: "admin" | "user";
}

export { IMember };
