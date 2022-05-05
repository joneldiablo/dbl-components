node --experimental-json-modules update-version.js
# construir desde "arriba" para no instalar las dependencias aquí
# hay pedos si se está trabajando con la librería linkada (yarn link)
cd ..
yarn build
cd ./dbl-components
#-------
git add .
git commit -m "$1"
git push origin master
npm publish