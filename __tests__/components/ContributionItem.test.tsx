jest.mock("lucide-react-native", () => ({
  Eye: () => null,
  QrCode: () => null,
}));
jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: { primary: "#6B4F3A", white: "#FFF", black: "#000", text: "#000", textMuted: "#999", border: "#ccc", inputBg: "#fff", card: "#fff", muted: "#999", error: "#E53935", waiting: "#E0B96A", success: "#1E7F43", successBackground: "#E6F4EA", softBrown: "#EDE6DE" },
    mode: "light",
  }),
}));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ContributionItem } from "@/components/ContributionItem";
import { TRANSACTION_STATUS } from "@/types/Charge";

const pending = {
  id: "1",
  month: "Janeiro/2026",
  value: "R$ 50,00",
  status: TRANSACTION_STATUS.PENDING,
  description: "Mensalidade janeiro",
};

const paid = {
  ...pending,
  id: "2",
  status: TRANSACTION_STATUS.APPROVED,
};

describe("ContributionItem", () => {
  describe("renderização", () => {
    it("exibe o mês de referência", () => {
      const { getByText } = render(
        <ContributionItem data={pending} onPay={jest.fn()} />,
      );
      expect(getByText("Janeiro/2026")).toBeTruthy();
    });

    it("exibe o valor", () => {
      const { getByText } = render(
        <ContributionItem data={pending} onPay={jest.fn()} />,
      );
      expect(getByText("R$ 50,00")).toBeTruthy();
    });

    it("exibe a descrição", () => {
      const { getByText } = render(
        <ContributionItem data={pending} onPay={jest.fn()} />,
      );
      expect(getByText("Mensalidade janeiro")).toBeTruthy();
    });
  });

  describe("status pendente", () => {
    it("exibe badge 'Pendente'", () => {
      const { getByText } = render(
        <ContributionItem data={pending} onPay={jest.fn()} />,
      );
      expect(getByText("Pendente")).toBeTruthy();
    });

    it("exibe botão 'Pagar'", () => {
      const { getByText } = render(
        <ContributionItem data={pending} onPay={jest.fn()} />,
      );
      expect(getByText("Pagar")).toBeTruthy();
    });

    it("não exibe botão 'Comprovante'", () => {
      const { queryByText } = render(
        <ContributionItem data={pending} onPay={jest.fn()} />,
      );
      expect(queryByText("Comprovante")).toBeNull();
    });

    it("chama onPay ao pressionar 'Pagar'", async () => {
      const onPay = jest.fn().mockResolvedValue(undefined);
      const { getByText } = render(
        <ContributionItem data={pending} onPay={onPay} />,
      );
      fireEvent.press(getByText("Pagar"));
      expect(onPay).toHaveBeenCalledTimes(1);
    });
  });

  describe("status pago", () => {
    it("exibe badge 'Pago'", () => {
      const { getByText } = render(
        <ContributionItem data={paid} onPay={jest.fn()} onShare={jest.fn()} />,
      );
      expect(getByText("Pago")).toBeTruthy();
    });

    it("exibe botão 'Comprovante'", () => {
      const { getByText } = render(
        <ContributionItem data={paid} onPay={jest.fn()} onShare={jest.fn()} />,
      );
      expect(getByText("Comprovante")).toBeTruthy();
    });

    it("não exibe botão 'Pagar'", () => {
      const { queryByText } = render(
        <ContributionItem data={paid} onPay={jest.fn()} onShare={jest.fn()} />,
      );
      expect(queryByText("Pagar")).toBeNull();
    });

    it("chama onShare ao pressionar 'Comprovante'", () => {
      const onShare = jest.fn();
      const { getByText } = render(
        <ContributionItem data={paid} onPay={jest.fn()} onShare={onShare} />,
      );
      fireEvent.press(getByText("Comprovante"));
      expect(onShare).toHaveBeenCalledTimes(1);
    });
  });
});
