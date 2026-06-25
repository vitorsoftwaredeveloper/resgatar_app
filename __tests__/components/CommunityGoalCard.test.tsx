const mockGetGoalProgress = jest.fn();

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
  CircleCheck: () => null,
  UsersRound: () => null,
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
  collected: 3100,
  remaining: 1700,
  percent: 64.58,
};

describe("CommunityGoalCard", () => {
  beforeEach(() => jest.clearAllMocks());

  it("exibe o percentual arredondado e o mês", async () => {
    mockGetGoalProgress.mockResolvedValue(base);
    const { getByText } = render(<CommunityGoalCard />);

    await waitFor(() => expect(getByText("65%")).toBeTruthy());
    expect(getByText("Meta da comunidade · Junho")).toBeTruthy();
    expect(getByText("da meta atingida")).toBeTruthy();
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

  it("não exibe valores em reais (nem quanto falta)", async () => {
    mockGetGoalProgress.mockResolvedValue(base);
    const { getByText, queryByText } = render(<CommunityGoalCard />);

    await waitFor(() => expect(getByText("65%")).toBeTruthy());
    expect(queryByText(/R\$/)).toBeNull();
    expect(queryByText(/para a meta/)).toBeNull();
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
    expect(
      getByText("Meta atingida! Obrigado a todos que contribuíram."),
    ).toBeTruthy();
  });

  it("não renderiza nada quando a requisição falha", async () => {
    mockGetGoalProgress.mockRejectedValue(new Error("network"));
    const { queryByText } = render(<CommunityGoalCard />);

    await waitFor(() => expect(mockGetGoalProgress).toHaveBeenCalled());
    expect(queryByText(/Meta da comunidade/)).toBeNull();
  });

  it("não renderiza nada quando percent não é um número válido", async () => {
    mockGetGoalProgress.mockResolvedValue({ ...base, percent: NaN });
    const { queryByText } = render(<CommunityGoalCard />);

    await waitFor(() => expect(mockGetGoalProgress).toHaveBeenCalled());
    expect(queryByText(/Meta da comunidade/)).toBeNull();
  });
});
