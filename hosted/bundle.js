'use strict';

// for use with the imgur API
var imgurClientID = '879ac2e671a727c';
var imgurClientSecret = '524c709be991cd1fc64f474056b8802ea09e18b0';

// get reference to masonry.js
// Credit: Masonry Library
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

    // helper method for displaying or hiding a small section
};var displayHideSection = function displayHideSection(sectionID, displayStyle) {
    var section = document.querySelector('#' + sectionID);
    section.style.display = displayStyle;
};

//function to parse our response
var parseJSON = function parseJSON(xhr, content) {
    //parse response (obj will be empty in a 204 updated)
    try {
        (function () {
            // clear out whatever was in the dynamic content section before repopulating
            content.innerHTML = "";
            var obj = JSON.parse(xhr.response);
            console.dir(obj);

            //if recipes in response, add to screen
            if (obj.recipes) {
                var _loop = function _loop(i) {

                    // create a new grid item for masonry
                    var gridItem = document.createElement('div');
                    gridItem.classList.add("grid-item"); // TODO: make grid "smart" i.e, find out which size would be best

                    // calculate appropriate size for grid
                    gridItem.style.width = obj.recipes[i].imageWidth;
                    gridItem.style.height = obj.recipes[i].imageHeight;

                    var title = document.createElement('h2');
                    title.textContent = obj.recipes[i].title;

                    gridItem.appendChild(title);

                    // if all image elements are present, then load image
                    if (obj.recipes[i].image && obj.recipes[i].imageWidth && obj.recipes[i].imageHeight) {
                        var coverImage = document.createElement('img');
                        coverImage.src = obj.recipes[i].image;
                        coverImage.alt = "My Recipe Pic";
                        coverImage.classList.add("cover-image");
                        gridItem.appendChild(coverImage);

                        // calculate appropriate size for grid
                        var width = obj.recipes[i].imageWidth;
                        if (width >= 256) {
                            gridItem.classList.add('grid-item--width2');
                            // cap the width on the image
                            gridItem.getElementsByClassName('cover-image')[0].style.width = "100%";
                        }
                    }

                    // container for content that won't be displayed until the grid item is expanded
                    var gridItemInnerContent = document.createElement('div');
                    gridItemInnerContent.className = "grid-item-inner-content";

                    var description = document.createElement('p');
                    description.textContent = obj.recipes[i].description;
                    gridItemInnerContent.appendChild(description);

                    if (obj.recipes[i].price) {
                        var priceDesc = document.createElement('p');
                        priceDesc.textContent = 'Price: ' + obj.recipes[i].price;
                        gridItemInnerContent.appendChild(priceDesc);
                    }
                    if (obj.recipes[i].calories) {
                        var caloriesDesc = document.createElement('p');
                        caloriesDesc.textContent = 'Calories: ' + obj.recipes[i].calories;
                        gridItemInnerContent.appendChild(caloriesDesc);
                    }
                    if (obj.recipes[i].ingredients.length > 0) {
                        var header = document.createElement('h3');
                        header.textContent = "Ingredients:";
                        var list = document.createElement('ul');
                        obj.recipes[i].ingredients.forEach(function (ingredient) {
                            var node = document.createElement("li");
                            node.textContent = ingredient;
                            list.appendChild(node);
                        });
                        gridItemInnerContent.appendChild(header);
                        gridItemInnerContent.appendChild(list);
                    }
                    if (obj.recipes[i].directions.length > 0) {
                        var _header = document.createElement('h3');
                        _header.textContent = "Directions:";
                        var _list = document.createElement('ol');
                        obj.recipes[i].directions.forEach(function (direction) {
                            var node = document.createElement("li");
                            node.textContent = direction;
                            _list.appendChild(node);
                        });
                        gridItemInnerContent.appendChild(_header);
                        gridItemInnerContent.appendChild(_list);
                    }
                    if (obj.recipes[i].appliances.length > 0) {
                        var _header2 = document.createElement('h3');
                        _header2.textContent = "Appliances Needed:";
                        var _list2 = document.createElement('ul');
                        obj.recipes[i].appliances.forEach(function (appliance) {
                            var node = document.createElement("li");
                            node.textContent = appliance;
                            _list2.appendChild(node);
                        });
                        gridItemInnerContent.appendChild(_header2);
                        gridItemInnerContent.appendChild(_list2);
                    }

                    // add edit and delete buttons
                    var footer = gridItemInnerContent.appendChild(document.createElement('div'));
                    footer.style.textAlign = "center";
                    var deleteForm = footer.appendChild(document.createElement('form'));
                    deleteForm.classList.add("div-50");
                    var deleteButton = deleteForm.appendChild(document.createElement('input'));
                    deleteButton.type = "submit";
                    deleteButton.style.width = "100%";
                    deleteButton.classList.add("button");
                    deleteButton.classList.add("button--close");
                    deleteButton.value = "Delete Recipe";
                    var clickDelete = function clickDelete(e) {
                        return sendDelete(e, obj.recipes[i].title);
                    };
                    deleteButton.addEventListener('click', clickDelete);

                    var editButton = footer.appendChild(document.createElement('input'));
                    editButton.type = "button";
                    editButton.classList.add("button");
                    editButton.classList.add("div-50");
                    editButton.value = "Edit Recipe";
                    var clickEdit = function clickEdit(e) {
                        return displayEditRecipe(obj.recipes[i]);
                    };
                    editButton.addEventListener('click', clickEdit);

                    // finalize grid item content
                    gridItemInnerContent.appendChild(footer);
                    gridItem.appendChild(gridItemInnerContent);
                    content.appendChild(gridItem);

                    // add to masonry layout
                    masonry.appended(gridItem);

                    //add an event listener to expand grid items
                    gridItem.addEventListener('click', function (e) {
                        gridItem.classList.toggle('grid-item--selected');
                        masonry.layout();
                    });
                };

                for (var i = 0; i < obj.recipes.length; i++) {
                    _loop(i);
                }
                // ensure that we only lay out grid when all images are loaded
                // Credit: ImagesLoaded Library
                imagesLoaded('#grid', { background: true }, function () {
                    masonry.layout();
                });
            }
        })();
    } catch (SyntaxError) {}
};

