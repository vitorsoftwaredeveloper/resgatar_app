import ExpoModulesCore

public class DevModeDetectorModule: Module {
  public func definition() -> ModuleDefinition {
    Name("DevModeDetector")

    // iOS não possui "Opções do desenvolvedor" como o Android. Sempre false.
    Function("isDeveloperModeEnabled") { () -> Bool in
      return false
    }
  }
}
