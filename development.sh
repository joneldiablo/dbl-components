#!/bin/bash

set -e

# ⛑️ Validar que estamos en la carpeta correcta
CURRENT_DIR_NAME=$(basename "$PWD")
if [[ "$CURRENT_DIR_NAME" != "dbl-components" ]]; then
  echo "🚫 Este script debe ejecutarse desde la carpeta 'dbl-components'."
  exit 1
fi

# 📂 Validar que exista ../dbl-components-linked
LINKED_DIR="../dbl-components-linked"
if [[ ! -d "$LINKED_DIR" ]]; then
  echo "📁 No existe '$LINKED_DIR', creando..."
  cp -r . "$LINKED_DIR"
  rm -rf "$LINKED_DIR/node_modules"

  echo "🔗 Ejecutando yarn link en la copia..."
  cd "$LINKED_DIR"
  yarn link
  cd -
else
  echo "✅ '$LINKED_DIR' ya existe"
fi

# 🔒 Verificar si hay cambios sin commitear
if [[ -n $(git status --porcelain) ]]; then
  echo "🚫 Tienes cambios sin guardar...."
fi

# 🌿 Guardar rama actual
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "🔀 Rama actual: $BRANCH"

# 🔁 Sincronizar la copia
echo "🧹 Restableciendo cambios en la copia y cambiando a rama '$BRANCH'"
cd "$LINKED_DIR"
git checkout .
git checkout "$BRANCH"
cd -

# 🧪 Testear y construir
echo "🧪 Ejecutando pruebas..."
yarn test || { echo "❌ Tests fallaron"; exit 1; }

echo "🏗️ Ejecutando build..."
yarn build || { echo "❌ Build falló"; exit 1; }

# 📦 Copiar `lib` al linked
echo "📦 Actualizando carpeta 'lib' en linked..."
rm -rf "$LINKED_DIR/lib"
cp -r ./lib "$LINKED_DIR/lib"

echo "✅ ¡Listo flaco! Todo sincronizado entre dbl-components y dbl-components-linked. Arre 😎"