// A helper method to append items to the messageArea
var addMessage = function addMessage(messageArea, messageContent, message) {
    messageArea.style.display = "block";
    var header = document.createElement("h3");
    var messageText = document.createTextNode(message);
    header.appendChild(messageText);
    header.setAttribute('id', "deleteMessage");
    var hideButton = document.getElementById("hideMessageArea");
    messageContent.insertBefore(header, hideButton);
};

// wrapper function to submit an image to imgur when posting
// will upload image to imgur if recipe upload was successful
// before calling default handler function
var makeImgurRequest = function makeImgurRequest(image) {
    return new Promise(function (resolve, reject) {
        // Imgur upload
        if (image) {
            var fd = new FormData();
            fd.append("image", image);

            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://api.imgur.com/3/image.json");
            xhr.onload = function () {
                // this is the happy path, the image upload was successful
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.dir("Image uploaded!");
                    console.dir(JSON.parse(xhr.responseText).data.link);
                    // resolve our promise, allowing our original POST to go through
                    resolve(xhr.responseText);
                } else {
                    reject({
                        status: xhr.status,
                        message: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: xhr.status,
                    message: xhr.statusText
                });
            };
            xhr.setRequestHeader('Authorization', 'Client-ID ' + imgurClientID);
            // display loading widget
            displayHideSection('recipeSubmitLoading', 'block');
            xhr.send(fd);
        } else {
            resolve("");
        }
    });
};

var populateList = function populateList(elements, list) {
    elements.forEach(function (element) {
        addItem(null, list, element);
    });
};

// a function to handle the user clicking the edit button from
// within a recipe
var displayEditRecipe = function displayEditRecipe(recipe) {
    displayHideSection('addRecipe', 'block');

    var applianceList = document.querySelector('#applianceList');
    var directionList = document.querySelector('#directionList');
    var ingredientList = document.querySelector('#ingredientList');
    var titleField = document.querySelector('#titleField');
    var descField = document.querySelector('#descriptionField');
    var priceField = document.querySelector('#priceField');
    var caloriesField = document.querySelector('#caloriesField');

    if (recipe.appliances) {
        populateList(recipe.appliances, applianceList);
    }
    if (recipe.directions) {
        populateList(recipe.directions, directionList);
    }
    if (recipe.ingredients) {
        populateList(recipe.ingredients, ingredientList);
    }

    titleField.value = recipe.title;
    descField.value = recipe.description;
    priceField.value = recipe.price;
    caloriesField.value = recipe.calories;
};

//function to handle our response
var handleResponse = function handleResponse(xhr) {
    // grab all necessary elements
    var content = document.querySelector('#dynamicContent');
    var messageArea = document.querySelector('#messageArea');
    var messageContent = document.querySelector('#messageContent');

    // remove existing message
    var elem = document.getElementById("deleteMessage");
    if (elem) {
        messageContent.removeChild(elem);
    }

    //check the status code
    switch (xhr.status) {
        case 200:
            //success -- only action should be to display results
            break;
        case 201:
            //created
            addMessage(messageArea, messageContent, "Recipe Successfully Added!");
            break;
        case 204:
            //updated (no response back from server)
            addMessage(messageArea, messageContent, "Recipe Successfully Updated!");
            return;
        case 400:
            //bad request
            addMessage(messageArea, messageContent, "Something Went Wrong Adding a Recipe.");
            break;
        case 404:
            //not found
            addMessage(messageArea, messageContent, "Content Not Found");
            break;
        default:
            //any other status code
            break;
    }
    //parse response 
    parseJSON(xhr, content);
};

