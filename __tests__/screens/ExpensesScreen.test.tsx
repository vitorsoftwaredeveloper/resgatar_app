const mockGetSummary = jest.fn();
const mockRemove = jest.fn();
const mockGetReceiptViewUrl = jest.fn();
const mockGoBack = jest.fn();
const mockOpenURL = jest.fn();

jest.mock("react-native", () => {
  const React = require("react");
  const actual = jest.requireActual("react-native");
  return {
    ...actual,
    Linking: { openURL: (...args: any[]) => mockOpenURL(...args) },
    FlatList: ({
      data,
      renderItem,
      keyExtractor,
      ListHeaderComponent,
      ListEmptyComponent,
    }: any) => {
      const React = require("react");
      const resolve = (node: any) =>
        typeof node === "function" ? React.createElement(node) : node;
      const items =
        data && data.length
          ? data.map((item: any, index: number) =>
              React.createElement(
                React.Fragment,
                { key: keyExtractor ? keyExtractor(item, index) : index },
                renderItem({ item, index }),
              ),
            )
          : resolve(ListEmptyComponent);
      return React.createElement(
        "FlatList",
        null,
        resolve(ListHeaderComponent),
        items,
      );
    },
  };
});

jest.mock("@react-navigation/native", () => {
  const React = require("react");
  return {
    useNavigation: () => ({ goBack: mockGoBack }),
    useFocusEffect: (cb: any) =>
      React.useEffect(() => {
        cb();
      }, [cb]),
  };
});

jest.mock("@/context/AuthContext", () => {
  const React = require("react");
  return { AuthContext: React.createContext({ member: null }) };
});

jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: {
      primary: "#6B4F3A",
      background: "#F6F1EB",
      softBrown: "#EDE6DE",
      card: "#FFF",
      border: "#DED6CC",
      text: "#3E2F23",
      textStrong: "#3E2C1C",
      textMuted: "#8C7A6B",
      white: "#FFF",
      error: "#E53935",
    },
    mode: "light",
  }),
}));

jest.mock("@/services/ExpenseService", () => ({
  ExpenseServices: {
    getSummary: (...args: any[]) => mockGetSummary(...args),
    remove: (...args: any[]) => mockRemove(...args),
    getReceiptViewUrl: (...args: any[]) => mockGetReceiptViewUrl(...args),
  },
}));

jest.mock("@/utils/helper", () => ({
  formatMoneyBRL: (v: any) => `R$ ${v}`,
  formatDateFromTimestamp: () => "26/06/2026",
}));

jest.mock("@/components/Toast", () => ({
  ToastMessage: { error: jest.fn(), success: jest.fn() },
}));

jest.mock("@/components/Header", () => {
  const React = require("react");
  return { Header: () => React.createElement("View", { testID: "header" }) };
});

jest.mock("@/components/Dialog", () => {
  const React = require("react");
  return {
    Dialog: ({ visible, actions }: any) =>
      visible
        ? React.createElement(
            "View",
            { testID: "dialog" },
            actions?.map((a: any, i: number) =>
              React.createElement(
                "Text",
                { key: i, testID: `dialog-action-${a.label}`, onPress: a.onPress },
                a.label,
              ),
            ),
          )
        : null,
  };
});

// ModalExpenseForm não é foco deste teste — substituímos por stub.
jest.mock("@/screens/ExpensesScreen/ModalExpenseForm", () => {
  const React = require("react");
  return {
    ModalExpenseForm: ({ visible }: any) =>
      visible
        ? React.createElement("View", { testID: "modal-expense-form" })
        : null,
  };
});

jest.mock("lucide-react-native", () => ({
  ChevronLeft: () => null,
  ChevronRight: () => null,
  Pencil: () => null,
  Plus: () => null,
  Receipt: () => null,
  Trash2: () => null,
}));

import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { ExpensesScreen } from "@/screens/ExpensesScreen";
import { ToastMessage } from "@/components/Toast";

const expense = {
  _id: "exp1",
  description: "Material de limpeza",
  amount: "120,00",
  category: "material",
  referenceMonth: 5,
  referenceYear: 2026,
  date: 1750000000000,
  adminId: "admin1",
};

const expenseWithReceipt = {
  ...expense,
  _id: "exp2",
  description: "Conta de luz",
  receiptKey: "receipts/admin1/uuid.jpg",
};

const summary = {
  year: 2026,
  month: 5,
  total: 120,
  count: 1,
  byCategory: { material: 120 },
  expenses: [expense],
};

