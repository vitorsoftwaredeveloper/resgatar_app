interface IMemberState {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  bio: string;
  dateOfBirth: number;
  street: string;
  number: string;
  city: string;
  state: string;
  zip: string;
  complement: string;
  datePayment: string;
  amount: string;
  type: "CNPJ" | "CPF";
  numberType: string;
}

interface IMember {
  email: string;
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
    amount: string;
  };
  identification: {
    type: "CPF" | "CNPJ";
    numberType: string;
  };
  role?: "admin" | "user";
}

export { IMember, IMemberState };
