import {
  onlyNumbers,
  maskPhoneBR,
  maskCEP,
  maskCPFOrCNPJ,
  maskCurrencyBRL,
  maskDateBR,
  validateCPF,
  validateCNPJ,
} from "@/utils/mask";

describe("onlyNumbers", () => {
  it("remove todos os caracteres não numéricos", () => {
    expect(onlyNumbers("123.456-78")).toBe("12345678");
    expect(onlyNumbers("(11) 99999-1234")).toBe("11999991234");
    expect(onlyNumbers("abc")).toBe("");
    expect(onlyNumbers("")).toBe("");
  });
});

describe("maskPhoneBR", () => {
  it("formata celular com 11 dígitos", () => {
    expect(maskPhoneBR("11999991234")).toBe("(11) 99999-1234");
  });

  it("formata telefone fixo com 10 dígitos", () => {
    expect(maskPhoneBR("1133334444")).toBe("(11) 3333-4444");
  });

  it("retorna parcial durante digitação", () => {
    expect(maskPhoneBR("11")).toBe("11");
    expect(maskPhoneBR("119")).toBe("(11) 9");
  });

  it("não ultrapassa 11 dígitos", () => {
    expect(maskPhoneBR("119999912345678")).toBe("(11) 99999-1234");
  });

  it("aceita valor vazio", () => {
    expect(maskPhoneBR("")).toBe("");
  });
});

describe("maskCEP", () => {
  it("formata CEP com 8 dígitos", () => {
    expect(maskCEP("01310100")).toBe("01310-100");
  });

  it("não ultrapassa 8 dígitos", () => {
    expect(maskCEP("013101009999")).toBe("01310-100");
  });

  it("aceita valor vazio", () => {
    expect(maskCEP("")).toBe("");
  });
});

describe("maskCPFOrCNPJ", () => {
  it("aplica máscara de CPF quando type é CPF", () => {
    expect(maskCPFOrCNPJ("52998224725", "CPF")).toBe("529.982.247-25");
  });

  it("aplica máscara de CNPJ quando type é CNPJ", () => {
    expect(maskCPFOrCNPJ("11222333000181", "CNPJ")).toBe("11.222.333/0001-81");
  });

  it("aceita valor vazio para CPF", () => {
    expect(maskCPFOrCNPJ("", "CPF")).toBe("");
  });

  it("aceita valor vazio para CNPJ", () => {
    expect(maskCPFOrCNPJ("", "CNPJ")).toBe("");
  });

  it("não ultrapassa 11 dígitos para CPF", () => {
    expect(maskCPFOrCNPJ("529982247251234", "CPF")).toBe("529.982.247-25");
  });

  it("não ultrapassa 14 dígitos para CNPJ", () => {
    expect(maskCPFOrCNPJ("112223330001819999", "CNPJ")).toBe("11.222.333/0001-81");
  });
});

describe("maskCurrencyBRL", () => {
  it("formata centavos corretamente", () => {
    expect(maskCurrencyBRL("100")).toBe("R$ 1,00");
  });

  it("formata valores maiores", () => {
    expect(maskCurrencyBRL("100000")).toBe("R$ 1.000,00");
  });

  it("aceita valor vazio", () => {
    expect(maskCurrencyBRL("")).toBe("R$ 0,00");
  });
});

describe("maskDateBR", () => {
  it("formata data completa DD/MM/YYYY", () => {
    expect(maskDateBR("17062026")).toBe("17/06/2026");
  });

  it("formata parcialmente durante digitação", () => {
    expect(maskDateBR("17")).toBe("17");
    expect(maskDateBR("1706")).toBe("17/06");
    expect(maskDateBR("170620")).toBe("17/06/20");
  });

  it("não ultrapassa 8 dígitos", () => {
    expect(maskDateBR("1706202699")).toBe("17/06/2026");
  });
});

describe("validateCPF", () => {
  it("valida CPFs corretos", () => {
    expect(validateCPF("529.982.247-25")).toBe(true);
    expect(validateCPF("52998224725")).toBe(true);
  });

  it("rejeita CPFs com todos os dígitos iguais", () => {
    expect(validateCPF("111.111.111-11")).toBe(false);
    expect(validateCPF("000.000.000-00")).toBe(false);
  });

  it("rejeita CPF com comprimento incorreto", () => {
    expect(validateCPF("123")).toBe(false);
    expect(validateCPF("")).toBe(false);
  });

  it("rejeita CPF com dígitos verificadores errados", () => {
    expect(validateCPF("529.982.247-26")).toBe(false);
  });
});

describe("validateCNPJ", () => {
  it("valida CNPJs corretos", () => {
    expect(validateCNPJ("11.222.333/0001-81")).toBe(true);
    expect(validateCNPJ("11222333000181")).toBe(true);
  });

  it("rejeita CNPJs com todos os dígitos iguais", () => {
    expect(validateCNPJ("11.111.111/1111-11")).toBe(false);
    expect(validateCNPJ("00000000000000")).toBe(false);
  });

  it("rejeita CNPJ com comprimento incorreto", () => {
    expect(validateCNPJ("123")).toBe(false);
    expect(validateCNPJ("")).toBe(false);
  });

  it("rejeita CNPJ com dígitos verificadores errados", () => {
    expect(validateCNPJ("11.222.333/0001-82")).toBe(false);
  });
});
