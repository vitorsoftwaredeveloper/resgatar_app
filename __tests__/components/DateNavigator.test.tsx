jest.mock("lucide-react-native", () => ({
  ChevronLeft: () => null,
  ChevronRight: () => null,
  Clock: () => null,
}));
jest.mock("@/context/CoachContext", () => ({
  useCoach: () => ({ registerTarget: jest.fn(), unregisterTarget: jest.fn() }),
}));
jest.mock("@/components/CoachTarget", () => {
  const React = require("react");
  return { CoachTarget: ({ children }: any) => children };
});
jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", text: "#000", textMuted: "#999", border: "#ccc" },
    mode: "light",
  }),
}));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { DateNavigator } from "@/components/DateNavigator";

const TODAY = new Date(2026, 5, 17); // quarta-feira

const defaultProps = {
  selectedDate: TODAY,
  onPrev: jest.fn(),
  onNext: jest.fn(),
  onOpenCalendar: jest.fn(),
  onBackToToday: jest.fn(),
};

describe("DateNavigator", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("renderização", () => {
    it("exibe os 7 dias da semana", () => {
      const { getByText } = render(<DateNavigator {...defaultProps} />);
      ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].forEach((d) => {
        expect(getByText(d)).toBeTruthy();
      });
    });

    it("exibe a data formatada no centro", () => {
      const { getByText } = render(<DateNavigator {...defaultProps} />);
      expect(getByText(/quarta/i)).toBeTruthy();
      expect(getByText(/junho/i)).toBeTruthy();
    });

    it("não exibe 'Voltar para hoje' quando selectedDate é hoje", () => {
      const realToday = new Date();
      realToday.setHours(0, 0, 0, 0);
      const { queryByText } = render(
        <DateNavigator {...defaultProps} selectedDate={realToday} />,
      );
      expect(queryByText("Voltar para hoje")).toBeNull();
    });

    it("exibe 'Voltar para hoje' quando selectedDate não é hoje", () => {
      const past = new Date(2026, 0, 1);
      const { getByText } = render(
        <DateNavigator {...defaultProps} selectedDate={past} />,
      );
      expect(getByText("Voltar para hoje")).toBeTruthy();
    });
  });

  describe("navegação", () => {
    it("chama onPrev ao pressionar seta esquerda", () => {
      const onPrev = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <DateNavigator {...defaultProps} onPrev={onPrev} />,
      );
      // índice 0 = seta esquerda na navRow
      fireEvent.press(UNSAFE_getAllByType("Pressable" as any)[0]);
      expect(onPrev).toHaveBeenCalledTimes(1);
    });

    it("chama onNext ao pressionar seta direita", () => {
      const onNext = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <DateNavigator {...defaultProps} onNext={onNext} />,
      );
      // índice 2 = seta direita na navRow
      fireEvent.press(UNSAFE_getAllByType("Pressable" as any)[2]);
      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it("chama onOpenCalendar ao pressionar a data central", () => {
      const onOpenCalendar = jest.fn();
      const { getByText } = render(
        <DateNavigator {...defaultProps} onOpenCalendar={onOpenCalendar} />,
      );
      fireEvent.press(getByText(/quarta/i));
      expect(onOpenCalendar).toHaveBeenCalledTimes(1);
    });

    describe("ao pressionar um dia na faixa semanal", () => {
      // Os Pressables: [0]=seta esq, [1]=centro, [2]=seta dir, [3..9]=dias DOM..SÁB
      // selectedDate = quarta (índice 3 na semana = Pressable índice 6)

      it("chama onNext 2 vezes ao clicar em sexta (2 dias à frente)", () => {
        const onNext = jest.fn();
        const { UNSAFE_getAllByType } = render(
          <DateNavigator {...defaultProps} onNext={onNext} />,
        );
        // SEX = índice 5 na semana → Pressable índice 3+5 = 8
        fireEvent.press(UNSAFE_getAllByType("Pressable" as any)[8]);
        expect(onNext).toHaveBeenCalledTimes(2);
      });

      it("chama onPrev 2 vezes ao clicar em segunda (2 dias atrás)", () => {
        const onPrev = jest.fn();
        const { UNSAFE_getAllByType } = render(
          <DateNavigator {...defaultProps} onPrev={onPrev} />,
        );
        // SEG = índice 1 na semana → Pressable índice 3+1 = 4
        fireEvent.press(UNSAFE_getAllByType("Pressable" as any)[4]);
        expect(onPrev).toHaveBeenCalledTimes(2);
      });

      it("não chama onPrev nem onNext ao clicar no próprio dia selecionado", () => {
        const onPrev = jest.fn();
        const onNext = jest.fn();
        const { UNSAFE_getAllByType } = render(
          <DateNavigator {...defaultProps} onPrev={onPrev} onNext={onNext} />,
        );
        // QUA = índice 3 na semana → Pressable índice 3+3 = 6
        fireEvent.press(UNSAFE_getAllByType("Pressable" as any)[6]);
        expect(onPrev).not.toHaveBeenCalled();
        expect(onNext).not.toHaveBeenCalled();
      });

      it("chama onNext 3 vezes ao clicar em sábado (3 dias à frente)", () => {
        const onNext = jest.fn();
        const { UNSAFE_getAllByType } = render(
          <DateNavigator {...defaultProps} onNext={onNext} />,
        );
        // SÁB = índice 6 na semana → Pressable índice 3+6 = 9
        fireEvent.press(UNSAFE_getAllByType("Pressable" as any)[9]);
        expect(onNext).toHaveBeenCalledTimes(3);
      });
    });

    it("chama onBackToToday ao pressionar 'Voltar para hoje'", () => {
      const onBackToToday = jest.fn();
      const past = new Date(2026, 0, 1);
      const { getByText } = render(
        <DateNavigator {...defaultProps} selectedDate={past} onBackToToday={onBackToToday} />,
      );
      fireEvent.press(getByText("Voltar para hoje"));
      expect(onBackToToday).toHaveBeenCalledTimes(1);
    });
  });
});
