const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockRemove = jest.fn();

jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: {
      primary: "#6B4F3A",
      background: "#F6F1EB",
      card: "#FFF",
      border: "#DED6CC",
      inputBg: "#FBF8F4",
      text: "#3E2F23",
      textStrong: "#3E2C1C",
      textMuted: "#8C7A6B",
      muted: "#9E8E80",
      white: "#FFF",
      error: "#E53935",
    },
    mode: "light",
  }),
}));

jest.mock("@/services/CommitmentService", () => ({
  CommitmentService: {
    create: (...args: any[]) => mockCreate(...args),
    update: (...args: any[]) => mockUpdate(...args),
    remove: (...args: any[]) => mockRemove(...args),
  },
}));

jest.mock("@/components/Toast", () => ({
  ToastMessage: { error: jest.fn(), success: jest.fn() },
}));

jest.mock("@/utils/mask", () => ({ maskDateBR: (v: string) => v }));

jest.mock("@/components/ModalBase", () => {
  const React = require("react");
  return {
    ModalBase: ({ visible, children }: any) =>
      visible ? React.createElement("View", { testID: "modal-base" }, children) : null,
  };
});

jest.mock("@/components/Card", () => {
  const React = require("react");
  return { Card: ({ children }: any) => React.createElement("View", null, children) };
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
    Input: ({ label, onChangeText, value }: any) =>
      React.createElement("TextInput", {
        testID: `input-${label}`,
        onChangeText,
        value,
      }),
  };
});

// Select simplificado: cada opção é um texto pressionável que dispara onSelect.
jest.mock("@/components/SelectField", () => {
  const React = require("react");
  return {
    SelectField: ({ options, onSelect }: any) =>
      React.createElement(
        "View",
        { testID: "select-field" },
        (options ?? []).map((o: any) =>
          React.createElement(
            "Text",
            { key: String(o.value), testID: `opt-${o.value}`, onPress: () => onSelect(o.value) },
            o.label,
          ),
        ),
      ),
  };
});

// TimePicker simplificado: um input que dispara onChange com o horário.
jest.mock("@/components/TimePickerField", () => {
  const React = require("react");
  return {
    TimePickerField: ({ onChange }: any) =>
      React.createElement("TextInput", { testID: "time-input", onChangeText: onChange }),
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
            (actions ?? []).map((a: any, i: number) =>
              React.createElement(
                "Text",
                { key: i, testID: `dialog-${a.label}`, onPress: a.onPress },
                a.label,
              ),
            ),
          )
        : null,
  };
});

jest.mock("lucide-react-native", () => ({ Trash2: () => null }));

import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { ModalCommitmentForm } from "@/screens/NoticeBoardScreen/ModalCommitmentForm";
import { ToastMessage } from "@/components/Toast";
import { ICommitment } from "@/types/Commitment";

const defaultProps = {
  visible: true,
  onClose: jest.fn(),
  onSuccess: jest.fn(),
};

const weeklyCommitment: ICommitment = {
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

describe("ModalCommitmentForm", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renderiza em modo criação", () => {
    const { getByTestId } = render(<ModalCommitmentForm {...defaultProps} />);
    expect(getByTestId("modal-base")).toBeTruthy();
    expect(getByTestId("btn-Publicar")).toBeTruthy();
  });

  it("renderiza em modo edição com nome preenchido e botões Salvar/Excluir", () => {
    const { getByTestId, getByText } = render(
      <ModalCommitmentForm {...defaultProps} commitment={weeklyCommitment} />,
    );
    expect(getByTestId("btn-Salvar")).toBeTruthy();
    expect(getByText("Excluir")).toBeTruthy();
    expect(getByTestId("input-Nome").props.value).toBe("Grupo de oração");
  });

  it("não envia quando faltam campos obrigatórios", async () => {
    const { getByTestId } = render(<ModalCommitmentForm {...defaultProps} />);
    await act(async () => {
      fireEvent.press(getByTestId("btn-Publicar"));
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("cria um compromisso semanal com a âncora correta", async () => {
    mockCreate.mockResolvedValueOnce(weeklyCommitment);
    const onSuccess = jest.fn();
    const { getByTestId } = render(
      <ModalCommitmentForm {...defaultProps} onSuccess={onSuccess} />,
    );

    await act(async () => {
      fireEvent.changeText(getByTestId("input-Nome"), "Missa");
      fireEvent.changeText(getByTestId("time-input"), "19h");
      fireEvent.changeText(getByTestId("input-Local"), "Igreja Matriz");
      fireEvent.press(getByTestId("opt-3")); // Quarta
    });
    await act(async () => {
      fireEvent.press(getByTestId("btn-Publicar"));
    });

    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith({
        title: "Missa",
        time: "19h",
        location: "Igreja Matriz",
        repeat: "weekly",
        weekday: 3,
      }),
    );
    expect(ToastMessage.success).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });

  it("cria um compromisso mensal com weekday + ordinal", async () => {
    mockCreate.mockResolvedValueOnce(weeklyCommitment);
    const { getByTestId, getByText } = render(
      <ModalCommitmentForm {...defaultProps} />,
    );

    await act(async () => {
      fireEvent.changeText(getByTestId("input-Nome"), "Aparecida");
      fireEvent.changeText(getByTestId("time-input"), "9h");
      fireEvent.changeText(getByTestId("input-Local"), "Aparecida");
      fireEvent.press(getByText("Mensal")); // frequência mensal
    });
    // após "Mensal", o bloco de ordinal passa a existir
    await act(async () => {
      fireEvent.press(getByTestId("opt-6")); // Sábado
      fireEvent.press(getByText("3º")); // terceiro
    });
    await act(async () => {
      fireEvent.press(getByTestId("btn-Publicar"));
    });

    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith({
        title: "Aparecida",
        time: "9h",
        location: "Aparecida",
        repeat: "monthly",
        weekday: 6,
        ordinal: 3,
      }),
    );
  });

  it("edita um compromisso existente via update", async () => {
    mockUpdate.mockResolvedValueOnce(weeklyCommitment);
    const onSuccess = jest.fn();
    const { getByTestId } = render(
      <ModalCommitmentForm
        {...defaultProps}
        commitment={weeklyCommitment}
        onSuccess={onSuccess}
      />,
    );

    await act(async () => {
      fireEvent.changeText(getByTestId("input-Local"), "Salão paroquial");
    });
    await act(async () => {
      fireEvent.press(getByTestId("btn-Salvar"));
    });

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith(
        "c1",
        expect.objectContaining({
          location: "Salão paroquial",
          repeat: "weekly",
          weekday: 3,
        }),
      ),
    );
    expect(onSuccess).toHaveBeenCalled();
  });

  it("exclui após confirmação no diálogo", async () => {
    mockRemove.mockResolvedValueOnce(undefined);
    const onSuccess = jest.fn();
    const { getByTestId, getByText } = render(
      <ModalCommitmentForm
        {...defaultProps}
        commitment={weeklyCommitment}
        onSuccess={onSuccess}
      />,
    );

    await act(async () => {
      fireEvent.press(getByText("Excluir")); // abre confirmação
    });
    expect(getByTestId("dialog")).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByTestId("dialog-excluir"));
    });

    await waitFor(() => expect(mockRemove).toHaveBeenCalledWith("c1"));
    expect(onSuccess).toHaveBeenCalled();
  });
});
