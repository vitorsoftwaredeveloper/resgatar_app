const mockShow = jest.fn();
jest.mock("react-native-toast-message", () => ({ show: mockShow }));

import { ToastMessage } from "@/components/Toast";

describe("ToastMessage", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("success", () => {
    it("chama Toast.show com type success", () => {
      ToastMessage.success("Salvo!", "Dados salvos com sucesso.");
      expect(mockShow).toHaveBeenCalledWith(
        expect.objectContaining({ type: "success", text1: "Salvo!", text2: "Dados salvos com sucesso." }),
      );
    });

    it("visibilityTime é 3000ms", () => {
      ToastMessage.success("Ok");
      expect(mockShow).toHaveBeenCalledWith(
        expect.objectContaining({ visibilityTime: 3000 }),
      );
    });

    it("funciona sem mensagem opcional", () => {
      ToastMessage.success("Título");
      expect(mockShow).toHaveBeenCalledWith(
        expect.objectContaining({ text1: "Título", text2: undefined }),
      );
    });
  });

  describe("error", () => {
    it("chama Toast.show com type error", () => {
      ToastMessage.error("Erro!", "Algo deu errado.");
      expect(mockShow).toHaveBeenCalledWith(
        expect.objectContaining({ type: "error", text1: "Erro!", text2: "Algo deu errado." }),
      );
    });

    it("visibilityTime é 4000ms", () => {
      ToastMessage.error("Erro");
      expect(mockShow).toHaveBeenCalledWith(
        expect.objectContaining({ visibilityTime: 4000 }),
      );
    });

    it("funciona sem mensagem opcional", () => {
      ToastMessage.error("Título");
      expect(mockShow).toHaveBeenCalledWith(
        expect.objectContaining({ text1: "Título", text2: undefined }),
      );
    });
  });

  describe("warning", () => {
    it("chama Toast.show com type warning", () => {
      ToastMessage.warning("Atenção!", "Verifique os dados.");
      expect(mockShow).toHaveBeenCalledWith(
        expect.objectContaining({ type: "warning", text1: "Atenção!", text2: "Verifique os dados." }),
      );
    });

    it("visibilityTime é 3500ms", () => {
      ToastMessage.warning("Aviso");
      expect(mockShow).toHaveBeenCalledWith(
        expect.objectContaining({ visibilityTime: 3500 }),
      );
    });

    it("funciona sem mensagem opcional", () => {
      ToastMessage.warning("Título");
      expect(mockShow).toHaveBeenCalledWith(
        expect.objectContaining({ text1: "Título", text2: undefined }),
      );
    });
  });

  describe("posição", () => {
    it("todos os tipos exibem na posição top", () => {
      ToastMessage.success("a");
      ToastMessage.error("b");
      ToastMessage.warning("c");
      mockShow.mock.calls.forEach((call) => {
        expect(call[0]).toMatchObject({ position: "top" });
      });
    });
  });
});
