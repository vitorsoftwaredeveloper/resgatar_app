import Constants from "expo-constants";

export type AppEnv = "production" | "hml";

export const APP_ENV: AppEnv =
  (Constants.expoConfig?.extra?.appEnv as AppEnv) ?? "hml";

/** Build de produção (APP_ENV=production). HML e local retornam false. */
export const IS_PRODUCTION = APP_ENV === "production";
