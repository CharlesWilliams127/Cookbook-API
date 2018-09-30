// purely in mem
const recipes = [];

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

  for (r in recipes) {
    if (r.title === body.title) { // already exists, update info
      console.dir(r);
      responseCode = 204;
      r.title = body.title;
      r.description = body.description; 
      r.price = body.price;
      r.calories = body.calories;
      r.ingredients = body.Ingredient; 
      r.directions = body.Direction;
      r.appliances = body.Appliance;
      return respondJSONMeta(request, response, responseCode);
    }
  }

  recipes.push({
    title: body.title,
    description: body.description,
    price: body.price,
    calories: body.calories,
    ingredients: body.Ingredient,
    directions: body.Direction,
    appliances: body.Appliance
  });

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  
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
