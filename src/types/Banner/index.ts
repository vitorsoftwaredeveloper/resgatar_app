import { RootStackParamList } from "@/navigation/types";

export type BannerActionType = "external" | "internal" | "none";

export type BannerScreen = Extract<
  keyof RootStackParamList,
  | "Videos"
  | "Arrecadacao"
  | "BalancoAnual"
  | "Expenses"
  | "Donations"
  | "PersonalSettings"
  | "Settings"
>;

export const BANNER_SCREEN_OPTIONS: { label: string; value: BannerScreen }[] = [
  { label: "Vídeos", value: "Videos" },
  { label: "Arrecadação", value: "Arrecadacao" },
  { label: "Balanço Anual", value: "BalancoAnual" },
  { label: "Despesas", value: "Expenses" },
  { label: "Doações", value: "Donations" },
  { label: "Configurações pessoais", value: "PersonalSettings" },
  { label: "Configurações", value: "Settings" },
];

// Tamanho máximo do data URI em bytes — espelha MAX_CAMPAIGN_BANNER_SIZE do backend.
export const MAX_BANNER_SIZE_BYTES = 500 * 1024;

export interface IBanner {
  id: string;
  banner: string; // data URI base64
  title: string;
  action: { type: BannerActionType; value: string };
  active: boolean;
  order: number;
}

export interface IBannerInput {
  banner: string;
  title: string;
  action: { type: BannerActionType; value: string };
  active?: boolean;
}
