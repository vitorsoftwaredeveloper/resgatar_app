import { getApiErrorMessage } from "@/utils/apiError";

const FALLBACK = "Algo deu errado.";

describe("getApiErrorMessage", () => {
  it("retorna a mensagem da API quando presente", () => {
    const error = {
      response: { data: { message: "Email já cadastrado." } },
    };
    expect(getApiErrorMessage(error, FALLBACK)).toBe("Email já cadastrado.");
  });

  it("retorna o fallback quando não há response (erro de rede)", () => {
    const error = new Error("Network Error");
    expect(getApiErrorMessage(error, FALLBACK)).toBe(FALLBACK);
  });

  it("retorna o fallback quando data não tem message", () => {
    const error = { response: { data: { statusCode: 409 } } };
    expect(getApiErrorMessage(error, FALLBACK)).toBe(FALLBACK);
  });

  it("retorna o fallback quando a mensagem é vazia", () => {
    const error = { response: { data: { message: "" } } };
    expect(getApiErrorMessage(error, FALLBACK)).toBe(FALLBACK);
  });

  it("retorna o fallback quando a mensagem é só espaços", () => {
    const error = { response: { data: { message: "   " } } };
    expect(getApiErrorMessage(error, FALLBACK)).toBe(FALLBACK);
  });

  it("retorna o fallback para erro undefined", () => {
    expect(getApiErrorMessage(undefined, FALLBACK)).toBe(FALLBACK);
  });
});
