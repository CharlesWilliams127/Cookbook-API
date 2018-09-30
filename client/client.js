// get reference to masonry.js
let masonry;

let ingredientCounter = 0;
let directionCounter = 0;
let applianceCounter = 0;

// helper functions to increment variables for keeping track of items in lists
const getIngredientCount = () => { return ingredientCounter++ };
const getDirectionCount = () => { return directionCounter++; };
const getApplianceCount = () => { return applianceCounter++; };

// a simple struct that will determine which counter to update
const counterStruct = {
    'Ingredient': getIngredientCount,
    'Direction': getDirectionCount,
    'Appliance': getApplianceCount,
}

//function to parse our response
const parseJSON = (xhr, content) => {
    //parse response (obj will be empty in a 204 updated)
    try {
        const obj = JSON.parse(xhr.response);
        console.dir(obj);
        //if recipes in response, add to screen
        if(obj.recipes) {
            for (let i = 0; i < obj.recipes.length; i++) {
                // create a new grid item for masonry
                const gridItem = document.createElement('div');
                gridItem.className = "grid-item"; // TODO: make grid "smart" i.e, find out which size would be best

                const title = document.createElement('h2');
                title.textContent = obj.recipes[i].title;

                const description = document.createElement('p');
                description.textContent = obj.recipes[i].description;

                gridItem.appendChild(title);
                gridItem.appendChild(description);

                content.appendChild(gridItem);

                // add to masonry layout
                //masonry.appended(gridItem);

                //add an event listener to expand it
                gridItem.addEventListener( 'click', function( e ) {
                    gridItem.classList.toggle('grid-item--selected');
                    // trigger layout
                    masonry.layout();
                });
            }
            masonry.layout();
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
        ingredients: "",
        directions: "",
        appliances: ""
    }

    // populate ingredients
    for (let i = 0; i < ingredientCounter; i++) {
        formData.ingredients.push(addRecipe.querySelector(`#Ingredient${i}`).value);
    }

    // populate directions
    for (let i = 0; i < directionCounter; i++) {
        formData.directions.push(addRecipe.querySelector(`#Direction${i}`).value);
    }

    // populate appliances
    for (let i = 0; i < applianceCounter; i++) {
        formData.appliances.push(addRecipe.querySelector(`#Appliance${i}`).value);
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

const hideAddRecipe = (e) => {
    const section = document.querySelector('#addRecipe');
    section.style.display = "none";

    // delete existing content
    const applianceList = document.querySelector('#applianceList');
    const directionList = document.querySelector('#directionList');
    const ingredientList = document.querySelector('#ingredientList');

    applianceList.innerHTML = "";
    directionList.innerHTML = "";
    ingredientList.innerHTML = "";
}

const init = () => {
    // set up masonry content
    const grid = document.querySelector('#dynamicContent');
    masonry = new Masonry(grid, {
        percentPosition: true,
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        horizonatalOrder: true,
    });

    //make recipe button
    const displayRecipeButton = document.querySelector("#displayAddRecipe");
    const hideRecipeButton = document.querySelector("#hideAddRecipe");

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
    const hideAddRecipeContent = (e) => hideAddRecipe(e);

    //attach submit events (for clicking submit or hitting enter)
    recipeForm.addEventListener('submit', addRecipe);
    getForm.addEventListener('submit', getRecipes);
    ingredientButton.addEventListener('click', addIngredient);
    directionButton.addEventListener('click', addDirection);
    applianceButton.addEventListener('click', addAppliance);
    displayRecipeButton.addEventListener('click', displayAddRecipeContent);
    hideRecipeButton.addEventListener('click', hideAddRecipeContent);

    //console.dir(msnry);
    // automatically display known recipes
    requestUpdate();
    
};

window.onload = init;