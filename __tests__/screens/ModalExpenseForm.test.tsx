const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockUploadReceipt = jest.fn();
const mockGetReceiptViewUrl = jest.fn();
const mockOpenURL = jest.fn();

jest.mock("react-native", () => {
  const actual = jest.requireActual("react-native");
  return {
    ...actual,
    Linking: { openURL: (...args: any[]) => mockOpenURL(...args) },
  };
});

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
      white: "#FFF",
      error: "#E53935",
      black: "#000",
    },
    mode: "light",
  }),
}));

jest.mock("@/services/ExpenseService", () => ({
  ExpenseServices: {
    create: (...args: any[]) => mockCreate(...args),
    update: (...args: any[]) => mockUpdate(...args),
    uploadReceipt: (...args: any[]) => mockUploadReceipt(...args),
    getReceiptViewUrl: (...args: any[]) => mockGetReceiptViewUrl(...args),
  },
}));

const mockPickFromLibrary = jest.fn();
const mockTakePhoto = jest.fn();
jest.mock("@/hooks/useReceiptPicker", () => ({
  useReceiptPicker: () => ({
    loading: false,
    pickFromLibrary: (...args: any[]) => mockPickFromLibrary(...args),
    takePhoto: (...args: any[]) => mockTakePhoto(...args),
  }),
}));

jest.mock("@/utils/helper", () => ({
  formatDateFromTimestamp: () => "26/06/2026",
  parseDateBRToTimestamp: () => 1750000000000,
}));

jest.mock("@/utils/mask", () => ({
  maskCurrencyBRL: (v: string) => v,
  maskDateBR: (v: string) => v,
  currencyToBackendBRL: (v: string) => v,
}));

jest.mock("@/components/Toast", () => ({
  ToastMessage: { error: jest.fn(), success: jest.fn() },
}));

jest.mock("@/components/ModalBase", () => {
  const React = require("react");
  return {
    ModalBase: ({ visible, children }: any) =>
      visible ? React.createElement("View", { testID: "modal-base" }, children) : null,
  };
});

jest.mock("@/components/Card", () => {
  const React = require("react");
  return {
    Card: ({ children }: any) =>
      React.createElement("View", { testID: "card" }, children),
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
    Input: ({ label, onChangeText, value, testID }: any) =>
      React.createElement("TextInput", {
        testID: testID ?? `input-${label}`,
        onChangeText,
        value,
      }),
  };
});

jest.mock("@/components/TextArea", () => {
  const React = require("react");
  return {
    TextArea: ({ label, onChangeText, value }: any) =>
      React.createElement("TextInput", {
        testID: `textarea-${label}`,
        onChangeText,
        value,
      }),
  };
});

jest.mock("lucide-react-native", () => ({
  Camera: () => null,
  Eye: () => null,
  ImageIcon: () => null,
  Save: () => null,
  Trash2: () => null,
  X: () => null,
}));

import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { ModalExpenseForm } from "@/screens/ExpensesScreen/ModalExpenseForm";
import { ToastMessage } from "@/components/Toast";

const defaultProps = {
  visible: true,
  onClose: jest.fn(),
  onSaved: jest.fn(),
  referenceMonth: 5,
  referenceYear: 2026,
};

const expense = {
  _id: "exp1",
  description: "Material de limpeza",
  amount: "120,00",
  category: "material" as const,
  referenceMonth: 5,
  referenceYear: 2026,
  date: 1750000000000,
  adminId: "admin1",
};

async function fillAndSubmit(getByTestId: any, getByText: any) {
  await act(async () => {
    fireEvent.changeText(getByTestId("input-Descrição"), "Compra de material");
    fireEvent.changeText(getByTestId("input-Valor"), "50,00");
    fireEvent.changeText(getByTestId("input-Data"), "26/06/2026");
    fireEvent.press(getByText("Material"));
  });
  await act(async () => {
    fireEvent.press(getByTestId("btn-Cadastrar despesa"));
  });
}

