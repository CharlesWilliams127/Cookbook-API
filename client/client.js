// for use with the imgur API
const imgurClientID = '879ac2e671a727c';
const imgurClientSecret = '524c709be991cd1fc64f474056b8802ea09e18b0';

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

// helper method for displaying or hiding a small section
const displayHideSection = (sectionID, displayStyle) => {
    const section = document.querySelector(`#${sectionID}`);
    section.style.display = displayStyle;
}

//function to parse our response
const parseJSON = (xhr, content) => {
    //parse response (obj will be empty in a 204 updated)
    try {
        // clear out whatever was in the dynamic content section before repopulating
        content.innerHTML = "";
        const obj = JSON.parse(xhr.response);
        console.dir(obj);

        //if recipes in response, add to screen
        if(obj.recipes) {
            for (let i = 0; i < obj.recipes.length; i++) {

                // create a new grid item for masonry
                const gridItem = document.createElement('div');
                gridItem.classList.add("grid-item"); // TODO: make grid "smart" i.e, find out which size would be best

                // calculate appropriate size for grid
                gridItem.style.width = obj.recipes[i].imageWidth;
                gridItem.style.height = obj.recipes[i].imageHeight;

                const title = document.createElement('h2');
                title.textContent = obj.recipes[i].title;

                const description = document.createElement('p');
                description.textContent = obj.recipes[i].description;

                gridItem.appendChild(title);
                gridItem.appendChild(description);
                
                // if all image elements are present, then load image
                if (obj.recipes[i].image && obj.recipes[i].imageWidth && obj.recipes[i].imageHeight) {
                    const coverImage = document.createElement('img');
                    coverImage.src = obj.recipes[i].image;
                    coverImage.alt = "My Recipe Pic";
                    coverImage.classList.add("cover-image");
                    gridItem.appendChild(coverImage);

                    // calculate appropriate size for grid
                    //gridItem.style.width = `${obj.recipes[i].imageWidth}px`;
                    // gridItem.style.height = `${obj.recipes[i].imageHeight}px`;
                    const width = obj.recipes[i].imageWidth;
                    if ( width >= 512) {
                        gridItem.classList.add('grid-item--width2');
                        // cap the width on the image
                        gridItem.getElementsByClassName('cover-image')[0].style.width = "100%";
                    }
                }
                
                // container for content that won't be displayed until the grid item is expanded
                const gridItemInnerContent = document.createElement('div');
                gridItemInnerContent.className = "grid-item-inner-content";

                if(obj.recipes[i].price) {
                    const priceDesc = document.createElement('p');
                    priceDesc.textContent = `Price: ${obj.recipes[i].price}`;
                    gridItemInnerContent.appendChild(priceDesc);
                }
                if(obj.recipes[i].calories) {
                    const caloriesDesc = document.createElement('p');
                    caloriesDesc.textContent = `Calories: ${obj.recipes[i].calories}`;
                    gridItemInnerContent.appendChild(caloriesDesc);
                }
                if(obj.recipes[i].ingredients.length > 0) {
                    const header = document.createElement('h3');
                    header.textContent = "Ingredients:";
                    const list = document.createElement('ul');
                    obj.recipes[i].ingredients.forEach(ingredient => {
                        const node = document.createElement("li");
                        node.textContent = ingredient;
                        list.appendChild(node);
                    });
                    gridItemInnerContent.appendChild(header);
                    gridItemInnerContent.appendChild(list);
                }
                if(obj.recipes[i].directions.length > 0) {
                    const header = document.createElement('h3');
                    header.textContent = "Directions:";
                    const list = document.createElement('ol');
                    obj.recipes[i].directions.forEach(direction => {
                        const node = document.createElement("li");
                        node.textContent = direction;
                        list.appendChild(node);
                    });
                    gridItemInnerContent.appendChild(header);
                    gridItemInnerContent.appendChild(list);
                }
                if(obj.recipes[i].appliances.length > 0) {
                    const header = document.createElement('h3');
                    header.textContent = "Appliances Needed:";
                    const list = document.createElement('ul');
                    obj.recipes[i].appliances.forEach(appliance => {
                        const node = document.createElement("li");
                        node.textContent = appliance;
                        list.appendChild(node);
                    });
                    gridItemInnerContent.appendChild(header);
                    gridItemInnerContent.appendChild(list);
                }

                gridItem.appendChild(gridItemInnerContent);
                content.appendChild(gridItem);

                // add to masonry layout
                masonry.appended(gridItem);

                //add an event listener to expand it
                gridItem.addEventListener( 'click', function( e ) {
                    // allow item to change sizes 
                    gridItem.classList.toggle('grid-item--selected');
                    // trigger layout
                    masonry.layout();
                });
            }
            imagesLoaded( '#grid', { background: true }, function() {
                masonry.layout();
            });
        }
    }
    catch(SyntaxError) {}
};

