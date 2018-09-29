'use strict';

var ingredientCounter = 0;
var directionCounter = 0;

// helper functions to increment variables for keeping track of items in lists
var getIngredientCount = function getIngredientCount() {
    return ingredientCounter++;
};
var getDirectionCount = function getDirectionCount() {
    return directionCounter++;
};

// a simple struct that will determine which counter to update
var counterStruct = {
    'Ingredient': getIngredientCount,
    'Direction': getDirectionCount

    //function to parse our response
};var parseJSON = function parseJSON(xhr, content) {
    //parse response (obj will be empty in a 204 updated)
    try {
        var obj = JSON.parse(xhr.response);
        console.dir(obj);

        //if message in response, add to screen
        if (obj.message) {
            var p = document.createElement('p');
            p.textContent = 'Message: ' + obj.message;
            content.appendChild(p);
        }

        //if users in response, add to screen
        if (obj.users) {
            var userList = document.createElement('p');
            var users = JSON.stringify(obj.users);
            userList.textContent = users;
            content.appendChild(userList);
        }
    } catch (SyntaxError) {}
};

//function to handle our response
var handleResponse = function handleResponse(xhr) {
    var content = document.querySelector('#content');

    //check the status code
    switch (xhr.status) {
        case 200:
            //success
            content.innerHTML = '<b>Success</b>';
            break;
        case 201:
            //created
            content.innerHTML = '<b>Create</b>';
            break;
        case 204:
            //updated (no response back from server)
            content.innerHTML = '<b>Updated (No Content)</b>';
            return;
        case 400:
            //bad request
            content.innerHTML = '<b>Bad Request</b>';
            break;
        case 404:
            //not found
            content.innerHTML = '<b>Resource Not Found</b>';
            break;
        default:
            //any other status code
            content.innerHTML = 'Error code not implemented by client.';
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
    //let ingredients = [];

    var formData = {
        title: titleField.value,
        ingredients: []
    };

    for (var i = 0; i < ingredientCounter; i++) {
        formData.ingredients.push(addRecipe.querySelector('#Ingredient' + i).value);
    }

    console.dir(formData);

    var xhr = new XMLHttpRequest();
    xhr.open(recipeMethod, recipeAction);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    //set our requested response type in hopes of a JSON response
    xhr.setRequestHeader('Accept', 'application/json');

    //set our function to handle the response
    xhr.onload = function () {
        return handleResponse(xhr);
    };

    //const formData = `title=${titleField.value}&age=${ageField.value}`;

    xhr.send(JSON.stringify(formData));

    //prevent the browser's default action (to send the form on its own)
    e.preventDefault();
    //return false to prevent the browser from trying to change page
    return false;
};

var requestUpdate = function requestUpdate(e, userForm) {
    //grab url field 
    var url = userForm.querySelector('#urlField').value;
    //grab method selected
    var method = userForm.querySelector('#methodSelect').value;

    var xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.setRequestHeader('Accept', 'application/json');
    //if get request or head request
    if (method == 'get') {
        xhr.onload = function () {
            return handleResponse(xhr, true);
        };
    } else {
        xhr.onload = function () {
            return handleResponse(xhr, false);
        };
    }

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
    item.innerHTML = '<input id="' + elemName + count + '" type="text" name="' + elemName + '" />';
    list.appendChild(item);
};

var init = function init() {
    //grab forms
    var recipeForm = document.querySelector('#recipeForm');
    //const getForm = document.querySelector('#getRecipes');

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
    //const getRecipes = (e) => requestUpdate(e, getForm);
    var addIngredient = function addIngredient(e) {
        return addItem(e, ingredientList, 'Ingredient');
    };
    var addDirection = function addDirection(e) {
        return addItem(e, directionList, 'Direction');
    };
    var addAppliance = function addAppliance(e) {
        return addItem(e, applianceList, 'Appliance');
    };

    //attach submit events (for clicking submit or hitting enter)
    recipeForm.addEventListener('submit', addRecipe);
    //getForm.addEventListener('submit', getRecipes);
    ingredientButton.addEventListener('click', addIngredient);
    directionButton.addEventListener('click', addDirection);
    applianceButton.addEventListener('click', addAppliance);
};

window.onload = init;
