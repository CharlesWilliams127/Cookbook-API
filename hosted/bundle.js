'use strict';

// get reference to masonry.js
var masonry = void 0;

var ingredientCounter = 0;
var directionCounter = 0;
var applianceCounter = 0;

// helper functions to increment variables for keeping track of items in lists
var getIngredientCount = function getIngredientCount() {
    return ingredientCounter++;
};
var getDirectionCount = function getDirectionCount() {
    return directionCounter++;
};
var getApplianceCount = function getApplianceCount() {
    return applianceCounter++;
};

// a simple struct that will determine which counter to update
var counterStruct = {
    'Ingredient': getIngredientCount,
    'Direction': getDirectionCount,
    'Appliance': getApplianceCount

    //function to parse our response
};var parseJSON = function parseJSON(xhr, content) {
    //parse response (obj will be empty in a 204 updated)
    try {
        // clear out whatever was in the dynamic content section before repopulating
        content.innerHTML = "";
        var obj = JSON.parse(xhr.response);
        console.dir(obj);
        //if recipes in response, add to screen
        if (obj.recipes) {
            var _loop = function _loop(i) {
                // create a new grid item for masonry
                var gridItem = document.createElement('div');
                gridItem.className = "grid-item"; // TODO: make grid "smart" i.e, find out which size would be best

                var title = document.createElement('h2');
                title.textContent = obj.recipes[i].title;

                var description = document.createElement('p');
                description.textContent = obj.recipes[i].description;

                gridItem.appendChild(title);
                gridItem.appendChild(description);

                // container for content that won't be displayed until the grid item is expanded
                var gridItemInnerContent = document.createElement('div');
                gridItemInnerContent.className = "grid-item-inner-content";

                if (obj.recipes[i].price) {
                    var priceDesc = document.createElement('p');
                    priceDesc.textContent = 'Price: ' + obj.recipes[i].price;
                    gridItemInnerContent.appendChild(priceDesc);
                }
                if (obj.recipes[i].calories) {
                    var caloriesDesc = document.createElement('p');
                    caloriesDesc.textContent = 'Price: ' + obj.recipes[i].calories;
                    gridItemInnerContent.appendChild(caloriesDesc);
                }

                gridItem.appendChild(gridItemInnerContent);
                content.appendChild(gridItem);

                // add to masonry layout
                //masonry.appended(gridItem);

                //add an event listener to expand it
                gridItem.addEventListener('click', function (e) {
                    gridItem.classList.toggle('grid-item--selected');
                    // trigger layout
                    masonry.layout();
                });
            };

            for (var i = 0; i < obj.recipes.length; i++) {
                _loop(i);
            }
            masonry.layout();
        }
    } catch (SyntaxError) {}
};

// A helper method to append items to the messageArea
var addMessage = function addMessage(messageArea, messageContent) {
    messageArea.style.display = "block";
    var header = document.createElement("h3");
    var message = document.createTextNode(messageContent);
    header.appendChild(message);
    header.setAttribute('id', "deleteMessage");
    var hideButton = document.getElementById("hideMessageArea");
    messageArea.insertBefore(header, hideButton);
};

//function to handle our response
var handleResponse = function handleResponse(xhr) {
    var content = document.querySelector('#dynamicContent');
    var messageArea = document.querySelector('#messageArea');

    // remove existing message
    var elem = document.getElementById("deleteMessage");
    if (elem) {
        messageArea.removeChild(elem);
    }

    //check the status code
    switch (xhr.status) {
        case 200:
            //success -- only action should be to display results
            break;
        case 201:
            //created
            addMessage(messageArea, "Recipe Successfully Added!");
            break;
        case 204:
            //updated (no response back from server)
            addMessage(messageArea, "Recipe Successfully Updated!");
            return;
        case 400:
            //bad request
            addMessage(messageArea, "Something Went Wrong Adding a Recipe.");
            break;
        case 404:
            //not found
            addMessage(messageArea, "Content Not Found");
            break;
        default:
            //any other status code
            break;
    }
    //parse response 
    parseJSON(xhr, content);
};

//function to send our post request
var sendPost = function sendPost(e, addRecipe) {
    var recipeAction = addRecipe.getAttribute('action');
    var recipeMethod = addRecipe.getAttribute('method');

    var titleField = addRecipe.querySelector('#titleField');
    var descField = addRecipe.querySelector('#descriptionField');
    var priceField = addRecipe.querySelector('#priceField');
    var caloriesField = addRecipe.querySelector('#caloriesField');

    // set up base form data
    var formData = {
        title: titleField.value,
        description: descField.value,
        price: priceField.value,
        calories: caloriesField.value,
        Ingredient: [],
        Direction: [],
        Appliance: []

        // populate ingredients
    };for (var i = 0; i < ingredientCounter; i++) {
        formData.Ingredient.push(addRecipe.querySelector('#Ingredient' + i).value);
    }

    // populate directions
    for (var _i = 0; _i < directionCounter; _i++) {
        formData.Direction.push(addRecipe.querySelector('#Direction' + _i).value);
    }

    // populate appliances
    for (var _i2 = 0; _i2 < applianceCounter; _i2++) {
        formData.Appliance.push(addRecipe.querySelector('#Appliance' + _i2).value);
    }

    var xhr = new XMLHttpRequest();
    xhr.open(recipeMethod, recipeAction);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    //set our requested response type in hopes of a JSON response
    xhr.setRequestHeader('Accept', 'application/json');

    //set our function to handle the response
    xhr.onload = function () {
        return handleResponse(xhr);
    };

    var section = document.querySelector('#addRecipe');
    section.style.display = "none";

    xhr.send(JSON.stringify(formData));

    //prevent the browser's default action (to send the form on its own)
    e.preventDefault();
    //return false to prevent the browser from trying to change page
    return false;
};

