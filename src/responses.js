
const data = require('./teamData.js');

// function to respond with a json object
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// function to respond w/o json body
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// get roster
const getTeam = (request, response, params) => {
  const responseJSON = {
    data,
  };
  // Check in case of bad params
  if (params.team && data.team[params.team]) {
    responseJSON.data = data.team[params.team];
  }
  respondJSON(request, response, 200, responseJSON);
};

// Set up for HEAD but not entirely sure when it would ever actually be used in this project?
const getTeamMeta = (request, response) => respondJSONMeta(request, response, 200);

// Add player w/ params
const addPlayer = (request, response, body) => {
  const responseJSON = {
    message: 'All parameters are required.',
  };
  let selection = data.team[body.team][body.name];

  if (!body.name || !body.position || !body.goals || !body.assists || !body.img) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // Set code to created if params exist
  let responseCode = 201;

  // Check if it exists or not
  if (selection) {
    responseCode = 204;
  } else {
    selection = {};
  }

  // add/update the fields
  selection.name = body.name;
  selection.position = body.position;
  selection.goals = body.goals;
  selection.assists = body.assists;
  selection.img = body.img;

  // set back to the file
  data.team[body.team][body.name] = selection;
  // Set created message w/ JSON
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // 204 otherwise
  return respondJSONMeta(request, response, responseCode);
};

// Standard 404 message
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  return respondJSON(request, response, 404, responseJSON);
};

// 404 meta
const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  notFound,
  notFoundMeta,
  getTeam,
  getTeamMeta,
  addPlayer,
};
