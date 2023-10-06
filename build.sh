node update-version.js
rm -rf ./lib/js/* && mkdir -p lib/js
rm -rf ./lib/css/* && mkdir -p lib/css
rm -rf ./lib/scss/* && mkdir -p lib/scss
cp -r src/scss lib
# construir desde "arriba" para no instalar las dependencias aquí
# hay pedos si se está trabajando con la librería linkada (yarn link)
cd ..
yarn babel
cd ./framework-entersol
#-------
git add .
git commit -m "$1"
git push origin --all
git push backup --all
npm publish