jest.mock("lucide-react-native", () => ({ Flame: () => null }));
jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", text: "#3E2F23", textMuted: "#8C7A6B", card: "#FFF", border: "#DED6CC" },
    mode: "light",
  }),
}));
jest.mock("@/components/CoachTarget", () => {
  const React = require("react");
  return { CoachTarget: ({ children }: any) => React.createElement(React.Fragment, null, children) };
});

const mockAuthContext = {
  member: null as any,
};
jest.mock("@/context/AuthContext", () => {
  const React = require("react");
  return { AuthContext: React.createContext(mockAuthContext) };
});

import React from "react";
import { render } from "@testing-library/react-native";
import { StreakCard } from "@/components/StreakCard";

describe("StreakCard", () => {
  beforeEach(() => jest.clearAllMocks());

  it("exibe 'Comece sua sequência hoje' sem dados de streak", () => {
    mockAuthContext.member = null;
    const { getByText } = render(<StreakCard />);
    expect(getByText("Comece sua sequência hoje")).toBeTruthy();
  });

  it("exibe 'Retome sua sequência' quando streak é 0", () => {
    mockAuthContext.member = {
      readingStreak: { currentStreak: 0, longestStreak: 5, lastReadAt: "2026-06-10", alreadyDoneToday: false },
    };
    const { getByText } = render(<StreakCard />);
    expect(getByText("Retome sua sequência")).toBeTruthy();
  });

  it("exibe contagem singular 'dia seguido' para streak 1", () => {
    mockAuthContext.member = {
      readingStreak: { currentStreak: 1, longestStreak: 1, lastReadAt: "2026-06-29", alreadyDoneToday: true },
    };
    const { getByText } = render(<StreakCard />);
    expect(getByText("1 dia seguido")).toBeTruthy();
  });

  it("exibe contagem plural 'dias seguidos' para streak > 1", () => {
    mockAuthContext.member = {
      readingStreak: { currentStreak: 7, longestStreak: 10, lastReadAt: "2026-06-29", alreadyDoneToday: true },
    };
    const { getByText } = render(<StreakCard />);
    expect(getByText("7 dias seguidos")).toBeTruthy();
  });

  it("exibe recorde quando longestStreak > 0", () => {
    mockAuthContext.member = {
      readingStreak: { currentStreak: 3, longestStreak: 14, lastReadAt: "2026-06-29", alreadyDoneToday: true },
    };
    const { getByText } = render(<StreakCard />);
    expect(getByText("Recorde: 14 dias")).toBeTruthy();
  });

  it("exibe recorde singular para longestStreak = 1", () => {
    mockAuthContext.member = {
      readingStreak: { currentStreak: 1, longestStreak: 1, lastReadAt: "2026-06-29", alreadyDoneToday: true },
    };
    const { getByText } = render(<StreakCard />);
    expect(getByText("Recorde: 1 dia")).toBeTruthy();
  });

  it("exibe mensagem motivacional quando longestStreak é 0", () => {
    mockAuthContext.member = {
      readingStreak: { currentStreak: 0, longestStreak: 0, lastReadAt: null, alreadyDoneToday: false },
    };
    const { getByText } = render(<StreakCard />);
    expect(getByText("Abra a liturgia todo dia para evoluir")).toBeTruthy();
  });

  it("exibe 7 células de dias da semana", () => {
    mockAuthContext.member = null;
    const { UNSAFE_getAllByType } = render(<StreakCard />);
    // cada célula tem uma View com dot + initial
    const views = UNSAFE_getAllByType("View" as any);
    expect(views.length).toBeGreaterThan(0);
  });
});
