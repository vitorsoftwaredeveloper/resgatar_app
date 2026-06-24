const mockListMembers = jest.fn();
const mockReloadMemberData = jest.fn();
const mockEditMember = jest.fn();
const mockToastError = jest.fn();

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
    },
    mode: "light",
  }),
}));

jest.mock("@/services/MemberService", () => ({
  MemberServices: {
    editMember: (...args: any[]) => mockEditMember(...args),
  },
}));

jest.mock("@/components/Toast", () => ({
  ToastMessage: {
    error: (...args: any[]) => mockToastError(...args),
    success: jest.fn(),
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
      visible ? React.createElement("View", { testID: "modal-base" }, children) : null,
  };
});

jest.mock("@/components/Skeleton/RemoveMemberSkeleton", () => {
  const React = require("react");
  return { RemoveMemberSkeleton: () => React.createElement("View", { testID: "skeleton" }) };
});

jest.mock("react-native-reanimated", () => ({
  __esModule: true,
  default: { View: ({ children }: any) => children },
  useSharedValue: (v: any) => ({ value: v }),
  useAnimatedStyle: () => ({}),
}));

import React, { useContext } from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import { ModalEditMemberData } from "@/screens/SettingsScreen/ModalEditMemberData";
import { AuthContext } from "@/context/AuthContext";

const loggedAdmin = {
  _id: "admin-1",
  email: "admin@email.com",
  firstName: "Admin",
  lastName: "User",
  role: "admin" as const,
  phoneNumber: "",
  dateOfBirth: 0,
  paymentInfo: { datePayment: 1, amount: "10" },
  identification: { type: "CPF" as const, numberType: "00000000000" },
  contributions: { year: 2026, months: {} as any },
};

const members = [
  {
    _id: "admin-1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@email.com",
    role: "admin" as const,
    phoneNumber: "",
    dateOfBirth: 0,
    paymentInfo: { datePayment: 1, amount: "10" },
    identification: { type: "CPF" as const, numberType: "00000000000" },
  },
  {
    _id: "user-2",
    firstName: "João",
    lastName: "Silva",
    email: "joao@email.com",
    role: "user" as const,
    phoneNumber: "",
    dateOfBirth: 0,
    paymentInfo: { datePayment: 1, amount: "10" },
    identification: { type: "CPF" as const, numberType: "11111111111" },
  },
];

function renderWithContext(
  props = { visible: true, onClose: jest.fn() },
  contextOverrides: any = {},
) {
  const contextValue = {
    listMembers: mockListMembers,
    member: loggedAdmin,
    reloadMemberData: mockReloadMemberData,
    ...contextOverrides,
  };

  return render(
    <AuthContext.Provider value={contextValue as any}>
      <ModalEditMemberData {...props} />
    </AuthContext.Provider>,
  );
}

describe("ModalEditMemberData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListMembers.mockResolvedValue(members);
    mockEditMember.mockResolvedValue({});
    mockReloadMemberData.mockResolvedValue(undefined);
  });

  it("não renderiza nada quando visible é false", () => {
    const { queryByTestId } = renderWithContext({ visible: false, onClose: jest.fn() });
    expect(queryByTestId("modal-base")).toBeNull();
  });

  it("exibe skeletons durante o carregamento", async () => {
    mockListMembers.mockReturnValue(new Promise(() => {}));
    const { getAllByTestId } = renderWithContext();
    await waitFor(() => {
      expect(getAllByTestId("skeleton").length).toBe(4);
    });
  });

  it("exibe a lista de membros após carregar", async () => {
    const { getByText } = renderWithContext();
    await waitFor(() => {
      expect(getByText("Admin")).toBeTruthy();
      expect(getByText("João")).toBeTruthy();
    });
  });

  it("exibe o email de cada membro", async () => {
    const { getByText } = renderWithContext();
    await waitFor(() => {
      expect(getByText("admin@email.com")).toBeTruthy();
      expect(getByText("joao@email.com")).toBeTruthy();
    });
  });

  it("chama editMember com a nova role ao toggler o Switch", async () => {
    const { UNSAFE_getAllByType } = renderWithContext();
    await waitFor(() => UNSAFE_getAllByType("Switch" as any));

    const switches = UNSAFE_getAllByType("Switch" as any);
    await act(async () => {
      fireEvent(switches[1], "valueChange", true);
    });

    expect(mockEditMember).toHaveBeenCalledWith({ _id: "user-2", role: "admin" });
  });

  it("chama reloadMemberData quando o próprio admin altera sua role", async () => {
    const { UNSAFE_getAllByType } = renderWithContext();
    await waitFor(() => UNSAFE_getAllByType("Switch" as any));

    const switches = UNSAFE_getAllByType("Switch" as any);
    await act(async () => {
      fireEvent(switches[0], "valueChange", false);
    });

    await waitFor(() => {
      expect(mockReloadMemberData).toHaveBeenCalledTimes(1);
    });
  });

  it("não chama reloadMemberData ao alterar outro membro", async () => {
    const { UNSAFE_getAllByType } = renderWithContext();
    await waitFor(() => UNSAFE_getAllByType("Switch" as any));

    const switches = UNSAFE_getAllByType("Switch" as any);
    await act(async () => {
      fireEvent(switches[1], "valueChange", true);
    });

    await waitFor(() => {
      expect(mockReloadMemberData).not.toHaveBeenCalled();
    });
  });

  it("exibe toast de erro quando editMember falha", async () => {
    mockEditMember.mockRejectedValue(new Error("network"));

    const { UNSAFE_getAllByType } = renderWithContext();
    await waitFor(() => UNSAFE_getAllByType("Switch" as any));

    const switches = UNSAFE_getAllByType("Switch" as any);
    await act(async () => {
      fireEvent(switches[1], "valueChange", true);
    });

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Erro", "Falha ao atualizar permissão.");
    });
  });

  it("não chama listMembers quando visible é false", () => {
    renderWithContext({ visible: false, onClose: jest.fn() });
    expect(mockListMembers).not.toHaveBeenCalled();
  });
});
