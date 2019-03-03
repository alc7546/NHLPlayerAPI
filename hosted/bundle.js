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

    // Delete present content in html - would be 10x better if I used React
    // For this project but oh well
    while (content.firstChild) {
      content.removeChild(content.firstChild);
    }
    console.log(selectedTeam);
    // Generate cards for each player in the selected team
    for (var item in obj.data.team[selectedTeam]) {
      console.log(item);
      console.log(obj.data.team[selectedTeam][item].goals);
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

      var image = document.createElement('img');
      image.src = obj.data.team[selectedTeam][item].img;

      // Goals
      var pointsContent = document.createElement('p');
      pointsContent.textContent = 'Goals: ' + obj.data.team[selectedTeam][item].goals + ' Assists:' + obj.data.team[selectedTeam][item].assists + ' ';

      container.append(nameHeader);
      container.append(image);
      console.log("yeet");
      container.append(positionHeader);
      container.append(pointsContent);
      card.append(container);
      content.append(card);
    }

    // userList.textContent = users;
    // content.appendChild(userList);
  }
};

// handle responses
var handleResponse = function handleResponse(xhr, parseResponse, selectedTeam) {
  var content = document.querySelector('#content');

  // check status codes
  // need to account for 200, 201, 204, 400, 404
  switch (xhr.status) {
    case 200:
      // success
      //content.innerHTML = `<b>Success</b>`;
      break;
    case 201:
      // created
      //content.innerHTML = `<b>Created</b>`;
      break;
    case 204:
      // updated
      //content.innerHTML = `<b>Updated</b>`;
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

    parseJSON(xhr, content, selectedTeam);
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
      var imgField = form.querySelector('#imgField');

      // Create ajax request
      var _xhr = new XMLHttpRequest();
      _xhr.open(playerMethod, playerAction);

      _xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      _xhr.setRequestHeader('Accept', 'application/json');

      _xhr.onload = function () {
        return handleResponse(_xhr, true);
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