describe("ModalExpenseForm", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renderiza o formulário de criação", () => {
    const { getByTestId } = render(<ModalExpenseForm {...defaultProps} />);
    expect(getByTestId("modal-base")).toBeTruthy();
    expect(getByTestId("btn-Cadastrar despesa")).toBeTruthy();
  });

  it("renderiza em modo edição com os dados preenchidos", () => {
    const { getByTestId, getByText } = render(
      <ModalExpenseForm {...defaultProps} expense={expense} />,
    );
    expect(getByTestId("btn-Salvar alterações")).toBeTruthy();
    expect(getByText("Material")).toBeTruthy();
  });

  it("cadastra uma despesa sem comprovante", async () => {
    mockCreate.mockResolvedValueOnce("exp2");
    const onSaved = jest.fn();
    const { getByTestId, getByText } = render(
      <ModalExpenseForm {...defaultProps} onSaved={onSaved} />,
    );

    await fillAndSubmit(getByTestId, getByText);

    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Compra de material",
          category: "material",
        }),
      ),
    );
    expect(mockUploadReceipt).not.toHaveBeenCalled();
    expect(ToastMessage.success).toHaveBeenCalledWith("Despesa cadastrada");
    expect(onSaved).toHaveBeenCalled();
  });

  it("exibe toast de erro quando a criação falha", async () => {
    mockCreate.mockRejectedValueOnce(new Error("forbidden"));
    const { getByTestId, getByText } = render(
      <ModalExpenseForm {...defaultProps} />,
    );

    await fillAndSubmit(getByTestId, getByText);

    await waitFor(() =>
      expect(ToastMessage.error).toHaveBeenCalledWith("Erro", expect.any(String)),
    );
  });

  it("atualiza a despesa em modo edição", async () => {
    mockUpdate.mockResolvedValueOnce(undefined);
    const onSaved = jest.fn();
    const { getByTestId } = render(
      <ModalExpenseForm
        {...defaultProps}
        expense={expense}
        onSaved={onSaved}
      />,
    );

    await act(async () => {
      fireEvent.press(getByTestId("btn-Salvar alterações"));
    });

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith("exp1", expect.any(Object)),
    );
    expect(ToastMessage.success).toHaveBeenCalledWith("Despesa atualizada");
    expect(onSaved).toHaveBeenCalled();
  });

  describe("comprovante", () => {
    it("faz upload do comprovante antes de criar a despesa", async () => {
      const asset = {
        uri: "file:///tmp/r.jpg",
        contentType: "image/jpeg",
        fileName: "r.jpg",
      };
      mockPickFromLibrary.mockResolvedValueOnce(asset);
      mockUploadReceipt.mockResolvedValueOnce("receipts/admin1/uuid.jpg");
      mockCreate.mockResolvedValueOnce("exp2");

      const { getByTestId, getByText } = render(
        <ModalExpenseForm {...defaultProps} />,
      );

      // Seleciona o comprovante via galeria
      await act(async () => {
        fireEvent.press(getByText("Galeria"));
      });

      await fillAndSubmit(getByTestId, getByText);

      await waitFor(() =>
        expect(mockUploadReceipt).toHaveBeenCalledWith(
          "file:///tmp/r.jpg",
          "image/jpeg",
        ),
      );
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ receiptKey: "receipts/admin1/uuid.jpg" }),
      );
    });

    it("exibe toast e não cadastra quando o upload falha", async () => {
      const asset = {
        uri: "file:///tmp/r.jpg",
        contentType: "image/jpeg",
        fileName: "r.jpg",
      };
      mockPickFromLibrary.mockResolvedValueOnce(asset);
      mockUploadReceipt.mockRejectedValueOnce(new Error("S3 error"));

      const { getByTestId, getByText } = render(
        <ModalExpenseForm {...defaultProps} />,
      );

      await act(async () => {
        fireEvent.press(getByText("Galeria"));
      });

      await fillAndSubmit(getByTestId, getByText);

      await waitFor(() =>
        expect(ToastMessage.error).toHaveBeenCalledWith("Erro", expect.any(String)),
      );
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("inclui receiptKey null ao editar despesa com comprovante removido", async () => {
      mockUpdate.mockResolvedValueOnce(undefined);
      const expenseWithReceipt = {
        ...expense,
        receiptKey: "receipts/admin1/uuid.jpg",
      };

      const { getByText, getByTestId } = render(
        <ModalExpenseForm {...defaultProps} expense={expenseWithReceipt} />,
      );

      // Remove o comprovante existente (texto do botão)
      await act(async () => {
        fireEvent.press(getByText("Remover"));
      });

      // Salva
      await act(async () => {
        fireEvent.press(getByTestId("btn-Salvar alterações"));
      });

      await waitFor(() =>
        expect(mockUpdate).toHaveBeenCalledWith(
          "exp1",
          expect.objectContaining({ receiptKey: null }),
        ),
      );
    });

    it("abre o comprovante salvo via Linking", async () => {
      mockGetReceiptViewUrl.mockResolvedValueOnce("https://s3/view");
      const expenseWithReceipt = {
        ...expense,
        receiptKey: "receipts/admin1/uuid.jpg",
      };

      const { getByText } = render(
        <ModalExpenseForm {...defaultProps} expense={expenseWithReceipt} />,
      );

      await act(async () => {
        fireEvent.press(getByText("Ver"));
      });

      await waitFor(() =>
        expect(mockOpenURL).toHaveBeenCalledWith("https://s3/view"),
      );
    });

    it("exibe toast de erro quando a URL do comprovante falha", async () => {
      mockGetReceiptViewUrl.mockRejectedValueOnce(new Error("S3 error"));
      const expenseWithReceipt = {
        ...expense,
        receiptKey: "receipts/admin1/uuid.jpg",
      };

      const { getByText } = render(
        <ModalExpenseForm {...defaultProps} expense={expenseWithReceipt} />,
      );

      await act(async () => {
        fireEvent.press(getByText("Ver"));
      });

      await waitFor(() =>
        expect(ToastMessage.error).toHaveBeenCalledWith("Erro", expect.any(String)),
      );
    });
  });
});
