const formatCNPJCPF = (value: string, type: string) => {
  const digits = value.replace(/\D/g, "");
  if (type === "CPF") {
    return digits
      .slice(0, 11)
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  }

  if (type === "CNPJ") {
    return digits
      .slice(0, 14)
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");
  }
  return value;
};

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return digits.replace(/^(\d{2})(\d+)/, "($1) $2");
  }

  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  }

  return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
}

function formatCurrencyBRL(value: string, previousValue = "", max = 1000) {
  const digits = value.replace(/\D/g, "");

  if (!digits) return "";

  const amount = Number(digits) / 100;

  if (amount > max) {
    return previousValue;
  }

  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function formatUTCToDateBR(timestamp: number | string): string {
  const ts = Number(timestamp);

  if (!ts || Number.isNaN(ts)) {
    return "";
  }

  const date = new Date(ts);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  const result = `${day}/${month}/${year}`;

  return result;
}

function timeAgo(utcDate: string | Date): string {
  const date = new Date(utcDate);
  const now = new Date();

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "agora mesmo";
  }

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return `há ${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `há ${hours}h`;
  }

  const days = Math.floor(hours / 24);
  if (days === 1) {
    return "ontem";
  }
  if (days < 7) {
    return `há ${days} dias`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `há ${weeks} sem`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `há ${months} meses`;
  }

  const years = Math.floor(days / 365);
  return `há ${years} anos`;
}

export {
  formatCNPJCPF,
  formatPhoneNumber,
  formatCurrencyBRL,
  formatCEP,
  formatUTCToDateBR,
  timeAgo,
};
