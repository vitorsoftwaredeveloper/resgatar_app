interface IMemberState {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  bio: string;
  dateOfBirth: string | number;
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
  _id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
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

type IMemberWithContribution = IMember & {
  contributions: {
    year: number;
    months: Record<
      | "january"
      | "february"
      | "march"
      | "april"
      | "may"
      | "june"
      | "july"
      | "august"
      | "september"
      | "october"
      | "november"
      | "december",
      { paid: boolean; value: number; paidAt: string }
    >;
  };
};

export { IMember, IMemberState, IMemberWithContribution };
