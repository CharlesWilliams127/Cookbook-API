const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const jsBundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);
// Masonry source - https://masonry.desandro.com/
const jsMasonry = fs.readFileSync(`${__dirname}/../node_modules/masonry-layout/dist/masonry.pkgd.min.js`);
// ImagesLoaded source - https://imagesloaded.desandro.com/
const jsImagesLoaded = fs.readFileSync(`${__dirname}/../node_modules/imagesloaded/imagesloaded.pkgd.min.js`);
// Add image source - https://www.iconfinder.com/icons/2022138/add_add_sign_add_symbol_circle_plus_plus_icon
const addImage = fs.readFileSync(`${__dirname}/../hosted/Add-512.png`);
// Leaves Pattern - Constantin Galaktionov
// Source - https://www.toptal.com/designers/subtlepatterns/?s=leaves+pattern
const backgroundImage = fs.readFileSync(`${__dirname}/../hosted/leaves-pattern.png`);
const loadingImage = fs.readFileSync(`${__dirname}/../hosted/loading.gif`);
// Black Paper - Atle Mo
// Source - https://www.toptal.com/designers/subtlepatterns/?s=black+paper
const blackBackgroundImage = fs.readFileSync(`${__dirname}/../hosted/black_paper.png`);
// Lindy's Diner - Jake Luedecke
// Source - https://www.dafont.com/lindysdiner.font
const dinerFont = fs.readFileSync(`${__dirname}/../hosted/LindysDiner.ttf`);

const respond = (request, response, content, type, code) => {
  response.writeHead(code, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const getIndex = (request, response) => {
  respond(request, response, index, 'text/html', 200);
};

const getCSS = (request, response) => {
  respond(request, response, css, 'text/css', 200);
};

const getBundle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(jsBundle);
  response.end();
};

const getAddImage = (request, response) => {
  respond(request, response, addImage, 'image/png', 200);
};

const getBackgroundImage = (request, response) => {
  respond(request, response, backgroundImage, 'image/png', 200);
};

const getBlackBackgroundImage = (request, response) => {
  respond(request, response, blackBackgroundImage, 'image/png', 200);
};

const getLoadingImage = (request, response) => {
  respond(request, response, loadingImage, 'image/gif', 200);
};

const getFont = (reqest, response) => {
  // tffs don't have a MIME type so read them in as binary
  respond(reqest, response, dinerFont, 'application/octet-stream', 200);
};

const getMasonry = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(jsMasonry);
  response.end();
};

const getImagesLoaded = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(jsImagesLoaded);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getBundle,
  getAddImage,
  getMasonry,
  getImagesLoaded,
  getBackgroundImage,
  getBlackBackgroundImage,
  getLoadingImage,
  getFont,
};
