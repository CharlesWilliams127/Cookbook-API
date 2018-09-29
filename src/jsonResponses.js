// purely in mem
const recipes = {};

// function to respond with a json object
// takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// return user object as JSON
const getRecipes = (request, response) => {
  const responseJSON = {
    recipes,
  };

  respondJSON(request, response, 200, responseJSON);
};

const getRecipesMeta = (request, response) => respondJSONMeta(request, response, 200);

// function to add a user from a POST body
const addRecipe = (request, response, body) => {
  // default json message
  const responseJSON = {
    message: 'There are missing parameters.',
  };

  console.dir(body);

  if (!body.title) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (recipes[body.title]) {
    responseCode = 204;
  } else {
    recipes[body.title] = {};
  }
  recipes[body.title].title = body.title;
  recipes[body.title].description = body.description;
  recipes[body.title].price = body.price;
  recipes[body.title].calories = body.calories;
  recipes[body.title].ingredients = body.Ingredient;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

const notFound = (request, response) => {
  const message = {
    message: 'The page you were looking for was not found',
  };

  return respondJSON(request, response, 404, message);
};

// public exports
module.exports = {
  getRecipes,
  addRecipe,
  notFound,
  getRecipesMeta,
};
