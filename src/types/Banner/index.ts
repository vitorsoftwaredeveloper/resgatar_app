import { RootStackParamList } from "@/navigation/types";

export type BannerActionType = "external" | "internal" | "none";

export type BannerScreen =
  | Extract<keyof RootStackParamList, "Videos" | "PersonalSettings">
  | "Bills"
  | "Readings"
  | "Profile";

// Telas que vivem dentro do BottomTabs (rota "Home"), navegadas via
// navigation.navigate("Home", { screen: value }) em vez de navigate(value) direto.
export const BANNER_TAB_SCREENS: BannerScreen[] = ["Bills", "Readings", "Profile"];

export const BANNER_SCREEN_OPTIONS: { label: string; value: BannerScreen }[] = [
  { label: "Contribuições", value: "Bills" },
  { label: "Leituras", value: "Readings" },
  { label: "Mais", value: "Profile" },
  { label: "Vídeos", value: "Videos" },
  { label: "Configurações pessoais", value: "PersonalSettings" },
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
