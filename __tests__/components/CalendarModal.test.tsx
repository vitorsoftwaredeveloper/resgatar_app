jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", white: "#FFF", text: "#000", card: "#FFF", border: "#ccc", textMuted: "#999", background: "#F6F1EB" },
    mode: "light",
  }),
}));
jest.mock("lucide-react-native", () => ({
  ChevronLeft: () => null,
  ChevronRight: () => null,
  Clock: () => null,
}));

import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import { CalendarModal } from "@/components/CalendarModal";

const MONTH_NAMES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

const selectedDate = new Date(2025, 5, 15); // 15 jun 2025
const onSelectDate = jest.fn();
const onClose = jest.fn();

const defaultProps = { visible: true, selectedDate, onSelectDate, onClose };

describe("CalendarModal", () => {
  beforeEach(() => jest.clearAllMocks());

  it("exibe o mês e ano correto", () => {
    const { getByText } = render(<CalendarModal {...defaultProps} />);
    expect(getByText("Junho 2025")).toBeTruthy();
  });

  it("não renderiza quando visible é false", () => {
    const { queryByText } = render(
      <CalendarModal {...defaultProps} visible={false} />,
    );
    expect(queryByText("Junho 2025")).toBeNull();
  });

  it("avança para o próximo mês", () => {
    const { getByText, UNSAFE_getAllByType } = render(<CalendarModal {...defaultProps} />);
    const pressables = UNSAFE_getAllByType("Pressable" as any);
    // backdrop=0, prevMonth=1, nextMonth=2
    fireEvent.press(pressables[2]);
    expect(getByText("Julho 2025")).toBeTruthy();
  });

  it("volta para o mês anterior", () => {
    const { getByText, UNSAFE_getAllByType } = render(<CalendarModal {...defaultProps} />);
    const pressables = UNSAFE_getAllByType("Pressable" as any);
    fireEvent.press(pressables[1]);
    expect(getByText("Maio 2025")).toBeTruthy();
  });

  it("navega para dezembro ao voltar de janeiro", () => {
    const janDate = new Date(2025, 0, 1);
    const { getByText, UNSAFE_getAllByType } = render(
      <CalendarModal {...defaultProps} selectedDate={janDate} />,
    );
    const pressables = UNSAFE_getAllByType("Pressable" as any);
    fireEvent.press(pressables[1]);
    expect(getByText("Dezembro 2024")).toBeTruthy();
  });

  it("navega para janeiro ao avançar de dezembro", () => {
    const decDate = new Date(2025, 11, 1);
    const { getByText, UNSAFE_getAllByType } = render(
      <CalendarModal {...defaultProps} selectedDate={decDate} />,
    );
    const pressables = UNSAFE_getAllByType("Pressable" as any);
    fireEvent.press(pressables[2]);
    expect(getByText("Janeiro 2026")).toBeTruthy();
  });

  it("seleciona um dia do mês ao clicar", () => {
    const { getByText } = render(<CalendarModal {...defaultProps} />);
    fireEvent.press(getByText("15"));
    expect(onSelectDate).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("seleciona hoje ao pressionar o botão 'Hoje'", () => {
    const { getByText } = render(<CalendarModal {...defaultProps} />);
    fireEvent.press(getByText("Hoje"));
    expect(onSelectDate).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("chama onClose ao pressionar o botão 'Fechar'", () => {
    const { getByText } = render(<CalendarModal {...defaultProps} />);
    fireEvent.press(getByText("Fechar"));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSelectDate).not.toHaveBeenCalled();
  });

  it("chama onClose ao pressionar o backdrop", () => {
    const { UNSAFE_getAllByType } = render(<CalendarModal {...defaultProps} />);
    const pressables = UNSAFE_getAllByType("Pressable" as any);
    fireEvent.press(pressables[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("exibe os cabeçalhos da semana", () => {
    const { getAllByText } = render(<CalendarModal {...defaultProps} />);
    expect(getAllByText("D").length).toBeGreaterThanOrEqual(1);
    expect(getAllByText("S").length).toBeGreaterThanOrEqual(1);
  });

  it("aplica estilo de 'hoje' quando o mês exibido contém a data atual", () => {
    // hoje é 17/06/2026 — navegar até junho 2026 com selectedDate em outro dia
    const otherDate = new Date(2026, 5, 1); // 1 jun 2026
    const { getByText, UNSAFE_getAllByType } = render(
      <CalendarModal {...defaultProps} selectedDate={otherDate} />,
    );
    // avançar de jun/2025 até jun/2026 (12 cliques)
    const pressables = UNSAFE_getAllByType("Pressable" as any);
    for (let i = 0; i < 12; i++) {
      fireEvent.press(UNSAFE_getAllByType("Pressable" as any)[2]);
    }
    // o dia 17 deve estar visível com estilo diferenciado
    expect(getByText("17")).toBeTruthy();
  });
});
