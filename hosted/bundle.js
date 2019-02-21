'use strict';

var parseJSON = function parseJSON(xhr, content) {
  // Double check if it updated
  if (xhr.status == 204) {
    return;
  }
  var obj = JSON.parse(xhr.response);
  console.dir(obj);

  // if users are in the response, show them
  if (obj.data) {
    var userList = document.createElement('p');
    var users = JSON.stringify(obj.data.wild);
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
  if (form.id == "teamSelections") {
    var url = form.getAttribute("action");
    var method = form.getAttribute("method");
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Accept', 'application/json');
    if (method == 'get') {
      xhr.onload = function () {
        return handleResponse(xhr, true);
      };
    } else {
      //head request?
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
    }
  // Prevent page from changing
  e.preventDefault();
  return false;
};
// Set-up
var init = function init() {
  // Grab forms
  var playerForm = document.querySelector('#playerForm');
  var teamSelections = document.querySelector('#teamSelections');

  // Create handlers
  var addPlayer = function addPlayer(e) {
    return sendPost(e, playerForm);
  };
  var getTeam = function getTeam(e) {
    return sendPost(e, teamSelections);
  };

  // Attach to events

  playerForm.addEventListener('submit', addPlayer);
  teamSelections.addEventListener('submit', getTeam);
};

window.onload = init;
