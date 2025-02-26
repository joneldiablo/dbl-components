#!/bin/sh

echo "copy scss..."

# Verificar si hay archivos .scss en src/js antes de ejecutar find
if ! find src/js -type f -name "*.scss" | grep -q .; then
  echo "No SCSS files found in src/js, skipping copy."
  exit 0
fi

# Si hay archivos, ejecuta el proceso de copia
find src/js -type f -name "*.scss" | while IFS= read -r file; do
  dest=$(echo "$file" | sed 's|^src/js/|lib/js/|')
  mkdir -p "$(dirname "$dest")"
  cp "$file" "$dest"
done
