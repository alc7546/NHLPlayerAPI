'use strict';

var parseJSON = function parseJSON(xhr, content) {
  // Double check if it updated
  if (xhr.status == 204) {
    return;
  }
  var obj = JSON.parse(xhr.response);
  console.dir(obj);

  // if message in response, add it to the screen
  if (obj.message) {
    var p = document.createElement('p');
    p.textContent = 'Message: ' + obj.message;
    content.appendChild(p);
  }

  // if users are in the response, show them
  if (obj.users) {
    var userList = document.createElement('p');
    var users = JSON.stringify(obj.users);
    userList.textContent = users;
    content.appendChild(userList);
  }
};

// handle responses
var handleResponse = function handleResponse(xhr, parseResponse) {
  var content = document.querySelector('#content');

  // check status codes
  // need to account for 200, 201, 204, 400, 404
  switch (xhr.status) {
    case 200:
      // success
      content.innerHTML = '<b>Success</b>';
      break;
    case 201:
      // created
      content.innerHTML = '<b>Created</b>';
      break;
    case 204:
      // updated
      content.innerHTML = '<b>Updated</b>';
      break;
    case 400:
      // bad request
      content.innerHTML = '<b>Bad Request</b>';
      break;
    default:
      // any other status code // might change
      content.innerHTML = 'Resource Not Found';
      break;
  }

  if (parseResponse) {

    parseJSON(xhr, content);
  } else {
    console.log('received');
  }
};

var sendPost = function sendPost(e, form) {
  // There's prob a better way to handle this
  // But, it would have to check the form either way
  // And would need to send different xhr sends 
  // So I just chunked them both together
  if (form.id == "userForm") {
    var url = form.querySelector('#urlField').value;
    var method = form.querySelector('#methodSelect').value;
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Accept', 'application/json');
    if (method == 'get') {
      xhr.onload = function () {
        return handleResponse(xhr, true);
      };
    } else {
      xhr.onload = function () {
        return handleResponse(xhr, false);
      };
    }
    xhr.send();
  } else // POST
    {
      // PROJECT API
      var playerAction = form.getAttribute('action');
      var playerMethod = form.getAttribute('method');

      // Grab fields from querySelector
      var nameField = form.querySelector('#nameField');
      var positionField = form.querySelector('#positionField');
      var teamField = form.querySelector('#teamField');
      var goalsField = form.querySelector('#goalsField');
      var assistsField = form.querySelector('#assistsField');

      // Create ajax request
      var _xhr = new XMLHttpRequest();
      _xhr.open(playerMethod, playerAction);

      _xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      _xhr.setRequestHeader('Accept', 'application/json');

      _xhr.onload = function () {
        return handleResponse(_xhr, true);
      };

      //Assign data
      var formData = 'name=' + nameField.value + '&position=' + positionField.value + '&team=' + teamField.value + '&goals=' + goalsField.value + '&assists=' + assistsField.value;
      _xhr.send(formData);

      // HOMEWORK API
      // const nameAction = form.getAttribute('action');
      // const nameMethod = form.getAttribute('method');

      // // Grab from querySelector
      // const nameField = form.querySelector('#nameField');
      // const ageField = form.querySelector('#ageField');

      // // Create ajax request
      // const xhr = new XMLHttpRequest();
      // // set method and url
      // xhr.open(nameMethod, nameAction);

      // // set headers
      // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      // xhr.setRequestHeader('Accept', 'application/json');

      // xhr.onload = () => handleResponse(xhr,true);
      // // Assign formdata
      // const formData = `name=${nameField.value}&age=${ageField.value}`;

      // xhr.send(formData);
    }
  // Prevent page from changing
  e.preventDefault();
  return false;
};
// Set-up
var init = function init() {
  // Grab forms
  var nameForm = document.querySelector('#nameForm');
  var userForm = document.querySelector('#userForm');
  var playerForm = document.querySelector('#playerForm');

  // Create handlers
  var addUser = function addUser(e) {
    return sendPost(e, nameForm);
  };
  var getUsers = function getUsers(e) {
    return sendPost(e, userForm);
  };
  var addPlayer = function addPlayer(e) {
    return sendPost(e, playerForm);
  };

  // Attach to events
  nameForm.addEventListener('submit', addUser);
  userForm.addEventListener('submit', getUsers);
  playerForm.addEventListener('submit', addPlayer);
};

window.onload = init;
