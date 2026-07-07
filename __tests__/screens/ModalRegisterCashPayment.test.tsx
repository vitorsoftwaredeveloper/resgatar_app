const mockListMembers = jest.fn();
const mockGetMemberById = jest.fn();
const mockRegisterCashPayment = jest.fn();
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
      background: "#F6F1EB",
      card: "#FFF",
      border: "#ccc",
      textStrong: "#000",
      textMuted: "#999",
      white: "#FFF",
      waiting: "#E0B96A",
      success: "#1E7F43",
      successBackground: "#E6F4EA",
    },
    mode: "light",
  }),
}));

jest.mock("@/services/MemberService", () => ({
  MemberServices: {
    getMemberById: (...args: any[]) => mockGetMemberById(...args),
  },
}));

jest.mock("@/services/ChargeService", () => ({
  ChargeServices: {
    registerCashPayment: (...args: any[]) => mockRegisterCashPayment(...args),
  },
}));

jest.mock("@/utils/helper", () => ({
  formatMoneyBRL: (v: any) => `R$ ${v}`,
  formatDateFromTimestamp: () => "01/01/2026",
}));

jest.mock("@/components/Toast", () => ({
  ToastMessage: {
    error: (...args: any[]) => mockToastError(...args),
    success: (...args: any[]) => mockToastSuccess(...args),
  },
}));

jest.mock("@/components/Avatar", () => {
  const React = require("react");
  return { Avatar: () => React.createElement("View", { testID: "avatar" }) };
});

jest.mock("@/components/ModalBase", () => {
  const React = require("react");
  return {
    ModalBase: ({ children, visible }: any) =>
      visible
        ? React.createElement("View", { testID: "modal-base" }, children)
        : null,
  };
});

jest.mock("@/components/Skeleton/RemoveMemberSkeleton", () => {
  const React = require("react");
  return {
    RemoveMemberSkeleton: () =>
      React.createElement("View", { testID: "skeleton" }),
  };
});

jest.mock("@/components/Dialog", () => {
  const React = require("react");
  return {
    Dialog: ({ visible, actions }: any) =>
      visible
        ? React.createElement(
            "View",
            { testID: "dialog" },
            actions?.map((a: any, i: number) =>
              React.createElement(
                "Button",
                {
                  key: i,
                  testID: `dialog-${a.label}`,
                  onPress: a.onPress,
                },
                a.label,
              ),
            ),
          )
        : null,
  };
});

jest.mock("react-native-reanimated", () => ({
  __esModule: true,
  default: { View: ({ children }: any) => children },
  useSharedValue: (v: any) => ({ value: v }),
  useAnimatedStyle: () => ({}),
}));

jest.mock("lucide-react-native", () => ({ HandCoins: () => null }));

import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import { ModalRegisterCashPayment } from "@/screens/SettingsScreen/ModalRegisterCashPayment";
import { AuthContext } from "@/context/AuthContext";

const members = [
  {
    _id: "user-1",
    firstName: "João",
    lastName: "Silva",
    email: "joao@email.com",
    phoneNumber: "",
    dateOfBirth: 0,
    paymentInfo: { datePayment: 1, amount: "10,00" },
    identification: { type: "CPF" as const, numberType: "11111111111" },
  },
];

const paidMonth = { paid: true, value: 10, paidAt: "2026-01-05" };

const memberDetail = {
  ...members[0],
  paymentInfo: { datePayment: 1, amount: "10,00" },
  contributions: {
    year: 2026,
    // Todos pagos, exceto fevereiro (índice 1) — único pendente.
    months: {
      january: paidMonth,
      february: { paid: false, value: 0, paidAt: "" },
      march: paidMonth,
      april: paidMonth,
      may: paidMonth,
      june: paidMonth,
      july: paidMonth,
      august: paidMonth,
      september: paidMonth,
      october: paidMonth,
      november: paidMonth,
      december: paidMonth,
    },
  },
};

const mockReloadMemberData = jest.fn().mockResolvedValue(undefined);

