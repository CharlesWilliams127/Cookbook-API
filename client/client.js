let ingredientCounter = 0;
let directionCounter = 0;

// helper functions to increment variables for keeping track of items in lists
const getIngredientCount = () => { return ingredientCounter++ };
const getDirectionCount = () => { return directionCounter++; };

// a simple struct that will determine which counter to update
const counterStruct = {
    'Ingredient': getIngredientCount,
    'Direction': getDirectionCount,
}

//function to parse our response
const parseJSON = (xhr, content) => {
    //parse response (obj will be empty in a 204 updated)
    try {
        const obj = JSON.parse(xhr.response);
        console.dir(obj);
        
        //if message in response, add to screen
        if(obj.message) {
        const p = document.createElement('p');
        p.textContent = `Message: ${obj.message}`;
        content.appendChild(p);
        }
        
        //if recipes in response, add to screen
        if(obj.recipes) {
        const userList = document.createElement('p');
        const recipes = JSON.stringify(obj.recipes);
        userList.textContent = recipes;
        content.appendChild(userList);
        }
    }
    catch(SyntaxError) {}
};

//function to handle our response
const handleResponse = (xhr) => {
    const content = document.querySelector('#dynamicContent');

    //check the status code
    switch(xhr.status) {
        case 200: //success
        content.innerHTML = `<b>Success</b>`;
        break;
        case 201: //created
        content.innerHTML = '<b>Create</b>';
        break;
        case 204: //updated (no response back from server)
        content.innerHTML = '<b>Updated (No Content)</b>';
        return;
        case 400: //bad request
        content.innerHTML = `<b>Bad Request</b>`;
        break;
        case 404: //not found
        content.innerHTML = `<b>Resource Not Found</b>`;
        break;
        default: //any other status code
        content.innerHTML = `Error code not implemented by client.`;
        break;
    }
    //parse response 
    parseJSON(xhr, content);
};

//function to send our post request
const sendPost = (e, addRecipe) => {
    const recipeAction = addRecipe.getAttribute('action');
    const recipeMethod = addRecipe.getAttribute('method');

    const titleField = addRecipe.querySelector('#titleField');
    const descField = addRecipe.querySelector('#descriptionField');
    const priceField = addRecipe.querySelector('#priceField');
    const caloriesField = addRecipe.querySelector('#caloriesField');

    // set up base form data
    const formData = {
        title: titleField.value,
        description: descField.value,
        price: priceField.value,
        calories: caloriesField.value,
        ingredients: ""
    }

    // populate ingredients
    for (let i = 0; i < ingredientCounter; i++) {
        formData.ingredients.push(addRecipe.querySelector(`#Ingredient${i}`).value);
    }

    console.dir(formData);

    const xhr = new XMLHttpRequest();
    xhr.open(recipeMethod, recipeAction);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    //set our requested response type in hopes of a JSON response
    xhr.setRequestHeader ('Accept', 'application/json');

    //set our function to handle the response
    xhr.onload = () => handleResponse(xhr);

    const section = document.querySelector('#addRecipe');
    section.style.display = "none";

    xhr.send(JSON.stringify(formData));

    //prevent the browser's default action (to send the form on its own)
    e.preventDefault();
    //return false to prevent the browser from trying to change page
    return false;
};

const requestUpdate = () => {

    const xhr = new XMLHttpRequest();

    xhr.open('get', '/getRecipes');

    xhr.setRequestHeader('Accept', 'application/json');
    //if get request or head request
    xhr.onload = () => handleResponse(xhr, true);

    //send ajax request
    xhr.send();

    //cancel browser's default action
    //e.preventDefault();
    //return false to prevent page redirection from a form
    return false;
};

// creates a new field for the user to add to
const addItem = (e, list, elemName) => {
    const count = counterStruct[elemName]();
    const item = document.createElement('li');
    item.innerHTML = `<input id="${elemName}${count}" type="text" name="${elemName}" />`;
    list.appendChild(item);
};

// displays the recipe creation content
const displayAddRecipe = (e) => {
    const section = document.querySelector('#addRecipe');
    section.style.display = "block";
}

const init = () => {
    //make recipe button
    const displayRecipeButton = document.querySelector("#displayAddRecipe");

    //grab forms
    const recipeForm = document.querySelector('#recipeForm');
    const getForm = document.querySelector('#getRecipes');

    const ingredientList = document.querySelector('#ingredientList');
    const ingredientButton = document.querySelector('#ingredientButton');

    const directionList = document.querySelector('#directionList');
    const directionButton = document.querySelector('#directionButton');

    const applianceList = document.querySelector('#applianceList');
    const applianceButton = document.querySelector('#applianceButton');

    //create handlers
    const addRecipe = (e) => sendPost(e, recipeForm);
    const getRecipes = (e) => requestUpdate(e, getForm);
    const addIngredient = (e) => addItem(e, ingredientList, 'Ingredient');
    const addDirection = (e) => addItem(e, directionList, 'Direction');
    const addAppliance = (e) => addItem(e, applianceList, 'Appliance');
    const displayAddRecipeContent = (e) => displayAddRecipe(e);

    //attach submit events (for clicking submit or hitting enter)
    recipeForm.addEventListener('submit', addRecipe);
    getForm.addEventListener('submit', getRecipes);
    ingredientButton.addEventListener('click', addIngredient);
    directionButton.addEventListener('click', addDirection);
    applianceButton.addEventListener('click', addAppliance);
    displayRecipeButton.addEventListener('click', displayAddRecipeContent);

    // automatically display known recipes
    requestUpdate();
    
};

window.onload = init;