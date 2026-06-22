import { resolveAvatarUri } from "@/utils/image";

describe("resolveAvatarUri", () => {
  describe("retorna null (cai no placeholder genérico)", () => {
    it("para undefined", () => {
      expect(resolveAvatarUri(undefined)).toBeNull();
    });

    it("para null", () => {
      expect(resolveAvatarUri(null)).toBeNull();
    });

    it("para string vazia", () => {
      expect(resolveAvatarUri("")).toBeNull();
    });

    it("para string só com espaços", () => {
      expect(resolveAvatarUri("   ")).toBeNull();
    });

    it("para conteúdo que não é base64 (caracteres inválidos)", () => {
      expect(resolveAvatarUri("not valid!!")).toBeNull();
    });

    it("para string base64 curta demais (< 8 chars)", () => {
      expect(resolveAvatarUri("abc")).toBeNull();
    });
  });

  describe("retorna data URI", () => {
    it("mantém a string quando já é um data URI", () => {
      const dataUri = "data:image/png;base64,iVBORw0KGgo=";
      expect(resolveAvatarUri(dataUri)).toBe(dataUri);
    });

    it("monta o prefixo jpeg para base64 cru", () => {
      expect(resolveAvatarUri("AAAABBBBCCCC")).toBe(
        "data:image/jpeg;base64,AAAABBBBCCCC",
      );
    });

    it("aceita base64 com padding (=)", () => {
      expect(resolveAvatarUri("QUJDREVGRw==")).toBe(
        "data:image/jpeg;base64,QUJDREVGRw==",
      );
    });

    it("ignora espaços nas bordas", () => {
      expect(resolveAvatarUri("  AAAABBBBCCCC  ")).toBe(
        "data:image/jpeg;base64,AAAABBBBCCCC",
      );
    });
  });
});
