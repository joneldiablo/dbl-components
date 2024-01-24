#!/bin/bash

# Inicialización de variables
MESSAGE=""
OTP=""

# Función de uso
usage() {
  echo "Uso: $0 [-m <mensaje>] [--otp <otp>]"
  exit 1
}

# Parseo de argumentos
while getopts ":m:-:" opt; do
  case ${opt} in
    m )
      MESSAGE=$OPTARG
      ;;
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

if [ -n "$MESSAGE" ]; then
  node update-version.js
fi

rm -rf ./lib/js/* && mkdir -p lib/js
rm -rf ./lib/css/* && mkdir -p lib/css
rm -rf ./lib/scss/* && mkdir -p lib/scss
cp -r src/scss lib

yarn babel

if [ -n "$MESSAGE" ]; then
  git add .
  git commit -m "$MESSAGE"
  git push origin --all
  #git push backup --all
fi

if [ -n "$OTP" ]; then
  npm publish --otp "$OTP"
else
  npm publish
fi
