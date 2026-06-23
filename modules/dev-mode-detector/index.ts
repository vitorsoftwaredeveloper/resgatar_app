import { requireNativeModule } from "expo-modules-core";

interface DevModeDetectorNativeModule {
  isDeveloperModeEnabled(): boolean;
}

let nativeModule: DevModeDetectorNativeModule | null = null;
try {
  nativeModule = requireNativeModule<DevModeDetectorNativeModule>(
    "DevModeDetector",
  );
} catch {
  // Módulo nativo ainda não compilado (ex.: antes do prebuild/rebuild) — fallback.
  nativeModule = null;
}

/**
 * True se o aparelho estiver com "Opções do desenvolvedor" ou depuração USB (ADB)
 * ativadas. Sempre false no iOS e quando o módulo nativo não está disponível.
 */
export function isDeveloperModeEnabled(): boolean {
  try {
    return nativeModule?.isDeveloperModeEnabled() ?? false;
  } catch {
    return false;
  }
}
