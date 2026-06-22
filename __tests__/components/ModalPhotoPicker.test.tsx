const mockPickFromLibrary = jest.fn();
const mockTakePhoto = jest.fn();

jest.mock("@/context/ThemeContext", () => ({
  useAppTheme: () => ({
    colors: {
      primary: "#6B4F3A",
      error: "#E53935",
      background: "#F6F1EB",
      card: "#FFF",
      border: "#DED6CC",
      softBrown: "#EDE6DE",
      textMuted: "#8C7A6B",
      white: "#FFF",
    },
    mode: "light",
  }),
}));
jest.mock("@/hooks/useImagePicker", () => ({
  useImagePicker: () => ({
    loading: false,
    pickFromLibrary: mockPickFromLibrary,
    takePhoto: mockTakePhoto,
  }),
}));
jest.mock("@/components/ModalBase", () => {
  const React = require("react");
  return {
    ModalBase: ({ children, visible }: any) =>
      visible ? React.createElement("ModalBase", null, children) : null,
  };
});
jest.mock("@/components/Avatar", () => {
  const React = require("react");
  return {
    Avatar: ({ photo }: any) =>
      React.createElement("Avatar", { testID: "avatar", photo }),
  };
});
jest.mock("@/components/Button", () => {
  const React = require("react");
  return {
    Button: ({ title, onPress, disabled }: any) =>
      React.createElement("Button", {
        testID: `btn-${title}`,
        onPress: disabled ? undefined : onPress,
        disabled: !!disabled,
      }),
  };
});
jest.mock("@/components/ItemActionList", () => {
  const React = require("react");
  return {
    ItemActionList: ({ title, onPress }: any) =>
      React.createElement("ItemActionList", {
        testID: `action-${title}`,
        onPress,
      }),
  };
});
jest.mock("lucide-react-native", () => ({
  Camera: () => null,
  ImageIcon: () => null,
  Trash2: () => null,
}));

import React from "react";
import { act, fireEvent, render } from "@testing-library/react-native";
import { ModalPhotoPicker } from "@/components/ModalPhotoPicker";

const CAMERA = "action-Tirar foto";
const GALLERY = "action-Escolher da galeria";
const SAVE = "btn-Salvar";

function setup(props?: Partial<React.ComponentProps<typeof ModalPhotoPicker>>) {
  const onConfirm = jest.fn();
  const onClose = jest.fn();
  const utils = render(
    <ModalPhotoPicker
      visible
      onClose={onClose}
      onConfirm={onConfirm}
      {...props}
    />,
  );
  return { onConfirm, onClose, ...utils };
}

describe("ModalPhotoPicker", () => {
  beforeEach(() => jest.clearAllMocks());

  it("usa a foto atual como preview inicial", () => {
    const { getByTestId } = setup({ currentPhoto: "data:foto-atual" });
    expect(getByTestId("avatar").props.photo).toBe("data:foto-atual");
  });

  it("atualiza o preview ao tirar foto", async () => {
    mockTakePhoto.mockResolvedValueOnce("CAMBASE64");
    const { getByTestId } = setup();

    await act(async () => {
      fireEvent.press(getByTestId(CAMERA));
    });

    expect(getByTestId("avatar").props.photo).toBe("CAMBASE64");
  });

  it("atualiza o preview ao escolher da galeria", async () => {
    mockPickFromLibrary.mockResolvedValueOnce("GALBASE64");
    const { getByTestId } = setup();

    await act(async () => {
      fireEvent.press(getByTestId(GALLERY));
    });

    expect(getByTestId("avatar").props.photo).toBe("GALBASE64");
  });

  it("não altera o preview quando o picker é cancelado (null)", async () => {
    mockPickFromLibrary.mockResolvedValueOnce(null);
    const { getByTestId } = setup({ currentPhoto: "data:original" });

    await act(async () => {
      fireEvent.press(getByTestId(GALLERY));
    });

    expect(getByTestId("avatar").props.photo).toBe("data:original");
  });

  it("mantém o Salvar desabilitado enquanto não há alterações", () => {
    const { getByTestId } = setup({ currentPhoto: "data:foto" });
    expect(getByTestId(SAVE).props.disabled).toBe(true);
  });

  it("chama onConfirm com a nova foto ao salvar", async () => {
    mockTakePhoto.mockResolvedValueOnce("NOVA");
    const { getByTestId, onConfirm } = setup();

    await act(async () => {
      fireEvent.press(getByTestId(CAMERA));
    });
    await act(async () => {
      fireEvent.press(getByTestId(SAVE));
    });

    expect(onConfirm).toHaveBeenCalledWith("NOVA");
  });

  it("chama onConfirm com string vazia ao remover a foto", async () => {
    const { getByTestId, UNSAFE_getByType, onConfirm } = setup({
      currentPhoto: "data:foto",
    });

    await act(async () => {
      fireEvent.press(UNSAFE_getByType("TouchableOpacity" as any));
    });
    await act(async () => {
      fireEvent.press(getByTestId(SAVE));
    });

    expect(onConfirm).toHaveBeenCalledWith("");
  });

  describe("botão remover", () => {
    it("não aparece quando não há foto", () => {
      const { UNSAFE_queryByType } = setup();
      expect(UNSAFE_queryByType("TouchableOpacity" as any)).toBeNull();
    });

    it("aparece quando há foto", () => {
      const { UNSAFE_queryByType } = setup({ currentPhoto: "data:foto" });
      expect(UNSAFE_queryByType("TouchableOpacity" as any)).toBeTruthy();
    });
  });

  it("não renderiza nada quando visible é false", () => {
    const { UNSAFE_queryByType } = setup({ visible: false });
    expect(UNSAFE_queryByType("avatar" as any)).toBeNull();
  });

  it("aceita rótulo de confirmação customizado", () => {
    const { getByTestId } = setup({
      title: "Imagem",
      confirmLabel: "Atualizar",
    });
    expect(getByTestId("btn-Atualizar")).toBeTruthy();
  });

  it("ignora novas ações enquanto está salvando", async () => {
    let resolveSave: () => void = () => {};
    const pendingConfirm = jest.fn(
      () => new Promise<void>((resolve) => (resolveSave = resolve)),
    );
    mockTakePhoto.mockResolvedValueOnce("PRIMEIRA");
    const { getByTestId } = setup({ onConfirm: pendingConfirm });

    await act(async () => {
      fireEvent.press(getByTestId(CAMERA));
    });
    // inicia o salvamento — a promise fica pendente, então saving = true
    await act(async () => {
      fireEvent.press(getByTestId(SAVE));
    });
    // tocar de novo em "tirar foto" não dispara o picker
    await act(async () => {
      fireEvent.press(getByTestId(CAMERA));
    });

    expect(mockTakePhoto).toHaveBeenCalledTimes(1);

    await act(async () => resolveSave());
  });
});
