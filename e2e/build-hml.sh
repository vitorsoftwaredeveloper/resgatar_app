#!/usr/bin/env bash
# Gera um build standalone (release) apontando para HOMOLOGAÇÃO (HML) para rodar o e2e.
#
# Por que isso é necessário:
# O react-native-dotenv carrega `.env.${NODE_ENV}` por cima do `.env`, e o build
# release sempre roda com NODE_ENV=production -> ele embute o `.env.production`.
# Como o Expo sobrescreve BABEL_ENV/NODE_ENV no bundle, a única forma confiável de
# embutir HML num build release é colocar os valores de HML no `.env.production`
# durante o build. Este script faz isso com backup e restauração automática.
#
# Uso:
#   ./e2e/build-hml.sh android   (default)
#   ./e2e/build-hml.sh ios

set -euo pipefail

PLATFORM="${1:-android}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f .env.hml ]; then
  echo "ERRO: .env.hml não encontrado em $ROOT" >&2
  exit 1
fi

BACKUP="$(mktemp)"
cp .env.production "$BACKUP"

# Restaura o .env.production original em qualquer saída (sucesso, erro ou Ctrl-C)
restore() {
  cp "$BACKUP" .env.production
  rm -f "$BACKUP"
  echo "→ .env.production restaurado."
}
trap restore EXIT

echo "→ Usando .env.hml como env do build (temporário)."
cp .env.hml .env.production

# Limpa o bundle release pra forçar regeneração com o env novo
rm -rf android/app/build/generated/assets/createBundleReleaseJsAndAssets \
       android/app/build/intermediates/assets/release \
       android/app/build/intermediates/merged_assets/release 2>/dev/null || true

if [ "$PLATFORM" = "ios" ]; then
  npx expo run:ios --configuration Release --device
else
  npx expo run:android --variant release --device
fi
