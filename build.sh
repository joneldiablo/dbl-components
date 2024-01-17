if [ -n "$1" ]; then
  node update-version.js
fi
rm -rf ./lib/js/* && mkdir -p lib/js
rm -rf ./lib/css/* && mkdir -p lib/css
rm -rf ./lib/scss/* && mkdir -p lib/scss
cp -r src/scss lib
# Construir desde "arriba" para no instalar las dependencias aquí
# Hay problemas si se está trabajando con la librería linkada (yarn link)
cd ..
yarn babel
cd ./dbl-components
#-------
if [ -n "$1" ]; then
  git add .
  git commit -m "$1"
  git push origin --all
  #git push backup --all
fi
npm publish --otp