// A helper method to append items to the messageArea
const addMessage = (messageArea, messageContent, message) => {
    messageArea.style.display = "block";
    const header = document.createElement("h3");
    const messageText = document.createTextNode(message);
    header.appendChild(messageText);
    header.setAttribute('id', "deleteMessage");
    const hideButton = document.getElementById("hideMessageArea")
    messageContent.insertBefore(header, hideButton);
};

// wrapper function to submit an image to imgur when posting
// will upload image to imgur if recipe upload was successful
// before calling default handler function
const makeImgurRequest = (image) => {
    return new Promise((resolve, reject) => {
        // Imgur upload
        if(image){
            const fd = new FormData();
            fd.append("image", image);

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "https://api.imgur.com/3/image.json");
            xhr.onload = () => {
                // this is the happy path, the image upload was successful
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.dir("Image uploaded!");
                    console.dir(JSON.parse(xhr.responseText).data.link);
                    // resolve our promise, allowing our original POST to go through
                    resolve(xhr.responseText);
                }
                else {
                    reject({
                        status: xhr.status,
                        message: xhr.statusText
                    });
                }
            };
            xhr.onerror = () => {
                reject({
                    status: xhr.status,
                    message: xhr.statusText
                });
            }
            xhr.setRequestHeader('Authorization', `Client-ID ${imgurClientID}`);
            // display loading widget
            displayHideSection('recipeSubmitLoading', 'block');
            xhr.send(fd);
        }
        else {
            resolve("");
        }
    });
}

//function to handle our response
const handleResponse = (xhr) => {
    // grab all necessary elements
    const content = document.querySelector('#dynamicContent');
    const messageArea = document.querySelector('#messageArea');
    const messageContent = document.querySelector('#messageContent');

    // remove existing message
    const elem = document.getElementById("deleteMessage");
    if (elem) {
        messageContent.removeChild(elem);
    }

    //check the status code
    switch(xhr.status) {
        case 200: //success -- only action should be to display results
        break;
        case 201: //created
        addMessage(messageArea, messageContent, "Recipe Successfully Added!");
        break;
        case 204: //updated (no response back from server)
        addMessage(messageArea, messageContent, "Recipe Successfully Updated!");
        return;
        case 400: //bad request
        addMessage(messageArea, messageContent, "Something Went Wrong Adding a Recipe.");
        break;
        case 404: //not found
        addMessage(messageArea, messageContent, "Content Not Found");
        break;
        default: //any other status code
        break;
    }
    //parse response 
    parseJSON(xhr, content);
};

