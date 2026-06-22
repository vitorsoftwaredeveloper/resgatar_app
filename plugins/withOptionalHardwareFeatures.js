// Config plugin: garante que recursos de hardware implícitos (câmera e
// microfone) sejam declarados como `android:required="false"` no
// AndroidManifest.
//
// PORQUE: o Google Play converte permissões em requisitos de hardware. Permissões
// como CAMERA e RECORD_AUDIO (esta última adicionada pelo expo-image-picker)
// fazem o Play assumir `uses-feature ... required="true"` e EXCLUIR dispositivos
// sem aquele hardware (tablets/TVs sem câmera ou microfone). Como o app só
// seleciona/tira foto de perfil, esses recursos são opcionais — declarando
// required="false" o app volta a suportar todos os dispositivos.

const { withAndroidManifest } = require("@expo/config-plugins");

const OPTIONAL_FEATURES = [
  "android.hardware.camera",
  "android.hardware.camera.autofocus",
  "android.hardware.camera.front",
  "android.hardware.microphone",
];

function setOptionalFeatures(androidManifest) {
  const manifest = androidManifest.manifest;

  if (!Array.isArray(manifest["uses-feature"])) {
    manifest["uses-feature"] = [];
  }
  const features = manifest["uses-feature"];

  for (const name of OPTIONAL_FEATURES) {
    const existing = features.find((f) => f.$?.["android:name"] === name);

    if (existing) {
      existing.$["android:required"] = "false";
    } else {
      features.push({
        $: {
          "android:name": name,
          "android:required": "false",
        },
      });
    }
  }

  return androidManifest;
}

const withOptionalHardwareFeatures = (config) =>
  withAndroidManifest(config, (config) => {
    config.modResults = setOptionalFeatures(config.modResults);
    return config;
  });

module.exports = withOptionalHardwareFeatures;