function renderModal(props = { visible: true, onClose: jest.fn() }) {
  const contextValue = { listMembers: mockListMembers, reloadMemberData: mockReloadMemberData };
  return render(
    <AuthContext.Provider value={contextValue as any}>
      <ModalRegisterCashPayment {...props} />
    </AuthContext.Provider>,
  );
}

describe("ModalRegisterCashPayment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListMembers.mockResolvedValue(members);
    mockGetMemberById.mockResolvedValue(memberDetail);
    mockRegisterCashPayment.mockResolvedValue(undefined);
  });

  it("não renderiza nada quando visible é false", () => {
    const { queryByTestId } = renderModal({ visible: false, onClose: jest.fn() });
    expect(queryByTestId("modal-base")).toBeNull();
  });

  it("lista os membros ao abrir", async () => {
    const { getByText } = renderModal();
    await waitFor(() => expect(getByText("João")).toBeTruthy());
  });

  it("carrega as contribuições ao selecionar um membro", async () => {
    const { getByText, UNSAFE_getAllByType } = renderModal();
    await waitFor(() => getByText("João"));

    const pressables = UNSAFE_getAllByType("Pressable" as any);
    await act(async () => {
      fireEvent.press(pressables[0]);
    });

    await waitFor(() => {
      expect(mockGetMemberById).toHaveBeenCalledWith("user-1");
      expect(getByText("Janeiro")).toBeTruthy();
      expect(getByText("Fevereiro")).toBeTruthy();
    });
  });

  it("registra pagamento em dinheiro do mês pendente", async () => {
    const { getByText, getByTestId, UNSAFE_getAllByType } = renderModal();
    await waitFor(() => getByText("João"));

    await act(async () => {
      fireEvent.press(UNSAFE_getAllByType("Pressable" as any)[0]);
    });
    await waitFor(() => getByText("Fevereiro"));

    // Botão "Registrar" do mês pendente (fevereiro)
    await act(async () => {
      fireEvent.press(getByText("Registrar"));
    });

    // Confirma no dialog
    await act(async () => {
      fireEvent.press(getByTestId("dialog-confirmar"));
    });

    await waitFor(() => {
      // fevereiro = índice 1, valor pré-preenchido com o padrão do membro
      expect(mockRegisterCashPayment).toHaveBeenCalledWith(
        "user-1",
        1,
        "10,00",
      );
      expect(mockToastSuccess).toHaveBeenCalled();
    });
  });

  it("mostra apenas os meses fornecidos pelo endpoint", async () => {
    mockGetMemberById.mockResolvedValue({
      ...members[0],
      paymentInfo: { datePayment: 1, amount: "10,00" },
      contributions: {
        year: 2026,
        months: {
          january: paidMonth,
          february: { paid: false, value: 0, paidAt: "" },
        },
      },
    });

    const { getByText, queryByText, UNSAFE_getAllByType } = renderModal();
    await waitFor(() => getByText("João"));

    await act(async () => {
      fireEvent.press(UNSAFE_getAllByType("Pressable" as any)[0]);
    });

    await waitFor(() => {
      expect(getByText("Janeiro")).toBeTruthy();
      expect(getByText("Fevereiro")).toBeTruthy();
    });
    // meses não fornecidos não aparecem
    expect(queryByText("Março")).toBeNull();
    expect(queryByText("Dezembro")).toBeNull();
  });

  it("exibe toast de erro quando o registro falha", async () => {
    mockRegisterCashPayment.mockRejectedValue(new Error("network"));
    const { getByText, getByTestId, UNSAFE_getAllByType } = renderModal();
    await waitFor(() => getByText("João"));

    await act(async () => {
      fireEvent.press(UNSAFE_getAllByType("Pressable" as any)[0]);
    });
    await waitFor(() => getByText("Registrar"));

    await act(async () => {
      fireEvent.press(getByText("Registrar"));
    });
    await act(async () => {
      fireEvent.press(getByTestId("dialog-confirmar"));
    });

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalled();
    });
  });
});
