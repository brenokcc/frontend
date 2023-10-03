DIR=/Users/breno/Documents/Workspace/pnp-api/api/static/app
npm run build
rm -f "$DIR/assets"/*.js
rm -f "$DIR/assets"/*.css
cp dist/assets/* "$DIR/assets"
cp dist/js/autocomplete.js "$DIR"/js/autocomplete.js
cp dist/js/core.js "$DIR"/js/core.js
cp dist/css/core.css "$DIR"/css/core.css
cp dist/index.html "$DIR"/index.html
