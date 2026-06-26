// Domínio de despesas mensais (saída de caixa), espelhando o backend
// `expenses`. Valores monetários trafegam como string "0,00" (mesmo padrão de
// `paymentInfo.amount` / charges). `referenceMonth` é 0-indexado (0 = janeiro),
// igual ao Model do backend e ao query param dos endpoints — diferente de
// charges, que usa 1–12. `date` é um timestamp em ms.

// Categorias fixas — espelham EXPENSE_CATEGORIES do backend (valores idênticos).
const EXPENSE_CATEGORIES = {
  MAINTENANCE: "maintenance",
  EVENT: "event",
  MATERIAL: "material",
  FOOD: "food",
  DONATION: "donation",
  UTILITIES: "utilities",
  TRANSPORT: "transport",
  OTHER: "other",
} as const;

type ExpenseCategory =
  (typeof EXPENSE_CATEGORIES)[keyof typeof EXPENSE_CATEGORIES];

const EXPENSE_CATEGORY_VALUES = Object.values(
  EXPENSE_CATEGORIES,
) as ExpenseCategory[];

// Rótulos PT-BR para exibição na UI (seletor e lista).
const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  maintenance: "Manutenção",
  event: "Evento",
  material: "Material",
  food: "Alimentação",
  donation: "Doação",
  utilities: "Contas/Utilidades",
  transport: "Transporte",
  other: "Outros",
};

// Payload de criação aceito pelo backend (POST /expenses).
interface ICreateExpensePayload {
  description: string;
  amount: string;
  category: ExpenseCategory;
  referenceMonth: number;
  referenceYear: number;
  date: number;
  note?: string;
  // Key do comprovante no S3 (ex.: receipts/<adminId>/<uuid>.jpg). A imagem em
  // si fica no bucket — aqui trafega só o ponteiro. Ver ExpenseServices.upload-
  // Receipt para o fluxo de upload via URL pré-assinada.
  receiptKey?: string;
}

// Na edição, `receiptKey: null` remove o comprovante existente (o backend
// aceita nullable). `undefined`/ausente mantém o atual.
type IEditExpensePayload = Partial<Omit<ICreateExpensePayload, "receiptKey">> & {
  receiptKey?: string | null;
};

// Despesa retornada pelo backend (DTO).
interface IExpense {
  _id: string;
  description: string;
  amount: string;
  category: ExpenseCategory;
  referenceMonth: number;
  referenceYear: number;
  date: number;
  note?: string;
  receiptKey?: string;
  adminId: string;
}

// Resumo agregado de um mês (GET /expenses/summary), pronto para o balanço.
interface IExpensesSummary {
  year: number;
  month: number;
  total: number;
  count: number;
  byCategory: Record<string, number>;
  expenses: IExpense[];
}

export {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_VALUES,
  EXPENSE_CATEGORY_LABELS,
  ExpenseCategory,
  ICreateExpensePayload,
  IEditExpensePayload,
  IExpense,
  IExpensesSummary,
};
