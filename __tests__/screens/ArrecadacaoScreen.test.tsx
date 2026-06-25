const mockGetSummary = jest.fn();
const mockGoBack = jest.fn();

// O mock compartilhado de react-native ignora ListHeaderComponent/ListEmptyComponent.
// A ArrecadacaoScreen coloca todo o resumo no header da FlatList, então
// estendemos o mock para renderizá-los.
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
    // useFocusEffect real roda após o commit (como useEffect), não no render.
    useFocusEffect: (cb: any) =>
      React.useEffect(() => {
        cb();
      }, [cb]),
  };
});

jest.mock("@/context/AuthContext", () => {
  const React = require("react");
  return { AuthContext: React.createContext({}) };
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
      success: "#1E7F43",
      error: "#E53935",
      info: "#3B6DF6",
    },
    mode: "light",
  }),
}));

jest.mock("@/services/ChargeService", () => ({
  ChargeServices: {
    getSummary: (...args: any[]) => mockGetSummary(...args),
  },
}));

jest.mock("@/utils/helper", () => ({
  formatMoneyBRL: (v: any) => `R$ ${v}`,
  formatDateFromTimestamp: () => "03/06/2026",
}));

jest.mock("@/components/Toast", () => ({
  ToastMessage: { error: jest.fn() },
}));

jest.mock("@/components/Header", () => {
  const React = require("react");
  return { Header: () => React.createElement("View", { testID: "header" }) };
});

jest.mock("@/components/Avatar", () => {
  const React = require("react");
  return { Avatar: () => React.createElement("View", { testID: "avatar" }) };
});

jest.mock("lucide-react-native", () => ({
  Banknote: () => null,
  ChevronLeft: () => null,
  ChevronRight: () => null,
  CircleAlert: () => null,
  CircleCheck: () => null,
  QrCode: () => null,
  Target: () => null,
}));

import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { ArrecadacaoScreen } from "@/screens/ArrecadacaoScreen";

const summary = {
  year: 2026,
  month: 6,
  goal: 4800,
  collected: 3100,
  remaining: 1700,
  byMethod: { pix: 2400, cash: 700 },
  counts: { paid: 2, pending: 1, total: 3 },
  members: [
    { id: "1", name: "Maria Andrade", photo: null, paid: true, method: "pix", paidAt: "2026-06-03", amount: 100 },
    { id: "2", name: "João Pereira", photo: null, paid: true, method: "cash", paidAt: "2026-06-05", amount: 120 },
    { id: "3", name: "Carla Souza", photo: null, paid: false, amount: 150 },
  ],
};

describe("ArrecadacaoScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSummary.mockResolvedValue(summary);
  });

  it("exibe o resumo do mês após carregar", async () => {
    const { getByText } = render(<ArrecadacaoScreen />);

    await waitFor(() => expect(getByText("65%")).toBeTruthy());
    expect(getByText("R$ 2400")).toBeTruthy();
    expect(getByText("R$ 700")).toBeTruthy();
    expect(getByText("Pagaram (2)")).toBeTruthy();
    expect(getByText("Inadimplentes (1)")).toBeTruthy();
  });

  it("lista os pagantes na aba Pagaram por padrão", async () => {
    const { getByText, queryByText } = render(<ArrecadacaoScreen />);

    await waitFor(() => expect(getByText("Maria Andrade")).toBeTruthy());
    expect(getByText("João Pereira")).toBeTruthy();
    expect(queryByText("Carla Souza")).toBeNull();
  });

  it("mostra os inadimplentes ao trocar de aba", async () => {
    const { getByText, queryByText } = render(<ArrecadacaoScreen />);
    await waitFor(() => getByText("Inadimplentes (1)"));

    await act(async () => {
      fireEvent.press(getByText("Inadimplentes (1)"));
    });

    await waitFor(() => expect(getByText("Carla Souza")).toBeTruthy());
    expect(queryByText("Maria Andrade")).toBeNull();
  });

  it("recarrega o resumo ao navegar para o mês anterior", async () => {
    const { getByText, getByLabelText } = render(<ArrecadacaoScreen />);
    await waitFor(() => getByText("65%"));
    expect(mockGetSummary).toHaveBeenCalledTimes(1);

    await act(async () => {
      fireEvent.press(getByLabelText("Mês anterior"));
    });

    await waitFor(() => expect(mockGetSummary).toHaveBeenCalledTimes(2));
  });

  it("informa quando não há contribuição prevista (goal = 0)", async () => {
    mockGetSummary.mockResolvedValue({
      ...summary,
      goal: 0,
      collected: 0,
      remaining: 0,
      byMethod: { pix: 0, cash: 0 },
      counts: { paid: 0, pending: 0, total: 0 },
      members: [],
    });

    const { getByText } = render(<ArrecadacaoScreen />);

    await waitFor(() =>
      expect(
        getByText("Nenhuma contribuição prevista neste mês."),
      ).toBeTruthy(),
    );
  });
});
