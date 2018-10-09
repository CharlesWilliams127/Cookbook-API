// purely in mem
const recipes = [];

// a dictionary that maps

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
const getRecipes = (request, response, query) => {
  // make a local copy to edit/remove recipes based on filters
  let responseJSON = { };

  // if the user filters on a title
  // title is always unique, should only ever be 1 result
  if (query.title) {
    for (let i = 0; i < recipes.length; i++) {
      if (recipes[i].title === query.title) {
        responseJSON = { recipes: [recipes[i]] };
      }
    }
  } else { // user hasn't applied a filter
    responseJSON = { recipes };
  }

  respondJSON(request, response, 200, responseJSON);
};

const getRecipesMeta = (request, response) => respondJSONMeta(request, response, 200);

// function to add a user from a POST body
const addRecipe = (request, response, body) => {
  // default json message
  const responseJSON = {
    message: 'There are missing parameters.',
  };

  // flag to let us know when to exit the method
  let updateFlag = false;

  if (!body.title) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  for (let i = 0; i < recipes.length; i++) {
    if (recipes[i].title === body.title) {
      responseCode = 204;
      recipes[i].title = body.title;
      recipes[i].description = body.description;
      recipes[i].price = body.price;
      recipes[i].calories = body.calories;
      recipes[i].ingredients = body.Ingredient;
      recipes[i].directions = body.Direction;
      recipes[i].appliances = body.Appliance;
      updateFlag = true;
    }
  }

  // if our value was updated, should return here
  if (updateFlag) {
    return respondJSONMeta(request, response, responseCode);
  }

  recipes.push({
    title: body.title,
    description: body.description,
    price: body.price,
    calories: body.calories,
    ingredients: body.Ingredient,
    directions: body.Direction,
    appliances: body.Appliance,
  });

  responseJSON.message = 'Created Successfully';
  return respondJSON(request, response, responseCode, responseJSON);
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
