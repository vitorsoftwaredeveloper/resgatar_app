const mockList = jest.fn();

jest.mock("@react-navigation/native", () => {
  const React = require("react");
  return {
    useFocusEffect: (cb: any) => React.useEffect(() => { cb(); }, []),
  };
});
jest.mock("@/services/CommitmentService", () => ({
  CommitmentService: { list: (...args: any[]) => mockList(...args) },
}));
jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", text: "#3E2F23", textMuted: "#8C7A6B", card: "#FFF", border: "#DED6CC" },
    mode: "light",
  }),
}));
jest.mock("@/context/AuthContext", () => {
  const React = require("react");
  return { AuthContext: React.createContext({ member: { role: "member" } }) };
});
jest.mock("@/components/CoachTarget", () => {
  const React = require("react");
  return { CoachTarget: ({ children }: any) => React.createElement(React.Fragment, null, children) };
});
jest.mock("@/components/Skeleton/NoticesCardSkeleton", () => ({
  NoticesCardSkeleton: () => null,
}));
jest.mock("@/screens/NoticeBoardScreen", () => ({ NoticeBoardModal: () => null }));
jest.mock("lucide-react-native", () => ({ ChevronRight: () => null }));
jest.mock("@/utils/commitment", () => ({
  commitmentScheduleLabel: () => "Semanal",
  isCommitmentToday: () => false,
}));

import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { NoticesCard } from "@/components/NoticesCard";

const commitment = {
  id: "c1",
  title: "Reunião semanal",
  time: "19h",
  location: "Igreja",
  schedule: { type: "weekly", weekdays: [3] },
};

describe("NoticesCard", () => {
  beforeEach(() => jest.clearAllMocks());

  it("exibe o título do cabeçalho", async () => {
    mockList.mockResolvedValue([]);
    const { getByText } = render(<NoticesCard />);
    await waitFor(() => expect(getByText("Compromissos da comunidade")).toBeTruthy());
  });

  it("exibe mensagem de vazio quando não há compromissos", async () => {
    mockList.mockResolvedValue([]);
    const { getByText } = render(<NoticesCard />);
    await waitFor(() =>
      expect(getByText("Nenhum compromisso publicado ainda.")).toBeTruthy(),
    );
  });

  it("exibe título do compromisso carregado", async () => {
    mockList.mockResolvedValue([commitment]);
    const { getByText } = render(<NoticesCard />);
    await waitFor(() => expect(getByText("Reunião semanal")).toBeTruthy());
  });

  it("exibe localização e horário do compromisso", async () => {
    mockList.mockResolvedValue([commitment]);
    const { getByText } = render(<NoticesCard />);
    await waitFor(() => expect(getByText(/Igreja/)).toBeTruthy());
    expect(getByText(/19h/)).toBeTruthy();
  });

  it("exibe vazio quando a API falha", async () => {
    mockList.mockRejectedValue(new Error("network"));
    const { getByText } = render(<NoticesCard />);
    await waitFor(() =>
      expect(getByText("Nenhum compromisso publicado ainda.")).toBeTruthy(),
    );
  });
});
