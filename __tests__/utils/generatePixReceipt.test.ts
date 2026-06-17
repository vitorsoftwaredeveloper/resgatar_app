jest.mock("expo-print", () => ({ printToFileAsync: jest.fn() }));
jest.mock("expo-sharing", () => ({ shareAsync: jest.fn() }));
jest.mock("@/context/ThemeContext", () => ({}));

import {
  generateComprovanteHTML,
  shareComprovantePDF,
} from "@/utils/generatePixReceipt";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const baseInput = {
  userName: "João Silva",
  userEmail: "joao@email.com",
  month: "Janeiro/2026",
  value: "R$ 50,00",
  paidDate: "17/06/2026",
};

describe("generateComprovanteHTML", () => {
  it("contém o nome do associado", () => {
    const html = generateComprovanteHTML(baseInput);
    expect(html).toContain("João Silva");
  });

  it("contém o e-mail do associado", () => {
    const html = generateComprovanteHTML(baseInput);
    expect(html).toContain("joao@email.com");
  });

  it("contém o mês de referência", () => {
    const html = generateComprovanteHTML(baseInput);
    expect(html).toContain("Janeiro/2026");
  });

  it("contém o valor pago", () => {
    const html = generateComprovanteHTML(baseInput);
    expect(html).toContain("R$ 50,00");
  });

  it("contém a data de pagamento", () => {
    const html = generateComprovanteHTML(baseInput);
    expect(html).toContain("17/06/2026");
  });

  it("exibe o CPF quando fornecido", () => {
    const html = generateComprovanteHTML({ ...baseInput, userCpf: "529.982.247-25" });
    expect(html).toContain("529.982.247-25");
    expect(html).toContain("CPF");
  });

  it("exibe o tipo de documento customizado", () => {
    const html = generateComprovanteHTML({
      ...baseInput,
      userCpf: "11.222.333/0001-81",
      userDocType: "CNPJ",
    });
    expect(html).toContain("CNPJ");
  });

  it("não exibe bloco de CPF quando não fornecido", () => {
    const html = generateComprovanteHTML(baseInput);
    const cpfBlockCount = (html.match(/userCpf/g) || []).length;
    expect(cpfBlockCount).toBe(0);
  });

  it("usa cores do tema light por padrão", () => {
    const html = generateComprovanteHTML(baseInput);
    expect(html).toContain("#FAFAFA");
  });

  it("usa cores do tema dark quando especificado", () => {
    const html = generateComprovanteHTML({ ...baseInput, themeMode: "dark" });
    expect(html).toContain("#1A1812");
  });

  it("retorna HTML válido com DOCTYPE", () => {
    const html = generateComprovanteHTML(baseInput);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("</html>");
  });
});

describe("shareComprovantePDF", () => {
  const item = {
    name: "João Silva",
    email: "joao@email.com",
    month: "Janeiro/2026",
    paidAt: "17/06/2026",
    value: "R$ 50,00",
    cpf: "529.982.247-25",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Print.printToFileAsync as jest.Mock).mockResolvedValue({ uri: "file://comprovante.pdf" });
    (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);
  });

  it("gera o PDF e chama shareAsync", async () => {
    await shareComprovantePDF(item);
    expect(Print.printToFileAsync).toHaveBeenCalledTimes(1);
    expect(Sharing.shareAsync).toHaveBeenCalledWith(
      "file://comprovante.pdf",
      expect.objectContaining({ mimeType: "application/pdf" })
    );
  });

  it("passa o HTML correto para o printToFileAsync", async () => {
    await shareComprovantePDF(item);
    const call = (Print.printToFileAsync as jest.Mock).mock.calls[0][0];
    expect(call.html).toContain("João Silva");
    expect(call.html).toContain("Janeiro/2026");
  });

  it("não lança exceção quando Print falha", async () => {
    (Print.printToFileAsync as jest.Mock).mockRejectedValue(new Error("falha"));
    await expect(shareComprovantePDF(item)).resolves.not.toThrow();
  });
});
