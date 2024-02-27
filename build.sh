#!/bin/bash

# Inicialización de variables
OTP=""

# Función de uso
usage() {
  echo "Uso: $0 [--otp <otp>]"
  exit 1
}

# Parseo de argumentos
while getopts ":-:" opt; do
  case ${opt} in
    - )
      case "${OPTARG}" in
        otp )
          OTP="${!OPTIND}"; OPTIND=$(( $OPTIND + 1 ))
          ;;
        *)
          echo "Opción inválida: --${OPTARG}" >&2
          usage
          ;;
      esac
      ;;
    \? )
      echo "Opción inválida: -$OPTARG" >&2
      usage
      ;;
    : )
      echo "La opción -$OPTARG requiere un argumento." >&2
      usage
      ;;
  esac
done

##------

git checkout master
git merge dev

# Actualizar versión y capturar la nueva versión
nueva_version=$(node update-version.js)

# Preparar los directorios
rm -rf ./lib/js/* && mkdir -p lib/js
rm -rf ./lib/css/* && mkdir -p lib/css
rm -rf ./lib/scss/* && mkdir -p lib/scss
cp -r src/scss lib

# Compilar con Babel
yarn babel

# Hacer commit con el número de la nueva versión
git add .
git commit -m "$nueva_version"
git push origin --all
git tag -a "$nueva_version" -m "$nueva_version"
git push origin "$nueva_version"
git checkout dev

# Publicar en npm
if [ -n "$OTP" ]; then
  npm publish --otp "$OTP"
else
  npm publish
fi
