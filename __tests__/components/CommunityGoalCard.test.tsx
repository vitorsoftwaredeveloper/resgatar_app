const mockGetGoalProgress = jest.fn();

jest.mock("@/components/CoachTarget", () => {
  const React = require("react");
  return {
    CoachTarget: ({ children }: any) =>
      React.createElement(React.Fragment, null, children),
  };
});

jest.mock("@react-navigation/native", () => {
  const React = require("react");
  return {
    // useFocusEffect real roda após o commit (como useEffect), não no render.
    useFocusEffect: (cb: any) =>
      React.useEffect(() => {
        cb();
      }, [cb]),
  };
});

jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: {
      primary: "#6B4F3A",
      text: "#3E2F23",
      textMuted: "#8C7A6B",
      success: "#1E7F43",
      error: "#E53935",
      waiting: "#E0B96A",
      info: "#3B6DF6",
      softBrown: "#EDE6DE",
      card: "#FFF",
      border: "#DED6CC",
    },
    mode: "light",
  }),
}));

jest.mock("@/services/ChargeService", () => ({
  ChargeServices: {
    getGoalProgress: (...args: any[]) => mockGetGoalProgress(...args),
  },
}));

jest.mock("lucide-react-native", () => ({
  Banknote: () => null,
  CircleCheck: () => null,
  HandHeart: () => null,
  Target: () => null,
  Wallet: () => null,
}));

// O skeleton usa react-native-reanimated (não transformado pelo jest); aqui
// só interessa a lógica do card, então mockamos o placeholder.
jest.mock("@/components/Skeleton/CommunityGoalCardSkeleton", () => ({
  CommunityGoalCardSkeleton: () => null,
}));

import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { CommunityGoalCard } from "@/components/CommunityGoalCard";

const base = {
  year: 2026,
  month: 6,
  goal: 4800,
  dues: 4200,
  collected: 3100,
  donations: 900,
  expenses: 300,
  remaining: 1700,
  percent: 64.58,
  donationItems: [],
};

describe("CommunityGoalCard", () => {
  beforeEach(() => jest.clearAllMocks());

  it("exibe o percentual arredondado e o mês", async () => {
    mockGetGoalProgress.mockResolvedValue(base);
    const { getByText } = render(<CommunityGoalCard />);

    await waitFor(() => expect(getByText("65%")).toBeTruthy());
    expect(getByText("Meta da comunidade · Junho")).toBeTruthy();
    expect(getByText("no caminho certo")).toBeTruthy();
  });

  it.each([
    [20, "#E53935"],
    [50, "#E0B96A"],
    [80, "#1E7F43"],
    [100, "#1E7F43"],
  ])("usa a cor de feedback para %i%%", async (percent, color) => {
    mockGetGoalProgress.mockResolvedValue({ ...base, percent });
    const { getByText } = render(<CommunityGoalCard />);

    const node = await waitFor(() => getByText(`${percent}%`));
    const style = Object.assign(
      {},
      ...[node.props.style].flat(Infinity).filter(Boolean),
    );
    expect(style.color).toBe(color);
  });

  it("exibe quanto falta em reais na caixa de destaque", async () => {
    mockGetGoalProgress.mockResolvedValue(base);
    const { getByText, queryByText, getAllByText } = render(
      <CommunityGoalCard />,
    );

    await waitFor(() => expect(getByText("65%")).toBeTruthy());
    expect(queryByText(/para a meta/)).not.toBeNull();
    expect(getAllByText(/R\$/).length).toBeGreaterThan(0);
  });

  it("exibe mensalidades, doações e despesas do mês", async () => {
    mockGetGoalProgress.mockResolvedValue(base);
    const { getByText } = render(<CommunityGoalCard />);

    await waitFor(() => expect(getByText("65%")).toBeTruthy());
    expect(getByText("Mensalidades")).toBeTruthy();
    expect(getByText("R$ 3.100,00")).toBeTruthy();
    expect(getByText("Doações")).toBeTruthy();
    expect(getByText("+R$ 900,00")).toBeTruthy();
    expect(getByText("Despesas")).toBeTruthy();
    expect(getByText("−R$ 300,00")).toBeTruthy();
  });

  it("exibe estado de meta atingida quando remaining <= 0", async () => {
    mockGetGoalProgress.mockResolvedValue({
      ...base,
      collected: 4800,
      remaining: 0,
      percent: 100,
    });
    const { getByText } = render(<CommunityGoalCard />);

    await waitFor(() => expect(getByText("100%")).toBeTruthy());
    expect(getByText("meta atingida!")).toBeTruthy();
    expect(getByText("Meta atingida!")).toBeTruthy();
    expect(
      getByText("Obrigado a todos que contribuíram para esse resultado!"),
    ).toBeTruthy();
  });

  it("não renderiza nada quando a requisição falha", async () => {
    mockGetGoalProgress.mockRejectedValue(new Error("network"));
    const { queryByText } = render(<CommunityGoalCard />);

    await waitFor(() => expect(mockGetGoalProgress).toHaveBeenCalled());
    expect(queryByText(/Meta da comunidade/)).toBeNull();
  });

  it("mostra estado vazio quando não há meta definida", async () => {
    mockGetGoalProgress.mockResolvedValue({ ...base, percent: NaN });
    const { getByText } = render(<CommunityGoalCard />);

    await waitFor(() =>
      expect(getByText("Nenhuma meta definida para este mês")).toBeTruthy(),
    );
  });
});
