// Users going to be purely in memory
const users = {};

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

// return user objects as JSON
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };
  respondJSON(request, response, 200, responseJSON);
};

// meta for object w/ 200
const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

// function to add a user from a POST body
const addUser = (request, response, body) => {
  // default json message
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  // We need to check to make sure the user has put in both fields
  // Should probably have more validation
  // Either way, send 400 error if these are triggered
  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default code to 201
  let responseCode = 201; // created

  // if user already exists, update w/ 204
  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {}; // not a great way to store this in general
  }

  // add/update fields
  users[body.name].name = body.name;
  users[body.name].age = body.age;

  // Set created message w/ JSON
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // 204 otherwise
  return respondJSONMeta(request, response, responseCode);
};

// Basically the same as notFound 100%
// Not real w/ JSON message and id
// const notReal = (request, response) => {
//   const responseJSON = {
//     message: 'The page you are looking for was not found',
//     id: 'notFound',
//   };

//   return respondJSON(request, response, 404, responseJSON);
// };

// // Not real w/ meta
// const notRealMeta = (request, response) => {
//   respondJSONMeta(request, response, 404);
// };

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
  getUsers,
  getUsersMeta,
  addUser,
  //   notReal,
  //   notRealMeta,
  notFound,
  notFoundMeta,
};