// function to handle delete request
var sendDelete = function sendDelete(e, title) {
    var xhr = new XMLHttpRequest();
    var url = '/deleteRecipe?title=' + title;

    xhr.open('DELETE', url);

    //xhr.setRequestHeader('Accept', 'application/json');
    //if get request or head request
    xhr.onload = function () {
        return handleResponse(xhr, true);
    };

    //send ajax request
    xhr.send();

    e.preventDefault();

    return false;
};

//function to send our post request
var sendPost = function sendPost(e, addRecipe, image) {
    // grab all necessary elements for a POST request
    var recipeAction = addRecipe.getAttribute('action');
    var recipeMethod = addRecipe.getAttribute('method');

    var titleField = addRecipe.querySelector('#titleField');
    var descField = addRecipe.querySelector('#descriptionField');
    var priceField = addRecipe.querySelector('#priceField');
    var caloriesField = addRecipe.querySelector('#caloriesField');
    var imageField = document.querySelector('#imageField');

    // set up base form data
    var formData = {
        image: "", // image will always start as empty, will be populated when we retrieve the image from imgur
        imageHeight: "",
        imageWidth: "",
        title: titleField.value,
        description: descField.value,
        price: priceField.value,
        calories: caloriesField.value,
        Ingredient: [],
        Direction: [],
        Appliance: []
    };

    // populate ingredients
    for (var i = 0; i < ingredientCounter; i++) {
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

    xhr.onload = function () {
        return handleResponse(xhr);
    };

    //set our function to handle the response
    // if we're uploading an image, send it through our imgur API handler
    // then process response as normal
    makeImgurRequest(imageField.files[0]).then(function (imageData) {
        var image = "";
        var width = "";
        var height = "";

        if (imageData) {
            var data = JSON.parse(imageData).data;
            image = data.link;
            width = data.width;
            height = data.height;
        }

        formData.imageWidth = width;
        formData.imageHeight = height;
        formData.image = image;
        return formData;
    }).then(function (tempFormData) {
        xhr.send(JSON.stringify(tempFormData));
    }).then(function () {
        // clear the modal and all fields
        hideAddRecipe();
    }).catch(function (error) {
        console.dir(error);
        var messageArea = document.querySelector('#messageArea');
        var messageContent = document.querySelector('#messageContent');
        hideAddRecipe();
        addMessage(messageArea, messageContent, "Something went wrong uploading your image. Please add your recipe again.");
    });

    //prevent the browser's default action (to send the form on its own)
    e.preventDefault();

    //return false to prevent the browser from trying to change page
    return false;
};

var requestUpdate = function requestUpdate(e) {
    var xhr = new XMLHttpRequest();

    var url = '/getRecipes';
    // apply filters
    var filter = document.getElementById('filterInput');

    if (filter) {
        url = url + '?title=' + filter.value;
    }

    xhr.open('get', url);

    xhr.setRequestHeader('Accept', 'application/json');
    //if get request or head request
    xhr.onload = function () {
        return handleResponse(xhr, true);
    };

    //send ajax request
    xhr.send();

    //cancel browser's default action
    if (e) {
        e.preventDefault();
    }
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

// responsible for hiding the addRecipe section and clearing it's contents
var hideAddRecipe = function hideAddRecipe(e) {
    displayHideSection('addRecipe', 'none');
    displayHideSection('recipeSubmitLoading', 'none');

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
    titleField.value = "";
    descField.value = "";
    priceField.value = "";
    caloriesField.value = "";
};

// a method that displays newly added recipes and closes the message area
var hideMessageArea = function hideMessageArea(e) {
    // automatically display newly added recipes
    displayHideSection('messageArea', 'none');
    requestUpdate();
};

var init = function init() {
    // set up masonry content
    var grid = document.querySelector('#dynamicContent');
    masonry = new Masonry(grid, {
        columnWidth: 256,
        gutter: 10,
        itemSelector: '.grid-item'
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
        return sendPost(e, recipeForm, "");
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
        return displayHideSection('addRecipe', 'block');
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

    // attach event listener to change text of image label
    var input = document.querySelector('#imageField');
    var label = document.querySelector('#imageLabel');

    var labelVal = label.innerHTML;

    input.addEventListener('change', function (e) {
        if (input.files[0]) {
            label.innerHTML = input.files[0].name;
        } else {
            label.innerHTML = labelVal;
        }
    });

    //console.dir(msnry);
    // automatically display known recipes
    requestUpdate();
};

window.onload = init;
