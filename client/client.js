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
        
        //if users in response, add to screen
        if(obj.users) {
        const userList = document.createElement('p');
        const users = JSON.stringify(obj.users);
        userList.textContent = users;
        content.appendChild(userList);
        }
    }
    catch(SyntaxError) {}
};

//function to handle our response
const handleResponse = (xhr) => {
    const content = document.querySelector('#content');

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
const sendPost = (e, nameForm) => {
    const nameAction = nameForm.getAttribute('action');
    const nameMethod = nameForm.getAttribute('method');

    const nameField = nameForm.querySelector('#nameField');
    const ageField = nameForm.querySelector('#ageField');

    const xhr = new XMLHttpRequest();
    xhr.open(nameMethod, nameAction);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    //set our requested response type in hopes of a JSON response
    xhr.setRequestHeader ('Accept', 'application/json');

    //set our function to handle the response
    xhr.onload = () => handleResponse(xhr);

    const formData = `name=${nameField.value}&age=${ageField.value}`;

    xhr.send(formData);

    //prevent the browser's default action (to send the form on its own)
    e.preventDefault();
    //return false to prevent the browser from trying to change page
    return false;
};

const requestUpdate = (e, userForm) => {
    //grab url field 
    const url = userForm.querySelector('#urlField').value;
    //grab method selected
    const method = userForm.querySelector('#methodSelect').value;

    const xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.setRequestHeader('Accept', 'application/json');
    //if get request or head request
    if(method == 'get') {
        xhr.onload = () => handleResponse(xhr, true);
    } else {
        xhr.onload = () => handleResponse(xhr, false);
    }

    //send ajax request
    xhr.send();

    //cancel browser's default action
    e.preventDefault();
    //return false to prevent page redirection from a form
    return false;
};

const init = () => {
    //grab form
    const nameForm = document.querySelector('#nameForm');
    const userForm = document.querySelector('#userForm');

    //create handler
    const addUser = (e) => sendPost(e, nameForm);
    const getUsers = (e) => requestUpdate(e, userForm);

    //attach submit event (for clicking submit or hitting enter)
    nameForm.addEventListener('submit', addUser);
    userForm.addEventListener('submit', getUsers);
};

window.onload = init;