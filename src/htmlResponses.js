const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const jsBundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);
const jsMasonry = fs.readFileSync(`${__dirname}/../node_modules/masonry-layout/dist/masonry.pkgd.min.js`);
const addImage = fs.readFileSync(`${__dirname}/../hosted/Add-512.png`);
const backgroundImage = fs.readFileSync(`${__dirname}/../hosted/leaves-pattern.png`);
const loadingImage = fs.readFileSync(`${__dirname}/../hosted/loading.gif`);

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
  respond(request, response, backgroundImage, 'image/png', 200 );
}

const getLoadingImage = (request, response) => {
  respond(request, response, loadingImage, 'image/gif', 200 );
}

const getMasonry = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(jsMasonry);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getBundle,
  getAddImage,
  getMasonry,
  getBackgroundImage,
  getLoadingImage
};
