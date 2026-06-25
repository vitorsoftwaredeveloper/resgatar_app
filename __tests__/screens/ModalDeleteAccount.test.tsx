const mockDeleteAccount = jest.fn();
const mockToastError = jest.fn();
const mockToastSuccess = jest.fn();

jest.mock("@/context/AuthContext", () => {
  const React = require("react");
  return { AuthContext: React.createContext({}) };
});

jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: {
      primary: "#6B4F3A",
      error: "#E53935",
      muted: "#8C7A6B",
      background: "#F6F1EB",
      card: "#FFF",
      text: "#3E2F23",
      textMuted: "#8C7A6B",
    },
  }),
}));

jest.mock("@/components/Toast", () => ({
  ToastMessage: {
    error: (...args: any[]) => mockToastError(...args),
    success: (...args: any[]) => mockToastSuccess(...args),
  },
}));

jest.mock("@/components/ModalBase", () => {
  const React = require("react");
  return {
    ModalBase: ({ children, visible }: any) =>
      visible ? React.createElement("View", { testID: "modal-base" }, children) : null,
  };
});

jest.mock("@/components/Card", () => {
  const React = require("react");
  return {
    Card: ({ children }: any) => React.createElement("View", null, children),
  };
});

jest.mock("@/components/Button", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    Button: ({ title, onPress, disabled }: any) =>
      React.createElement(
        TouchableOpacity,
        { testID: "btn-delete", onPress: disabled ? undefined : onPress },
        React.createElement(Text, null, title),
      ),
  };
});

jest.mock("@/components/Input", () => {
  const React = require("react");
  const { TextInput } = require("react-native");
  return {
    Input: ({ value, onChangeText }: any) =>
      React.createElement(TextInput, {
        testID: "input-password",
        value,
        onChangeText,
      }),
  };
});

jest.mock("lucide-react-native", () => ({
  AlertTriangle: () => null,
  Eye: () => null,
  EyeOff: () => null,
  Lock: () => null,
}));

import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import { ModalDeleteAccount } from "@/screens/ProfileScreen/ModalDeleteAccount";
import { AuthContext } from "@/context/AuthContext";

function renderWithContext(
  props = { visible: true, onClose: jest.fn() },
  contextOverrides: any = {},
) {
  const contextValue = { deleteAccount: mockDeleteAccount, ...contextOverrides };
  return render(
    <AuthContext.Provider value={contextValue as any}>
      <ModalDeleteAccount {...props} />
    </AuthContext.Provider>,
  );
}

describe("ModalDeleteAccount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDeleteAccount.mockResolvedValue(undefined);
  });

  it("não renderiza quando visible é false", () => {
    const { queryByTestId } = renderWithContext({ visible: false, onClose: jest.fn() });
    expect(queryByTestId("modal-base")).toBeNull();
  });

  it("renderiza os avisos quando visible é true", () => {
    const { getByText } = renderWithContext();
    expect(
      getByText("Todos os seus dados pessoais serão removidos permanentemente."),
    ).toBeTruthy();
    expect(getByText("Esta ação não pode ser desfeita.")).toBeTruthy();
  });

  it("exibe toast de erro quando senha está vazia", async () => {
    const { getByTestId } = renderWithContext();
    await act(async () => {
      fireEvent.press(getByTestId("btn-delete"));
    });
    expect(mockToastError).toHaveBeenCalledWith(
      "Campo obrigatório",
      "Informe sua senha para continuar.",
    );
    expect(mockDeleteAccount).not.toHaveBeenCalled();
  });

  it("chama deleteAccount com a senha informada", async () => {
    const { getByTestId } = renderWithContext();
    fireEvent.changeText(getByTestId("input-password"), "minhasenha123");
    await act(async () => {
      fireEvent.press(getByTestId("btn-delete"));
    });
    expect(mockDeleteAccount).toHaveBeenCalledWith("minhasenha123");
  });

  it("exibe toast de sucesso após encerrar conta", async () => {
    const { getByTestId } = renderWithContext();
    fireEvent.changeText(getByTestId("input-password"), "minhasenha123");
    await act(async () => {
      fireEvent.press(getByTestId("btn-delete"));
    });
    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Conta encerrada",
        "Sua conta foi encerrada com sucesso.",
      );
    });
  });

  it("exibe toast de erro para senha incorreta (NotAuthorizedException)", async () => {
    const error = Object.assign(new Error("Not authorized"), {
      name: "NotAuthorizedException",
    });
    mockDeleteAccount.mockRejectedValue(error);
    const { getByTestId } = renderWithContext();
    fireEvent.changeText(getByTestId("input-password"), "senhaerrada");
    await act(async () => {
      fireEvent.press(getByTestId("btn-delete"));
    });
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Erro",
        "Senha incorreta. Verifique e tente novamente.",
      );
    });
  });

  it("exibe toast de erro para falha com mensagem 'Senha incorreta.'", async () => {
    mockDeleteAccount.mockRejectedValue(new Error("Senha incorreta."));
    const { getByTestId } = renderWithContext();
    fireEvent.changeText(getByTestId("input-password"), "senhaerrada");
    await act(async () => {
      fireEvent.press(getByTestId("btn-delete"));
    });
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Erro",
        "Senha incorreta. Verifique e tente novamente.",
      );
    });
  });

  it("exibe toast de erro genérico para outras falhas", async () => {
    mockDeleteAccount.mockRejectedValue(new Error("network error"));
    const { getByTestId } = renderWithContext();
    fireEvent.changeText(getByTestId("input-password"), "minhasenha123");
    await act(async () => {
      fireEvent.press(getByTestId("btn-delete"));
    });
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Erro",
        "Não foi possível encerrar a conta. Tente novamente.",
      );
    });
  });
});
