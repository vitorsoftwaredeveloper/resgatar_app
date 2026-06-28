const mockCreatePix = jest.fn();
const mockRegisterCash = jest.fn();
const mockConsult = jest.fn();
const mockOnMessage = jest.fn();
const mockOnMessageUnsubscribe = jest.fn();
const mockSyncDonationYear = jest.fn().mockResolvedValue(undefined);

jest.mock("@/context/AuthContext", () => {
  const React = require("react");
  return {
    AuthContext: React.createContext({
      syncDonationYear: (...args: any[]) => mockSyncDonationYear(...args),
    }),
  };
});

jest.mock("@react-native-firebase/messaging", () => () => ({
  onMessage: (...args: any[]) => {
    mockOnMessage(...args);
    return mockOnMessageUnsubscribe;
  },
}));

jest.mock("@/services/DonationService", () => ({
  DonationServices: {
    createPix: (...args: any[]) => mockCreatePix(...args),
    registerCash: (...args: any[]) => mockRegisterCash(...args),
    consult: (...args: any[]) => mockConsult(...args),
  },
}));

jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: {
      primary: "#6B4F3A",
      background: "#F6F1EB",
      card: "#FFF",
      border: "#DED6CC",
      text: "#3E2F23",
      textStrong: "#3E2C1C",
      textMuted: "#8C7A6B",
      info: "#1565C0",
      success: "#1E7F43",
      error: "#C0392B",
      white: "#FFF",
    },
    mode: "light",
  }),
}));

jest.mock("@/utils/mask", () => ({
  maskCurrencyBRL: (v: string) => v,
  currencyToBackendBRL: (v: string) => v,
  onlyNumbers: (v: string) => v.replace(/\D/g, ""),
}));

jest.mock("@/components/Toast", () => ({
  ToastMessage: { error: jest.fn(), success: jest.fn() },
}));

jest.mock("@/components/ModalBase", () => {
  const React = require("react");
  return {
    ModalBase: ({ visible, children, title }: any) =>
      visible
        ? React.createElement(
            "View",
            { testID: "modal-donate" },
            React.createElement("Text", null, title),
            children,
          )
        : null,
  };
});

jest.mock("@/components/Button", () => {
  const React = require("react");
  return {
    Button: ({ title, onPress, loading, disabled }: any) =>
      React.createElement(
        "Text",
        { testID: `btn-${title}`, onPress, disabled: disabled || loading },
        title,
      ),
  };
});

jest.mock("@/components/Input", () => {
  const React = require("react");
  return {
    Input: ({ label, onChangeText, value, placeholder }: any) =>
      React.createElement("TextInput", {
        testID: `input-${label}`,
        placeholder,
        onChangeText,
        value,
      }),
  };
});

// PixPaymentModal: stub simples com um botão "Fechar" para testar interação.
jest.mock("@/screens/BillsScreen/PixPaymentModal", () => {
  const React = require("react");
  return {
    PixPaymentModal: ({ visible, onClose, payment }: any) =>
      visible
        ? React.createElement(
            "View",
            { testID: "pix-payment-modal" },
            React.createElement("Text", null, payment?.status),
            React.createElement("Text", { testID: "close-pix", onPress: onClose }, "Fechar"),
          )
        : null,
  };
});

