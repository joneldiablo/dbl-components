node update-version.js
yarn build
git add .
git commit -m "$1"
git push origin master
npm publish