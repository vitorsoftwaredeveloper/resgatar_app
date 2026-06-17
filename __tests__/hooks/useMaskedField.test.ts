import { useMaskedFieldFromFormik } from "@/hooks/useMaskedField";
import { maskCPFOrCNPJ, maskPhoneBR, maskCEP } from "@/utils/mask";

function makeFormik(initialValue: string) {
  const values: Record<string, string> = { field: initialValue };
  const setFieldValue = jest.fn((field: string, value: string) => {
    values[field] = value;
  });
  return { values, setFieldValue };
}

describe("useMaskedFieldFromFormik", () => {
  it("retorna o valor atual do campo", () => {
    const formik = makeFormik("529.982.247-25");
    const result = useMaskedFieldFromFormik("field", maskPhoneBR, formik);
    expect(result.value).toBe("529.982.247-25");
  });

  it("retorna string vazia quando campo não existe no formik", () => {
    const formik = makeFormik("");
    const result = useMaskedFieldFromFormik("outro_campo", maskPhoneBR, formik);
    expect(result.value).toBe("");
  });

  it("aplica máscara de telefone ao digitar", () => {
    const formik = makeFormik("");
    const { onChangeText } = useMaskedFieldFromFormik("field", maskPhoneBR, formik);

    onChangeText("11999991234");

    expect(formik.setFieldValue).toHaveBeenCalledWith("field", "(11) 99999-1234");
  });

  it("aplica máscara de CPF ao digitar", () => {
    const formik = makeFormik("");
    const { onChangeText } = useMaskedFieldFromFormik(
      "field",
      (v) => maskCPFOrCNPJ(v, "CPF"),
      formik,
    );

    onChangeText("52998224725");

    expect(formik.setFieldValue).toHaveBeenCalledWith("field", "529.982.247-25");
  });

  it("aplica máscara de CEP ao digitar", () => {
    const formik = makeFormik("");
    const { onChangeText } = useMaskedFieldFromFormik("field", maskCEP, formik);

    onChangeText("01310100");

    expect(formik.setFieldValue).toHaveBeenCalledWith("field", "01310-100");
  });

  it("chama setFieldValue com o valor mascarado a cada onChangeText", () => {
    const formik = makeFormik("");
    const { onChangeText } = useMaskedFieldFromFormik("field", maskCEP, formik);

    onChangeText("01310");
    onChangeText("01310100");

    expect(formik.setFieldValue).toHaveBeenCalledTimes(2);
  });
});