describe("ExpensesScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSummary.mockResolvedValue(summary);
  });

  it("exibe o total e os lançamentos após carregar", async () => {
    const { getAllByText, getByText } = render(<ExpensesScreen />);
    await waitFor(() => expect(getAllByText("R$ 120").length).toBeGreaterThan(0));
    expect(getByText("1 lançamento")).toBeTruthy();
  });

  it("lista a despesa do mês", async () => {
    const { getByText } = render(<ExpensesScreen />);
    await waitFor(() => expect(getByText("Material de limpeza")).toBeTruthy());
    expect(getByText("R$ 120,00")).toBeTruthy();
  });

  it("exibe mensagem de lista vazia quando não há despesas", async () => {
    mockGetSummary.mockResolvedValue({
      ...summary,
      total: 0,
      count: 0,
      expenses: [],
    });
    const { getByText } = render(<ExpensesScreen />);
    await waitFor(() =>
      expect(getByText("Nenhuma despesa lançada neste mês.")).toBeTruthy(),
    );
  });

  it("exibe toast de erro quando o carregamento falha", async () => {
    mockGetSummary.mockRejectedValue(new Error("network"));
    render(<ExpensesScreen />);
    await waitFor(() =>
      expect(ToastMessage.error).toHaveBeenCalledWith("Erro", expect.any(String)),
    );
  });

  it("abre o modal de criação ao pressionar o FAB", async () => {
    const { getByLabelText, getByTestId } = render(<ExpensesScreen />);
    await waitFor(() => getByLabelText("Nova despesa"));

    await act(async () => {
      fireEvent.press(getByLabelText("Nova despesa"));
    });

    expect(getByTestId("modal-expense-form")).toBeTruthy();
  });

  it("abre o modal de edição ao pressionar Editar", async () => {
    const { getByLabelText, getByTestId } = render(<ExpensesScreen />);
    await waitFor(() => getByLabelText("Editar despesa"));

    await act(async () => {
      fireEvent.press(getByLabelText("Editar despesa"));
    });

    expect(getByTestId("modal-expense-form")).toBeTruthy();
  });

  it("expande e recolhe os detalhes ao pressionar o item", async () => {
    const { getByText, getAllByText, queryByText } = render(<ExpensesScreen />);
    await waitFor(() => getByText("Material de limpeza"));

    // Antes de expandir, a linha de referência não existe
    expect(queryByText("Referência")).toBeNull();

    await act(async () => {
      fireEvent.press(getByText("Material de limpeza"));
    });

    expect(getByText("Referência")).toBeTruthy();
    // "Junho 2026" aparece no seletor de mês e nos detalhes; basta confirmar presença.
    const juniOccurrences = await waitFor(() => getAllByText("Junho 2026"));
    expect(juniOccurrences.length).toBeGreaterThan(0);

    // Recolhe ao pressionar novamente
    await act(async () => {
      fireEvent.press(getByText("Material de limpeza"));
    });

    expect(queryByText("Referência")).toBeNull();
  });

  it("mostra 'Observação' e '—' quando não há nota", async () => {
    const { getByText, getAllByText } = render(<ExpensesScreen />);
    await waitFor(() => getByText("Material de limpeza"));

    await act(async () => {
      fireEvent.press(getByText("Material de limpeza"));
    });

    expect(getByText("Observação")).toBeTruthy();
    expect(getByText("—")).toBeTruthy();
  });

  it("remove a despesa ao confirmar o Dialog", async () => {
    mockRemove.mockResolvedValueOnce(undefined);
    const { getByLabelText, getByTestId, getByText } = render(<ExpensesScreen />);
    await waitFor(() => getByLabelText("Remover item"));

    await act(async () => {
      fireEvent.press(getByLabelText("Remover item"));
    });

    await waitFor(() => expect(getByTestId("dialog")).toBeTruthy());

    await act(async () => {
      fireEvent.press(getByText("remover"));
    });

    expect(mockRemove).toHaveBeenCalledWith("exp1");
    await waitFor(() =>
      expect(ToastMessage.success).toHaveBeenCalledWith("Despesa removida"),
    );
  });

  it("exibe toast de erro quando a remoção falha", async () => {
    mockRemove.mockRejectedValueOnce(new Error("falha"));
    const { getByLabelText, getByText } = render(<ExpensesScreen />);
    await waitFor(() => getByLabelText("Remover item"));

    await act(async () => {
      fireEvent.press(getByLabelText("Remover item"));
    });

    await waitFor(() => getByText("remover"));

    await act(async () => {
      fireEvent.press(getByText("remover"));
    });

    await waitFor(() =>
      expect(ToastMessage.error).toHaveBeenCalledWith("Erro", expect.any(String)),
    );
  });

  describe("comprovante", () => {
    beforeEach(() => {
      mockGetSummary.mockResolvedValue({
        ...summary,
        expenses: [expenseWithReceipt],
      });
    });

    it("abre o comprovante via Linking quando a URL é obtida", async () => {
      mockGetReceiptViewUrl.mockResolvedValueOnce("https://s3/view");
      const { getByLabelText } = render(<ExpensesScreen />);
      await waitFor(() => getByLabelText("Ver comprovante"));

      await act(async () => {
        fireEvent.press(getByLabelText("Ver comprovante"));
      });

      await waitFor(() =>
        expect(mockOpenURL).toHaveBeenCalledWith("https://s3/view"),
      );
    });

    it("exibe toast de erro quando a URL do comprovante falha", async () => {
      mockGetReceiptViewUrl.mockRejectedValueOnce(new Error("S3 error"));
      const { getByLabelText } = render(<ExpensesScreen />);
      await waitFor(() => getByLabelText("Ver comprovante"));

      await act(async () => {
        fireEvent.press(getByLabelText("Ver comprovante"));
      });

      await waitFor(() =>
        expect(ToastMessage.error).toHaveBeenCalledWith("Erro", expect.any(String)),
      );
    });

    it("mostra 'Anexado' nos detalhes expandidos quando há receiptKey", async () => {
      const { getByText } = render(<ExpensesScreen />);
      await waitFor(() => getByText("Conta de luz"));

      await act(async () => {
        fireEvent.press(getByText("Conta de luz"));
      });

      expect(getByText("Anexado")).toBeTruthy();
    });
  });

  it("navega para o mês anterior e recarrega", async () => {
    const { getByLabelText } = render(<ExpensesScreen />);
    await waitFor(() => getByLabelText("Mês anterior"));
    expect(mockGetSummary).toHaveBeenCalledTimes(1);

    await act(async () => {
      fireEvent.press(getByLabelText("Mês anterior"));
    });

    await waitFor(() => expect(mockGetSummary).toHaveBeenCalledTimes(2));
  });
});
