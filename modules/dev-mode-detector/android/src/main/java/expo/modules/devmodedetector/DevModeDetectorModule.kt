package expo.modules.devmodedetector

import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class DevModeDetectorModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("DevModeDetector")

    // Retorna true se as "Opções do desenvolvedor" ou a depuração USB (ADB)
    // estiverem ativadas no aparelho.
    Function("isDeveloperModeEnabled") {
      val context = appContext.reactContext ?: return@Function false
      val resolver = context.contentResolver

      val developerOptionsOn = try {
        Settings.Global.getInt(
          resolver,
          Settings.Global.DEVELOPMENT_SETTINGS_ENABLED,
          0,
        ) != 0
      } catch (e: Exception) {
        false
      }

      val adbEnabled = try {
        Settings.Global.getInt(resolver, Settings.Global.ADB_ENABLED, 0) != 0
      } catch (e: Exception) {
        false
      }

      developerOptionsOn || adbEnabled
    }
  }
}
