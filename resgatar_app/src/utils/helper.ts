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

function formatDateFromTimestamp(timestamp?: number) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("pt-BR");
}

function parseDateBRToTimestamp(date: string): number {
  const [day, month, year] = date.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
}

export { timeAgo, formatDateFromTimestamp, parseDateBRToTimestamp };
