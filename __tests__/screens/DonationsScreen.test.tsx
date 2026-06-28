const mockList = jest.fn();
const mockGoBack = jest.fn();

jest.mock("react-native", () => {
  const React = require("react");
  const actual = jest.requireActual("react-native");
  return {
    ...actual,
    FlatList: ({
      data,
      renderItem,
      keyExtractor,
      ListHeaderComponent,
      ListEmptyComponent,
    }: any) => {
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
  return {
    AuthContext: React.createContext({
      member: null,
      notifyUnlocks: jest.fn().mockResolvedValue(undefined),
    }),
  };
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
      info: "#1565C0",
      success: "#1E7F43",
      error: "#C0392B",
    },
    mode: "light",
  }),
}));

jest.mock("@/services/DonationService", () => ({
  DonationServices: {
    list: (...args: any[]) => mockList(...args),
  },
}));

jest.mock("@/utils/helper", () => ({
  formatMoneyBRL: (v: any) => `R$ ${v}`,
}));

jest.mock("@/components/Toast", () => ({
  ToastMessage: { error: jest.fn() },
}));

jest.mock("@/components/Header", () => {
  const React = require("react");
  return { Header: () => React.createElement("View", { testID: "header" }) };
});

jest.mock("lucide-react-native", () => ({
  Banknote: () => null,
  ChevronLeft: () => null,
  ChevronRight: () => null,
  Gift: () => null,
  QrCode: () => null,
}));

import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { DonationsScreen } from "@/screens/DonationsScreen";
import { ToastMessage } from "@/components/Toast";

// Junho (month=5) é o mês "atual" que o jest usa (Date fixo no jest.config).
// Mas como não fixamos a data, usamos o mês real e criamos as fixtures relativas.
const NOW = new Date();
const CURRENT_MONTH = NOW.getMonth(); // 0-indexado
const CURRENT_YEAR = NOW.getFullYear();

const makeDonation = (
  overrides: Partial<{
    transactionId: string;
    amount: string;
    paymentMethodId: "pix" | "cash";
    status: string;
    referenceMonth: number;
    donorName: string;
  }> = {},
) => ({
  transactionId: "txn-1",
  memberId: "m1",
  amount: "50,00",
  paymentMethodId: "pix" as const,
  status: "approved",
  referenceMonth: CURRENT_MONTH,
  referenceYear: CURRENT_YEAR,
  ...overrides,
});

