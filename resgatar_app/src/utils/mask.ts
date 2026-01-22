import { useFormikContext } from "formik";

const onlyNumbers = (value = "") => value.replace(/\D/g, "");

const maskPhoneBR = (value = "") => {
  const digits = onlyNumbers(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
};

const maskCEP = (value = "") =>
  onlyNumbers(value)
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");

const maskCPF = (value = "") =>
  onlyNumbers(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const maskCNPJ = (value = "") =>
  onlyNumbers(value)
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");

const maskCPFOrCNPJ = (value = "", type: "CPF" | "CNPJ") =>
  type === "CPF" ? maskCPF(value) : maskCNPJ(value);

const maskCurrencyBRL = (value = "") => {
  const digits = onlyNumbers(value);
  const number = Number(digits) / 100;

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

function maskDateBR(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 8);

  const day = numbers.slice(0, 2);
  const month = numbers.slice(2, 4);
  const year = numbers.slice(4, 8);

  if (numbers.length <= 2) return day;
  if (numbers.length <= 4) return `${day}/${month}`;

  return `${day}/${month}/${year}`;
}

export {
  onlyNumbers,
  maskPhoneBR,
  maskCEP,
  maskCPFOrCNPJ,
  maskCurrencyBRL,
  maskDateBR,
};
