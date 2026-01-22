// src/hooks/useMaskedField.ts
import { useFormikContext } from "formik";

type MaskFn = (value: string) => string;

export function useMaskedFieldFromFormik(
  name: string,
  mask: MaskFn,
  formik: {
    values: any;
    setFieldValue: (field: string, value: any) => void;
  },
) {
  return {
    value: formik.values[name] ?? "",
    onChangeText: (text: string) => {
      const masked = mask(text);
      formik.setFieldValue(name, masked);
    },
  };
}
