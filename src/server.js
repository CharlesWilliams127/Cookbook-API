const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/bundle.js': htmlHandler.getBundle,
  '/Add-512.png': htmlHandler.getAddImage,
  '/masonry.js': htmlHandler.getMasonry,
  '/getRecipes': jsonHandler.getRecipes,
  '/notReal': jsonHandler.notFound,
  getrecipesMeta: jsonHandler.getRecipesMeta, 
  index: htmlHandler.getIndex,
  notFound: jsonHandler.notFound,
};

const handlePost = (request, response, parsedUrl) => {
  // if post is to /addUser (our only POST url)
  if (parsedUrl.pathname === '/addRecipe') {
    const res = response;

    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end(); 
    });

    request.on('data', (chunk) => {
      body.push(chunk); 
    });

    // on end of upload stream.
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      console.dir(bodyString);

      const bodyParams = JSON.parse(bodyString);

      // pass to our addRecipe function 
      jsonHandler.addRecipe(request, res, bodyParams);
    }); 
  }
};

const handleHeadGet = (request, response, parsedUrl) => {
  // route to correct method based on url
  // if (request.method === 'GET')

  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, query.parse(parsedUrl.query));
  } else {
    urlStruct.notFound(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleHeadGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