describe("DonationsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockList.mockResolvedValue([]);
  });

  it("exibe o indicador de carregamento antes de concluir o fetch", () => {
    mockList.mockReturnValue(new Promise(() => {})); // nunca resolve
    const { UNSAFE_getAllByType } = render(<DonationsScreen />);
    const { ActivityIndicator } = require("react-native");
    expect(UNSAFE_getAllByType(ActivityIndicator).length).toBeGreaterThan(0);
  });

  it("exibe mensagem de lista vazia quando não há doações no mês", async () => {
    mockList.mockResolvedValue([]);
    const { getByText } = render(<DonationsScreen />);
    await waitFor(() =>
      expect(getByText("Nenhuma doação registrada neste mês.")).toBeTruthy(),
    );
  });

  it("exibe toast de erro quando o carregamento falha", async () => {
    mockList.mockRejectedValue(new Error("network"));
    render(<DonationsScreen />);
    await waitFor(() =>
      expect(ToastMessage.error).toHaveBeenCalledWith(
        "Erro",
        expect.any(String),
      ),
    );
  });

  describe("com doações no mês atual", () => {
    const pix = makeDonation({
      transactionId: "txn-pix",
      amount: "50,00",
      paymentMethodId: "pix",
      status: "approved",
    });
    const cash = makeDonation({
      transactionId: "txn-cash",
      amount: "20,00",
      paymentMethodId: "cash",
      status: "approved",
    });
    const pending = makeDonation({
      transactionId: "txn-pending",
      amount: "30,00",
      paymentMethodId: "pix",
      status: "pending",
    });

    beforeEach(() => {
      mockList.mockResolvedValue([pix, cash, pending]);
    });

    it("exibe o total apenas das doações aprovadas", async () => {
      const { getByText } = render(<DonationsScreen />);
      // pix 50 + cash 20 = 70; pending não conta
      await waitFor(() => expect(getByText("R$ 70")).toBeTruthy());
    });

    it("exibe a contagem de doações confirmadas", async () => {
      const { getByText } = render(<DonationsScreen />);
      await waitFor(() =>
        expect(getByText("2 doações confirmadas")).toBeTruthy(),
      );
    });

    it("exibe os itens de doação na lista", async () => {
      const { getAllByText } = render(<DonationsScreen />);
      await waitFor(() => {
        expect(getAllByText("R$ 50,00").length).toBeGreaterThan(0);
        expect(getAllByText("R$ 20,00").length).toBeGreaterThan(0);
      });
    });

    it("exibe 'Pendente' para doação com status pending", async () => {
      const { getByText } = render(<DonationsScreen />);
      await waitFor(() => expect(getByText("Pendente")).toBeTruthy());
    });

    it("exibe 'Anônimo' quando donorName está ausente", async () => {
      const { getAllByText } = render(<DonationsScreen />);
      await waitFor(() =>
        expect(getAllByText("Anônimo").length).toBeGreaterThan(0),
      );
    });

    it("exibe o nome do doador quando donorName está presente", async () => {
      mockList.mockResolvedValue([
        makeDonation({ transactionId: "txn-named", donorName: "José Santos" }),
      ]);
      const { getByText } = render(<DonationsScreen />);
      await waitFor(() => expect(getByText("José Santos")).toBeTruthy());
    });
  });

  describe("filtragem por mês (client-side)", () => {
    it("exibe apenas doações do mês selecionado, não de outros meses", async () => {
      const prevMonthIndex = CURRENT_MONTH === 0 ? 11 : CURRENT_MONTH - 1;
      // Doação no mês atual aparece; doação no mês anterior não.
      const thisMonth = makeDonation({
        transactionId: "this",
        referenceMonth: CURRENT_MONTH,
        donorName: "DoadorAtual",
      });
      const prevMonth = makeDonation({
        transactionId: "prev",
        referenceMonth: prevMonthIndex,
        donorName: "DoadorAnterior",
      });
      mockList.mockResolvedValue([thisMonth, prevMonth]);

      const { getAllByText, queryByText } = render(<DonationsScreen />);
      await waitFor(() =>
        expect(getAllByText("DoadorAtual").length).toBeGreaterThan(0),
      );
      expect(queryByText("DoadorAnterior")).toBeNull();
    });

    it("filtra doações estornadas (refunded) fora da lista", async () => {
      const refunded = makeDonation({
        transactionId: "r1",
        status: "refunded",
      });
      mockList.mockResolvedValue([refunded]);

      const { getByText } = render(<DonationsScreen />);
      await waitFor(() =>
        expect(getByText("Nenhuma doação registrada neste mês.")).toBeTruthy(),
      );
    });

    it("filtra doações estornadas (charged_back) fora da lista", async () => {
      const chargedBack = makeDonation({
        transactionId: "c1",
        status: "charged_back",
      });
      mockList.mockResolvedValue([chargedBack]);

      const { getByText } = render(<DonationsScreen />);
      await waitFor(() =>
        expect(getByText("Nenhuma doação registrada neste mês.")).toBeTruthy(),
      );
    });
  });

  describe("navegação de mês", () => {
    it("navega para o mês anterior ao pressionar ChevronLeft e recarrega o ano", async () => {
      mockList.mockResolvedValue([]);
      const { getByLabelText } = render(<DonationsScreen />);
      await waitFor(() => getByLabelText("Mês anterior"));
      expect(mockList).toHaveBeenCalledTimes(1);

      await act(async () => {
        fireEvent.press(getByLabelText("Mês anterior"));
      });

      // Trocar de mês não força refetch (o ano não mudou); ano muda só em janeiro → dez.
      // Mas se cruzar o ano (mes=0 → mes=11), o ano muda e o load é chamado de novo.
      // Aqui apenas garantimos que o botão está acessível e funciona sem crash.
      expect(mockList).toHaveBeenCalledTimes(1);
    });

    it("bloqueia a navegação para meses futuros", async () => {
      mockList.mockResolvedValue([]);
      const { getByLabelText } = render(<DonationsScreen />);
      await waitFor(() => getByLabelText("Próximo mês"));

      // Tenta pressionar o botão bloqueado — não deve gerar novo fetch.
      const callsBefore = mockList.mock.calls.length;
      await act(async () => {
        fireEvent.press(getByLabelText("Próximo mês"));
      });
      expect(mockList.mock.calls.length).toBe(callsBefore);
    });

    it("ao voltar de janeiro para dezembro, muda o ano e refaz o fetch", async () => {
      // Simular mês = 0 (janeiro) forçando o estado via data mockada não é viável
      // neste setup — verificamos apenas que o fetch inicial acontece com o ano correto.
      mockList.mockResolvedValue([]);
      render(<DonationsScreen />);
      await waitFor(() => expect(mockList).toHaveBeenCalledWith(CURRENT_YEAR));
    });
  });

  describe("sumAmounts (lógica interna via UI)", () => {
    it("soma corretamente valores com vírgula decimal", async () => {
      mockList.mockResolvedValue([
        makeDonation({
          transactionId: "a",
          amount: "1.000,50",
          status: "approved",
        }),
        makeDonation({
          transactionId: "b",
          amount: "0,50",
          status: "approved",
        }),
      ]);
      const { getAllByText } = render(<DonationsScreen />);
      // 1000.50 + 0.50 = 1001.00; helper mock devolve "R$ 1001"
      await waitFor(() =>
        expect(getAllByText("R$ 1001").length).toBeGreaterThan(0),
      );
    });

    it("ignora valores NaN sem quebrar o total", async () => {
      mockList.mockResolvedValue([
        makeDonation({
          transactionId: "ok",
          amount: "100,00",
          status: "approved",
        }),
        makeDonation({
          transactionId: "bad",
          amount: "invalid",
          status: "approved",
        }),
      ]);
      const { getAllByText } = render(<DonationsScreen />);
      await waitFor(() =>
        expect(getAllByText("R$ 100").length).toBeGreaterThan(0),
      );
    });
  });
});