var requestUpdate = function requestUpdate(e) {

    var xhr = new XMLHttpRequest();

    xhr.open('get', '/getRecipes');

    xhr.setRequestHeader('Accept', 'application/json');
    //if get request or head request
    xhr.onload = function () {
        return handleResponse(xhr, true);
    };

    //send ajax request
    xhr.send();

    //cancel browser's default action
    e.preventDefault();
    //return false to prevent page redirection from a form
    return false;
};

// creates a new field for the user to add to
var addItem = function addItem(e, list, elemName) {
    var count = counterStruct[elemName]();
    var item = document.createElement('li');
    item.innerHTML = '<input id="' + elemName + count + '" class="text-input" type="text" name="' + elemName + '" />';
    list.appendChild(item);
};

// displays the recipe creation content
var displayAddRecipe = function displayAddRecipe(e) {
    var section = document.querySelector('#addRecipe');
    section.style.display = "block";
};

var hideAddRecipe = function hideAddRecipe(e) {
    var section = document.querySelector('#addRecipe');
    section.style.display = "none";

    // delete existing content
    var applianceList = document.querySelector('#applianceList');
    var directionList = document.querySelector('#directionList');
    var ingredientList = document.querySelector('#ingredientList');
    var titleField = document.querySelector('#titleField');
    var descField = document.querySelector('#descriptionField');
    var priceField = document.querySelector('#priceField');
    var caloriesField = document.querySelector('#caloriesField');

    applianceList.innerHTML = "";
    directionList.innerHTML = "";
    ingredientList.innerHTML = "";
    titleField.innerHTML = "";
    descField.innerHTML = "";
    priceField.innerHTML = "";
    caloriesField.innerHTML = "";
};

var hideMessageArea = function hideMessageArea(e) {
    var section = document.querySelector('#messageArea');
    section.style.display = "none";
};

var init = function init() {
    // set up masonry content
    var grid = document.querySelector('#dynamicContent');
    masonry = new Masonry(grid, {
        percentPosition: true,
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer'
        //horizonatalOrder: true
    });

    //make recipe button
    var displayRecipeButton = document.querySelector("#displayAddRecipe");
    var hideRecipeButton = document.querySelector("#hideAddRecipe");

    // message area
    var hideMessageAreaButton = document.querySelector("#hideMessageArea");

    //grab forms
    var recipeForm = document.querySelector('#recipeForm');
    var getForm = document.querySelector('#getRecipes');

    var ingredientList = document.querySelector('#ingredientList');
    var ingredientButton = document.querySelector('#ingredientButton');

    var directionList = document.querySelector('#directionList');
    var directionButton = document.querySelector('#directionButton');

    var applianceList = document.querySelector('#applianceList');
    var applianceButton = document.querySelector('#applianceButton');

    //create handlers
    var addRecipe = function addRecipe(e) {
        return sendPost(e, recipeForm);
    };
    var getRecipes = function getRecipes(e) {
        return requestUpdate(e);
    };
    var addIngredient = function addIngredient(e) {
        return addItem(e, ingredientList, 'Ingredient');
    };
    var addDirection = function addDirection(e) {
        return addItem(e, directionList, 'Direction');
    };
    var addAppliance = function addAppliance(e) {
        return addItem(e, applianceList, 'Appliance');
    };
    var displayAddRecipeContent = function displayAddRecipeContent(e) {
        return displayAddRecipe(e);
    };
    var hideAddRecipeContent = function hideAddRecipeContent(e) {
        return hideAddRecipe(e);
    };
    var hideMessageAreaContent = function hideMessageAreaContent(e) {
        return hideMessageArea(e);
    };

    //attach submit events (for clicking submit or hitting enter)
    recipeForm.addEventListener('submit', addRecipe);
    getForm.addEventListener('submit', getRecipes);
    ingredientButton.addEventListener('click', addIngredient);
    directionButton.addEventListener('click', addDirection);
    applianceButton.addEventListener('click', addAppliance);
    displayRecipeButton.addEventListener('click', displayAddRecipeContent);
    hideRecipeButton.addEventListener('click', hideAddRecipeContent);
    hideMessageAreaButton.addEventListener('click', hideMessageAreaContent);

    //console.dir(msnry);
    // automatically display known recipes
    requestUpdate();
};

window.onload = init;
