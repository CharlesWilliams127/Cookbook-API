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
  '/leaves-pattern.png': htmlHandler.getBackgroundImage,
  '/black_paper.png': htmlHandler.getBlackBackgroundImage,
  '/LindysDiner.ttf': htmlHandler.getFont,
  '/loading.gif' : htmlHandler.getLoadingImage,
  '/masonry.js': htmlHandler.getMasonry,
  '/imagesLoaded.js': htmlHandler.getImagesLoaded,
  '/getRecipes': jsonHandler.getRecipes,
  '/deleteRecipe': jsonHandler.deleteRecipe,
  '/notReal': jsonHandler.notFound,
  getrecipesMeta: jsonHandler.getRecipesMeta, 
  index: htmlHandler.getIndex,
  notFound: jsonHandler.notFound,
};

const handlePost = (request, response, parsedUrl) => {
  // if post is to /addRecipe (our only POST url)
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

const handleHeadGetDelete = (request, response, parsedUrl) => {
  // route to correct method based on url
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
    handleHeadGetDelete(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
