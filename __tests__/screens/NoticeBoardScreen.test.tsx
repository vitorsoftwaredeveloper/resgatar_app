const mockList = jest.fn();
const mockSaveOrder = jest.fn();
const mockGoBack = jest.fn();

jest.mock("react-native-reorderable-list", () => {
  const React = require("react");
  const { FlatList } = require("react-native");
  return {
    __esModule: true,
    default: ({ data, renderItem, keyExtractor, contentContainerStyle }: any) =>
      React.createElement(FlatList, { data, renderItem, keyExtractor, contentContainerStyle }),
    reorderItems: (arr: any[], from: number, to: number) => {
      const copy = [...arr];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    },
    useReorderableDrag: () => jest.fn(),
    useIsActive: () => false,
  };
});

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 0, top: 0, left: 0, right: 0 }),
}));

jest.mock("@react-navigation/native", () => {
  const React = require("react");
  return {
    useNavigation: () => ({ goBack: mockGoBack }),
    useFocusEffect: (cb: any) =>
      React.useEffect(() => {
        cb();
      }, [cb]),
  };
});

jest.mock("@/context/AuthContext", () => {
  const React = require("react");
  return { AuthContext: React.createContext({ member: null }) };
});

jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: {
      primary: "#6B4F3A",
      background: "#F6F1EB",
      softBrown: "#EDE6DE",
      card: "#FFF",
      border: "#DED6CC",
      inputBg: "#FBF8F4",
      text: "#3E2F23",
      textStrong: "#3E2C1C",
      textMuted: "#8C7A6B",
      muted: "#9E8E80",
      white: "#FFF",
      error: "#E53935",
      waiting: "#E0B96A",
    },
    mode: "light",
  }),
}));

jest.mock("@/services/CommitmentService", () => ({
  CommitmentService: {
    list: (...args: any[]) => mockList(...args),
    saveOrder: (...args: any[]) => mockSaveOrder(...args),
  },
}));

jest.mock("@/components/Header", () => {
  const React = require("react");
  const { TouchableOpacity } = require("react-native");
  return {
    Header: ({ onBack }: any) =>
      React.createElement(TouchableOpacity, { testID: "header-back", onPress: onBack }),
  };
});

jest.mock("@/components/Toast", () => ({
  ToastMessage: { error: jest.fn(), success: jest.fn() },
}));

jest.mock("@/screens/NoticeBoardScreen/ModalCommitmentForm", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    ModalCommitmentForm: ({ visible, commitment, onClose, onSuccess }: any) =>
      visible
        ? React.createElement(
            View,
            { testID: "modal-form" },
            React.createElement(
              Text,
              { testID: "form-mode" },
              commitment ? "edit" : "create",
            ),
            React.createElement(Text, { testID: "form-success", onPress: onSuccess }, "OK"),
            React.createElement(Text, { testID: "form-close", onPress: onClose }, "Fechar"),
          )
        : null,
  };
});

jest.mock("lucide-react-native", () => ({
  GripVertical: () => null,
  MoveVertical: () => null,
  Pencil: () => null,
  Plus: () => null,
}));

import React from "react";
import { ActivityIndicator } from "react-native";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { AuthContext } from "@/context/AuthContext";
import { NoticeBoardModal } from "@/screens/NoticeBoardScreen";
import { ICommitment } from "@/types/Commitment";

// Nome dos dias da semana (mesmo array interno de commitment.ts)
const WEEKDAY_NAMES = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const adminMember = { role: "admin", firstName: "Admin", lastName: "User", profileImage: null };
const memberUser = { role: "member", firstName: "Maria", lastName: "Silva", profileImage: null };

const commitment1: ICommitment = {
  id: "c1",
  title: "Grupo de oração",
  day: "Quarta",
  time: "19h",
  location: "Capela",
  repeat: "weekly",
  weekday: 3,
  ordinal: null,
  date: null,
};

const todayWeekday = new Date().getDay();
const commitmentToday: ICommitment = {
  id: "c2",
  title: "Missa hoje",
  day: WEEKDAY_NAMES[todayWeekday],
  time: "8h",
  location: "Matriz",
  repeat: "weekly",
  weekday: todayWeekday,
  ordinal: null,
  date: null,
};

function renderAs(member: any) {
  return render(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <AuthContext.Provider value={{ member } as any}>
      <NoticeBoardModal visible={true} onClose={jest.fn()} />
    </AuthContext.Provider>,
  );
}

