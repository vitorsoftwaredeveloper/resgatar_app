// Config plugin: força a splash screen do Android a ter SEMPRE fundo bege
// (#F5F0E8) com o logo marrom centralizado, independente de o aparelho estar
// em modo escuro — inclusive em aparelhos com "force-dark" agressivo
// (MIUI/HyperOS da Xiaomi).
//
// COMO FUNCIONA: o force-dark do MIUI inverte CORES de fundo, mas NÃO inverte
// BITMAPS (imagens). Logo, em vez de usar uma cor de fundo (que seria
// invertida), montamos o fundo da janela (`android:windowBackground`) como um
// drawable BITMAP — um layer-list com:
//   1. um tile bege (PNG) esticado para preencher a tela;
//   2. o logo marrom transparente centralizado.
// Como tudo é bitmap, o MIUI não inverte nada → fica bege+logo em todo lugar.
//
// Usa um `finalized` mod (roda depois de todos os outros mods, inclusive o do
// expo-splash-screen), então sobrevive ao `prebuild --clean`.

const { withFinalizedMod } = require("@expo/config-plugins");
const {
  generateImageAsync,
  generateImageBackgroundAsync,
  compositeImagesAsync,
  getPngInfo,
} = require("@expo/image-utils");
const fs = require("fs");
const path = require("path");

// Mesmo valor de `imageWidth` configurado no plugin expo-splash-screen.
const IMAGE_WIDTH_DP = 250;
const SPLASH_BG_COLOR = "#F5F0E8";

const DENSITY_SCALE = {
  mdpi: 1,
  hdpi: 1.5,
  xhdpi: 2,
  xxhdpi: 3,
  xxxhdpi: 4,
};

const LAYER_LIST_XML = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  <item>
    <bitmap android:src="@drawable/splashscreen_bg" android:gravity="fill" />
  </item>
  <item>
    <bitmap android:src="@drawable/splashscreen_logo" android:gravity="center" />
  </item>
</layer-list>
`;

/** Injeta android:windowBackground=@drawable/splashscreen num <style> do styles.xml. */
function injectWindowBackground(stylesXml, styleName) {
  const item = `    <item name="android:windowBackground">@drawable/splashscreen</item>`;
  const styleRegex = new RegExp(
    `(<style name="${styleName.replace(/\./g, "\\.")}"[^>]*>)`,
  );
  if (!styleRegex.test(stylesXml)) return stylesXml;
  // Evita duplicar se já existe dentro daquele style.
  const styleBlock = new RegExp(
    `<style name="${styleName.replace(/\./g, "\\.")}"[\\s\\S]*?</style>`,
  );
  const block = stylesXml.match(styleBlock)?.[0] ?? "";
  if (block.includes('name="android:windowBackground"')) return stylesXml;
  return stylesXml.replace(styleRegex, `$1\n${item}`);
}

/**
 * @param {import('@expo/config-plugins').ConfigPlugin} config
 * @param {{ source: string }} opts caminho do PNG fonte (transparente)
 */
const withTransparentSplashLogo = (config, { source } = {}) => {
  return withFinalizedMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const srcPath = path.resolve(projectRoot, source);

      if (!fs.existsSync(srcPath)) {
        throw new Error(
          `[withTransparentSplashLogo] imagem fonte não encontrada: ${srcPath}`,
        );
      }

      const resDir = path.join(projectRoot, "android/app/src/main/res");

      // 1) Reescreve o ICONE do splash nativo como o logo TRANSPARENTE (sem
      // quadrado de fundo). Assim, o fundo (windowBackground/windowSplashScreen)
      // acompanha o modo do sistema:
      //   - modo claro: fundo bege + logo marrom;
      //   - modo escuro (force-dark do MIUI): fundo escuro + logo marrom.
      for (const [density, scale] of Object.entries(DENSITY_SCALE)) {
        const targetPath = path.join(
          resDir,
          `drawable-${density}`,
          "splashscreen_logo.png",
        );
        if (!fs.existsSync(targetPath)) continue;

        const { width: canvas } = await getPngInfo(targetPath);
        const logoPx = Math.round(IMAGE_WIDTH_DP * scale);

        const { source: logoBuffer } = await generateImageAsync(
          { projectRoot, cacheType: "splash-logo-transparent" },
          {
            src: srcPath,
            resizeMode: "contain",
            backgroundColor: "transparent",
            width: logoPx,
            height: logoPx,
          },
        );

        const background = await generateImageBackgroundAsync({
          width: canvas,
          height: canvas,
          backgroundColor: "transparent",
          resizeMode: "cover",
        });

        const offset = Math.round((canvas - logoPx) / 2);
        const composed = await compositeImagesAsync({
          background,
          foreground: logoBuffer,
          x: offset,
          y: offset,
        });

        fs.writeFileSync(targetPath, composed);
      }

      // 2) Gera um tile bege (BITMAP) usado como fundo — não é invertido pelo MIUI.
      const bgTile = await generateImageBackgroundAsync({
        width: 64,
        height: 64,
        backgroundColor: SPLASH_BG_COLOR,
        resizeMode: "cover",
      });
      const drawableDir = path.join(resDir, "drawable");
      fs.mkdirSync(drawableDir, { recursive: true });
      fs.writeFileSync(
        path.join(drawableDir, "splashscreen_bg.png"),
        bgTile,
      );

      // 3) Cria o layer-list (fundo bege + logo) usado como windowBackground.
      fs.writeFileSync(
        path.join(drawableDir, "splashscreen.xml"),
        LAYER_LIST_XML,
      );

      // 4) Aponta o windowBackground dos temas para o bitmap (resiste ao force-dark).
      const stylesPath = path.join(resDir, "values", "styles.xml");
      if (fs.existsSync(stylesPath)) {
        let styles = fs.readFileSync(stylesPath, "utf8");
        styles = injectWindowBackground(styles, "Theme.App.SplashScreen");
        styles = injectWindowBackground(styles, "AppTheme");
        fs.writeFileSync(stylesPath, styles);
      }

      return config;
    },
  ]);
};

module.exports = withTransparentSplashLogo;
