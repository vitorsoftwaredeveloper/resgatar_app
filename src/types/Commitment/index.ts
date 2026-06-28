// Modo de repetição (flag escolhida pelo admin; o agent mensal do backend a
// interpreta na virada de mês). Espelha COMMITMENT_REPEAT do resgatar_community.
export type CommitmentRepeat = "weekly" | "monthly" | "once";

// Ordinal da ocorrência mensal: N-ésima do mês ou a última.
export type CommitmentOrdinal = 1 | 2 | 3 | 4 | 5 | "last";

// Forma retornada pela API. `day` é o nome canônico do dia ("Quarta"); `date`
// é a data concreta (ISO) em monthly/once e null em weekly (recorrente).
// `weekday`/`ordinal` expõem a âncora da recorrência para a edição reabrir fiel.
export interface ICommitment {
  id: string;
  title: string;
  day: string;
  time: string;
  location: string;
  repeat: CommitmentRepeat;
  weekday: number | null;
  ordinal: CommitmentOrdinal | null;
  date: string | null;
}

// Payload de criação/edição. O backend deriva `day` e `date` da âncora enviada:
//   weekly  -> weekday (0-6)
//   monthly -> weekday (0-6) + ordinal (1-5 | "last")
//   once    -> date ("YYYY-MM-DD")
export interface ICommitmentInput {
  title: string;
  time: string;
  location: string;
  repeat: CommitmentRepeat;
  weekday?: number;
  ordinal?: CommitmentOrdinal;
  date?: string;
}