describe("NoticeBoardModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSaveOrder.mockResolvedValue(undefined);
  });

  it("exibe spinner durante o carregamento", () => {
    mockList.mockReturnValue(new Promise(() => {})); // nunca resolve
    const { UNSAFE_getAllByType } = renderAs(adminMember);
    expect(UNSAFE_getAllByType(ActivityIndicator).length).toBeGreaterThan(0);
  });

  it("estado vazio — membro vê aviso genérico sem FAB e sem Editar", async () => {
    mockList.mockResolvedValueOnce([]);
    const { getByText, queryByLabelText } = renderAs(memberUser);
    await waitFor(() => getByText("Nenhum compromisso publicado ainda."));
    expect(queryByLabelText("Publicar compromisso")).toBeNull();
    expect(queryByLabelText("Editar ordem dos compromissos")).toBeNull();
  });

  it("estado vazio — admin vê sugestão de publicar", async () => {
    mockList.mockResolvedValueOnce([]);
    const { getByText } = renderAs(adminMember);
    await waitFor(() => getByText(/Toque em \+ para publicar/));
  });

  it("lista os compromissos com título, horário e local", async () => {
    mockList.mockResolvedValueOnce([commitment1]);
    const { getByText } = renderAs(adminMember);
    await waitFor(() => getByText("Grupo de oração"));
    expect(getByText("19h")).toBeTruthy();
    expect(getByText(/Capela/)).toBeTruthy();
  });

  it("exibe badge HOJE para compromisso do dia atual", async () => {
    mockList.mockResolvedValueOnce([commitmentToday]);
    const { getByText } = renderAs(adminMember);
    await waitFor(() => getByText("HOJE"));
  });

  it("admin vê botão Editar e FAB após carregar", async () => {
    mockList.mockResolvedValueOnce([commitment1]);
    const { getByLabelText } = renderAs(adminMember);
    await waitFor(() => getByLabelText("Editar ordem dos compromissos"));
    expect(getByLabelText("Publicar compromisso")).toBeTruthy();
  });

  it("membro não vê botão Editar nem FAB", async () => {
    mockList.mockResolvedValueOnce([commitment1]);
    const { queryByLabelText } = renderAs(memberUser);
    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(1));
    expect(queryByLabelText("Editar ordem dos compromissos")).toBeNull();
    expect(queryByLabelText("Publicar compromisso")).toBeNull();
  });

  it("pressionar Editar exibe hint de instrução e esconde o FAB", async () => {
    mockList.mockResolvedValueOnce([commitment1]);
    const { getByLabelText, getByText, queryByLabelText } =
      renderAs(adminMember);
    await waitFor(() => getByText("Grupo de oração"));

    await act(async () => {
      fireEvent.press(getByLabelText("Editar ordem dos compromissos"));
    });

    expect(getByText(/Toque em um compromisso para editar/)).toBeTruthy();
    expect(queryByLabelText("Publicar compromisso")).toBeNull();
  });

  it("pressionar FAB abre ModalCommitmentForm em modo criação", async () => {
    mockList.mockResolvedValueOnce([commitment1]);
    const { getByLabelText, getByText, getByTestId } = renderAs(adminMember);
    await waitFor(() => getByText("Grupo de oração"));

    await act(async () => {
      fireEvent.press(getByLabelText("Publicar compromisso"));
    });

    expect(getByTestId("modal-form")).toBeTruthy();
    expect(getByTestId("form-mode").props.children).toBe("create");
  });

  it("tap em item em modo edição abre ModalCommitmentForm em modo edição", async () => {
    mockList.mockResolvedValueOnce([commitment1]);
    const { getByLabelText, getByText, getByTestId } = renderAs(adminMember);
    await waitFor(() => getByText("Grupo de oração"));

    // Entrar em modo edição
    await act(async () => {
      fireEvent.press(getByLabelText("Editar ordem dos compromissos"));
    });

    // Pressionar o item (evento sobe até o Pressable da row)
    await act(async () => {
      fireEvent.press(getByText("Grupo de oração"));
    });

    expect(getByTestId("modal-form")).toBeTruthy();
    expect(getByTestId("form-mode").props.children).toBe("edit");
  });

  it("onSuccess no form fecha o modal e recarrega a lista", async () => {
    mockList.mockResolvedValue([commitment1]);
    const { getByLabelText, getByText, getByTestId, queryByTestId } =
      renderAs(adminMember);
    await waitFor(() => getByText("Grupo de oração"));

    // Abrir form via FAB
    await act(async () => {
      fireEvent.press(getByLabelText("Publicar compromisso"));
    });
    expect(getByTestId("modal-form")).toBeTruthy();

    // Disparar onSuccess
    await act(async () => {
      fireEvent.press(getByTestId("form-success"));
    });

    // Modal fechado e lista recarregada (list chamado 2x: carga inicial + reload)
    expect(queryByTestId("modal-form")).toBeNull();
    expect(mockList).toHaveBeenCalledTimes(2);
  });
});