//function to send our post request
const sendPost = (e, addRecipe, image) => {
    // grab all necessary elements for a POST request
    const recipeAction = addRecipe.getAttribute('action');
    const recipeMethod = addRecipe.getAttribute('method');

    const titleField = addRecipe.querySelector('#titleField');
    const descField = addRecipe.querySelector('#descriptionField');
    const priceField = addRecipe.querySelector('#priceField');
    const caloriesField = addRecipe.querySelector('#caloriesField');
    const imageField = document.querySelector('#imageField');

    // set up base form data
    const formData = {
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
    for (let i = 0; i < ingredientCounter; i++) {
        formData.Ingredient.push(addRecipe.querySelector(`#Ingredient${i}`).value);
    }

    // populate directions
    for (let i = 0; i < directionCounter; i++) {
        formData.Direction.push(addRecipe.querySelector(`#Direction${i}`).value);
    }

    // populate appliances
    for (let i = 0; i < applianceCounter; i++) {
        formData.Appliance.push(addRecipe.querySelector(`#Appliance${i}`).value);
    }

    const xhr = new XMLHttpRequest();
    xhr.open(recipeMethod, recipeAction);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    //set our requested response type in hopes of a JSON response
    xhr.setRequestHeader ('Accept', 'application/json');

    xhr.onload = () => handleResponse(xhr);

    //set our function to handle the response
    // if we're uploading an image, send it through our imgur API handler
    // then process response as normal
    makeImgurRequest(imageField.files[0])
    .then((imageData) => {
        let image = "";
        let width = "";
        let height = "";

        if (imageData) {
            const data = JSON.parse(imageData).data;
            image = data.link;
            width = data.width;
            height = data.height;
        }

        formData.imageWidth = width;
        formData.imageHeight = height;
        formData.image = image;
        return formData;
    })
    .then((tempFormData) => {
        xhr.send(JSON.stringify(tempFormData));
    })
    .then (() => {
        // clear the modal and all fields
        hideAddRecipe();
    })
    .catch((error) => {
        console.dir(error);
        const messageArea = document.querySelector('#messageArea');
        const messageContent = document.querySelector('#messageContent');
        hideAddRecipe();
        addMessage(messageArea, messageContent, "Something went wrong uploading your image. Please add your recipe again.");
    });

    //prevent the browser's default action (to send the form on its own)
    e.preventDefault();

    //return false to prevent the browser from trying to change page
    return false;
};

const requestUpdate = (e) => {
    const xhr = new XMLHttpRequest();

    let url = '/getRecipes';
    // apply filters
    const filter = document.getElementById('filterInput');

    if (filter) {
        url = `${url}?title=${filter.value}`;
    }

    xhr.open('get', url);

    xhr.setRequestHeader('Accept', 'application/json');
    //if get request or head request
    xhr.onload = () => handleResponse(xhr, true);

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
const addItem = (e, list, elemName) => {
    const count = counterStruct[elemName]();
    const item = document.createElement('li');
    item.innerHTML = `<input id="${elemName}${count}" class="text-input" type="text" name="${elemName}" />`;
    list.appendChild(item);
};

// responsible for hiding the addRecipe section and clearing it's contents
const hideAddRecipe = (e) => {
    displayHideSection('addRecipe', 'none');
    displayHideSection('recipeSubmitLoading', 'none');

    // delete existing content
    const applianceList = document.querySelector('#applianceList');
    const directionList = document.querySelector('#directionList');
    const ingredientList = document.querySelector('#ingredientList');
    const titleField = document.querySelector('#titleField');
    const descField = document.querySelector('#descriptionField');
    const priceField = document.querySelector('#priceField');
    const caloriesField = document.querySelector('#caloriesField');

    applianceList.innerHTML = "";
    directionList.innerHTML = "";
    ingredientList.innerHTML = "";
    titleField.value = "";
    descField.value = "";
    priceField.value = "";
    caloriesField.value = "";
}

// a method that displays newly added recipes and closes the message area
const hideMessageArea = (e) => {
    // automatically display newly added recipes
    displayHideSection('messageArea', 'none');
    requestUpdate();
    
}

const init = () => {
    // set up masonry content
    const grid = document.querySelector('#dynamicContent');
    masonry = new Masonry(grid, {
        columnWidth: 256,
        gutter: 10,
        itemSelector: '.grid-item',
    });

    //make recipe button
    const displayRecipeButton = document.querySelector("#displayAddRecipe");
    const hideRecipeButton = document.querySelector("#hideAddRecipe");

    // message area
    const hideMessageAreaButton = document.querySelector("#hideMessageArea");

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
    const addRecipe = (e) => sendPost(e, recipeForm, "");
    const getRecipes = (e) => requestUpdate(e);
    const addIngredient = (e) => addItem(e, ingredientList, 'Ingredient');
    const addDirection = (e) => addItem(e, directionList, 'Direction');
    const addAppliance = (e) => addItem(e, applianceList, 'Appliance');
    const displayAddRecipeContent = (e) => displayHideSection('addRecipe', 'block');
    const hideAddRecipeContent = (e) => hideAddRecipe(e);
    const hideMessageAreaContent = (e) => hideMessageArea(e);

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