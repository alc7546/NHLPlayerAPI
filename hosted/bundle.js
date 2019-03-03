'use strict';

var parseJSON = function parseJSON(xhr, content, selectedTeam) {
  // Double check if it updated
  if (xhr.status == 204) {
    return;
  }
  var obj = JSON.parse(xhr.response);
  console.dir(obj);

  // if users are in the response, show them
  if (obj.data) {

    // Delete present content in html
    while (content.firstChild) {
      content.removeChild(content.firstChild);
    }
    // Generate cards for each player in the selected team
    for (var item in obj.data.team[selectedTeam]) {

      // Player card and container holding data
      var card = document.createElement('div');
      var container = document.createElement('div');
      card.className = "card";
      container.className = "container";

      // Name
      var nameHeader = document.createElement('h4');
      nameHeader.textContent = '' + obj.data.team[selectedTeam][item].name;

      // Position
      var positionHeader = document.createElement('p');
      positionHeader.textContent = ' ' + obj.data.team[selectedTeam][item].position;

      // Image
      var image = document.createElement('img');
      image.src = obj.data.team[selectedTeam][item].img;

      // Goals
      var pointsContent = document.createElement('p');
      pointsContent.textContent = 'Goals: ' + obj.data.team[selectedTeam][item].goals + ' Assists:' + obj.data.team[selectedTeam][item].assists + ' ';

      // Hookup
      container.append(nameHeader);
      container.append(image);
      console.log("yeet");
      container.append(positionHeader);
      container.append(pointsContent);
      card.append(container);
      content.append(card);
    }
  }
};

// handle responses
var handleResponse = function handleResponse(xhr, parseResponse, selectedTeam) {
  var content = document.querySelector('#content');

  // check status codes
  // need to account for 200, 201, 204, 400, 404
  // displaying to console for most
  switch (xhr.status) {
    case 200:
      // success
      console.dir(xhr.status);
      break;
    case 201:
      // created
      console.dir(xhr.status);
      break;
    case 204:
      // updated
      console.dir(xhr.status);
      break;
    case 400:
      // bad request
      console.dir(xhr.status);
      break;
    default:
      // any other status code // might change
      console.dir(xhr.status);
      break;
  }

  // Only parse response on get requests 
  // Can prob always do this?
  if (parseResponse) {
    parseJSON(xhr, content, selectedTeam);
  }
};

var sendAjax = function sendAjax(e, form) {
  // Handle the GET
  if (form.id == "teamSelections") {
    var selectedTeam = form.querySelector("#teamSelect").value;
    console.log(selectedTeam);
    var url = form.getAttribute("action");
    var method = form.getAttribute("method");
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Accept', 'application/json');
    if (method == 'get') {
      xhr.onload = function () {
        return handleResponse(xhr, true, selectedTeam);
      };
    } else {
      //head request no body responses
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
      var imgField = form.querySelector('#imgField');

      // Create ajax request
      var _xhr = new XMLHttpRequest();
      _xhr.open(playerMethod, playerAction);

      _xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      _xhr.setRequestHeader('Accept', 'application/json');

      _xhr.onload = function () {
        return handleResponse(_xhr, true, teamField);
      };

      //Assign data
      var formData = 'name=' + nameField.value + '&position=' + positionField.value + '&team=' + teamField.value + '&goals=' + goalsField.value + '&assists=' + assistsField.value + '&img=' + imgField.value;
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
    return sendAjax(e, playerForm);
  };
  var getTeam = function getTeam(e) {
    return sendAjax(e, teamSelections);
  };

  // Attach to events

  playerForm.addEventListener('submit', addPlayer);
  teamSelections.addEventListener('submit', getTeam);
};

window.onload = init;