jest.mock("react-native", () => {
  const actual = jest.requireActual("react-native");
  return {
    ...actual,
    AppState: {
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
  };
});

jest.mock("lucide-react-native", () => ({}));

import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { ModalDonate } from "@/screens/ProfileScreen/ModalDonate";
import { ToastMessage } from "@/components/Toast";

const pixDonation = {
  transactionId: "txn-pix-1",
  memberId: "m1",
  amount: "50,00",
  paymentMethodId: "pix" as const,
  status: "pending",
  referenceMonth: 5,
  referenceYear: 2026,
  transactionData: { qrCode: "pix-qr-code", qrCodeBase64: "base64..." },
};

const defaultProps = {
  visible: true,
  onClose: jest.fn(),
  isAdmin: false,
};

describe("ModalDonate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // mockReset nos serviços garante que implementações per-test (mockRejectedValue etc.)
    // não vazem para o próximo teste, sem destruir mocks nativos como AppState.
    mockCreatePix.mockReset();
    mockRegisterCash.mockReset();
    mockConsult.mockReset();
  });

  describe("renderização", () => {
    it("renderiza o modal quando visible=true", () => {
      const { getByTestId } = render(<ModalDonate {...defaultProps} />);
      expect(getByTestId("modal-donate")).toBeTruthy();
    });

    it("não renderiza o modal quando visible=false", () => {
      const { queryByTestId } = render(
        <ModalDonate {...defaultProps} visible={false} />,
      );
      expect(queryByTestId("modal-donate")).toBeNull();
    });

    it("exibe o botão 'Doar via PIX' sempre", () => {
      const { getByTestId } = render(<ModalDonate {...defaultProps} />);
      expect(getByTestId("btn-Doar via PIX")).toBeTruthy();
    });

    it("não exibe o botão de dinheiro para não-admin", () => {
      const { queryByTestId } = render(
        <ModalDonate {...defaultProps} isAdmin={false} />,
      );
      expect(queryByTestId("btn-Registrar em dinheiro")).toBeNull();
    });

    it("exibe o botão de dinheiro para admin", () => {
      const { getByTestId } = render(
        <ModalDonate {...defaultProps} isAdmin={true} />,
      );
      expect(getByTestId("btn-Registrar em dinheiro")).toBeTruthy();
    });

    it("exibe os chips de valor rápido", () => {
      const { getByText } = render(<ModalDonate {...defaultProps} />);
      expect(getByText("R$ 10")).toBeTruthy();
      expect(getByText("R$ 20")).toBeTruthy();
      expect(getByText("R$ 50")).toBeTruthy();
      expect(getByText("R$ 100")).toBeTruthy();
    });
  });

  describe("doação PIX", () => {
    it("chama createPix com o valor digitado ao pressionar 'Doar via PIX'", async () => {
      mockCreatePix.mockResolvedValue(pixDonation);
      const { getByTestId } = render(<ModalDonate {...defaultProps} />);

      await act(async () => {
        fireEvent.changeText(getByTestId("input-Valor"), "10000");
      });
      await act(async () => {
        fireEvent.press(getByTestId("btn-Doar via PIX"));
      });

      await waitFor(() =>
        expect(mockCreatePix).toHaveBeenCalledWith("10000", undefined),
      );
    });

    it("inclui donorName quando preenchido", async () => {
      mockCreatePix.mockResolvedValue(pixDonation);
      const { getByTestId } = render(<ModalDonate {...defaultProps} />);

      await act(async () => {
        fireEvent.changeText(getByTestId("input-Valor"), "5000");
        fireEvent.changeText(
          getByTestId("input-Nome do doador (opcional)"),
          "João Silva",
        );
      });
      await act(async () => {
        fireEvent.press(getByTestId("btn-Doar via PIX"));
      });

      await waitFor(() =>
        expect(mockCreatePix).toHaveBeenCalledWith("5000", "João Silva"),
      );
    });

    it("exibe o PixPaymentModal após criar a doação PIX com sucesso", async () => {
      mockCreatePix.mockResolvedValue(pixDonation);
      const { getByTestId } = render(<ModalDonate {...defaultProps} />);

      await act(async () => {
        fireEvent.changeText(getByTestId("input-Valor"), "5000");
        fireEvent.press(getByTestId("btn-Doar via PIX"));
      });

      await waitFor(() =>
        expect(getByTestId("pix-payment-modal")).toBeTruthy(),
      );
    });

    it("exibe toast de erro quando createPix falha", async () => {
      mockCreatePix.mockRejectedValue(new Error("server error"));
      const { getByTestId } = render(<ModalDonate {...defaultProps} />);

      await act(async () => {
        fireEvent.changeText(getByTestId("input-Valor"), "5000");
        fireEvent.press(getByTestId("btn-Doar via PIX"));
      });

      await waitFor(() =>
        expect(ToastMessage.error).toHaveBeenCalledWith(
          expect.stringContaining("PIX"),
        ),
      );
    });

    it("exibe toast de erro quando o valor é zero", async () => {
      const { getByTestId } = render(<ModalDonate {...defaultProps} />);

      await act(async () => {
        fireEvent.changeText(getByTestId("input-Valor"), "");
      });
      await act(async () => {
        fireEvent.press(getByTestId("btn-Doar via PIX"));
      });

      await waitFor(() =>
        expect(ToastMessage.error).toHaveBeenCalledWith(
          expect.stringContaining("valor"),
        ),
      );
      expect(mockCreatePix).not.toHaveBeenCalled();
    });
  });

  describe("doação em dinheiro (admin)", () => {
    const adminProps = { ...defaultProps, isAdmin: true };

    it("chama registerCash e exibe toast de sucesso", async () => {
      mockRegisterCash.mockResolvedValue({ ...pixDonation, paymentMethodId: "cash", status: "approved" });
      const { getByTestId } = render(<ModalDonate {...adminProps} />);

      await act(async () => {
        fireEvent.changeText(getByTestId("input-Valor"), "2000");
      });
      await act(async () => {
        fireEvent.press(getByTestId("btn-Registrar em dinheiro"));
      });

      await waitFor(() =>
        expect(mockRegisterCash).toHaveBeenCalledWith("2000", undefined),
      );
      expect(ToastMessage.success).toHaveBeenCalledWith(
        "Doação registrada",
        expect.any(String),
      );
    });

    it("inclui donorName na doação em dinheiro quando preenchido", async () => {
      mockRegisterCash.mockResolvedValue({ ...pixDonation, paymentMethodId: "cash" });
      const { getByTestId } = render(<ModalDonate {...adminProps} />);

      await act(async () => {
        fireEvent.changeText(getByTestId("input-Valor"), "3000");
        fireEvent.changeText(
          getByTestId("input-Nome do doador (opcional)"),
          "Maria",
        );
      });
      await act(async () => {
        fireEvent.press(getByTestId("btn-Registrar em dinheiro"));
      });

      await waitFor(() =>
        expect(mockRegisterCash).toHaveBeenCalledWith("3000", "Maria"),
      );
    });

    it("exibe toast de erro quando registerCash falha", async () => {
      mockRegisterCash.mockRejectedValue(new Error("forbidden"));
      const { getByTestId } = render(<ModalDonate {...adminProps} />);

      await act(async () => {
        fireEvent.changeText(getByTestId("input-Valor"), "2000");
        fireEvent.press(getByTestId("btn-Registrar em dinheiro"));
      });

      await waitFor(() =>
        expect(ToastMessage.error).toHaveBeenCalledWith(
          expect.stringContaining("Erro"),
        ),
      );
    });

    it("exibe toast de erro quando o valor é zero (cash)", async () => {
      const { getByTestId } = render(<ModalDonate {...adminProps} />);

      await act(async () => {
        fireEvent.changeText(getByTestId("input-Valor"), "");
      });
      await act(async () => {
        fireEvent.press(getByTestId("btn-Registrar em dinheiro"));
      });

      await waitFor(() =>
        expect(ToastMessage.error).toHaveBeenCalledWith(
          expect.stringContaining("valor"),
        ),
      );
      expect(mockRegisterCash).not.toHaveBeenCalled();
    });
  });

  describe("chips de valor rápido", () => {
    it("selecionar um chip atualiza o valor no input", async () => {
      mockCreatePix.mockResolvedValue(pixDonation);
      const { getByText, getByTestId } = render(<ModalDonate {...defaultProps} />);

      await act(async () => {
        fireEvent.press(getByText("R$ 50"));
      });

      await act(async () => {
        fireEvent.press(getByTestId("btn-Doar via PIX"));
      });

      // 50 reais = 5000 centavos → onlyNumbers("5000") = "5000"
      await waitFor(() =>
        expect(mockCreatePix).toHaveBeenCalledWith("5000", undefined),
      );
    });
  });

  describe("confirmação via push notification", () => {
    it("chama onMessage ao criar a doação PIX", async () => {
      mockCreatePix.mockResolvedValue(pixDonation);
      const { getByTestId } = render(<ModalDonate {...defaultProps} />);

      await act(async () => {
        fireEvent.changeText(getByTestId("input-Valor"), "5000");
        fireEvent.press(getByTestId("btn-Doar via PIX"));
      });

      await waitFor(() =>
        expect(mockOnMessage).toHaveBeenCalled(),
      );
    });

    it("atualiza o status para approved ao receber push com o transactionId correto", async () => {
      let capturedCallback: ((msg: any) => void) | null = null;
      mockOnMessage.mockImplementation((cb: any) => {
        capturedCallback = cb;
        return mockOnMessageUnsubscribe;
      });
      mockCreatePix.mockResolvedValue(pixDonation);

      const { getByTestId, getByText } = render(<ModalDonate {...defaultProps} />);

      await act(async () => {
        fireEvent.changeText(getByTestId("input-Valor"), "5000");
        fireEvent.press(getByTestId("btn-Doar via PIX"));
      });

      await waitFor(() => expect(getByTestId("pix-payment-modal")).toBeTruthy());

      // Simula push de confirmação com o transactionId da doação criada
      await act(async () => {
        capturedCallback?.({
          data: {
            type: "PAYMENT_CONFIRMED",
            transactionId: "txn-pix-1",
          },
        });
      });

      // O PixPaymentModal deve exibir o status "approved"
      await waitFor(() => expect(getByText("approved")).toBeTruthy());
    });

    it("ignora push com transactionId diferente", async () => {
      let capturedCallback: ((msg: any) => void) | null = null;
      mockOnMessage.mockImplementation((cb: any) => {
        capturedCallback = cb;
        return mockOnMessageUnsubscribe;
      });
      mockCreatePix.mockResolvedValue(pixDonation);

      const { getByTestId, getByText } = render(<ModalDonate {...defaultProps} />);

      await act(async () => {
        fireEvent.changeText(getByTestId("input-Valor"), "5000");
        fireEvent.press(getByTestId("btn-Doar via PIX"));
      });

      await waitFor(() => expect(getByTestId("pix-payment-modal")).toBeTruthy());

      await act(async () => {
        capturedCallback?.({
          data: { type: "PAYMENT_CONFIRMED", transactionId: "outro-txn" },
        });
      });

      // Status continua pending
      expect(getByText("pending")).toBeTruthy();
    });

    it("cancela a inscrição de push ao fechar via PixPaymentModal", async () => {
      mockCreatePix.mockResolvedValue(pixDonation);
      const { getByTestId } = render(<ModalDonate {...defaultProps} />);

      await act(async () => {
        fireEvent.changeText(getByTestId("input-Valor"), "5000");
        fireEvent.press(getByTestId("btn-Doar via PIX"));
      });

      await waitFor(() => getByTestId("pix-payment-modal"));

      await act(async () => {
        fireEvent.press(getByTestId("close-pix"));
      });

      expect(mockOnMessageUnsubscribe).toHaveBeenCalled();
    });
  });
});
