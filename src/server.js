const http = require('http'); // pull in html module
// url module for parsing url string
const url = require('url');
// querystring module for parsing querystring from url
const query = require('querystring');
// pull in handlers
const htmlHandler = require('./htmlResponses');
const jsonHandler = require('./responses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;


// handle POST Requests
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    const res = response;

    // upload through byte stream and then reassemble
    const body = [];

    // if upload errors out, throw bad request
    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    // on 'data' is for each byte of data that comes in
    // from the upload. Add to byte array
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // on end of stream
    request.on('end', () => {
      // combine byte array with concat
      // convert to string
      const bodyString = Buffer.concat(body).toString();
      // parse with query
      const bodyParams = query.parse(bodyString);

      // pass to addUser in jsonHandler
      jsonHandler.addUser(request, res, bodyParams);
    });
  }
};


const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  // Switch case here, determine between different request methods

  switch (request.method) {
    case 'POST':
      handlePost(request, response, parsedUrl);
      break;
    case 'GET':
      if (parsedUrl.pathname === '/') {
        // homepage -> index
        htmlHandler.getIndex(request, response);
      } else if (parsedUrl.pathname === '/style.css') {
        // stylesheet -> send
        htmlHandler.getCSS(request, response);
      } else if (parsedUrl.pathname === '/getUsers') {
        jsonHandler.getUsers(request, response);
      } else if (parsedUrl.pathname === '/notReal') {
        jsonHandler.notFound(request, response);
      } else {
        jsonHandler.notFound(request, response);
      }
      break;
    case 'HEAD':
      if (parsedUrl.pathname === '/getUsers') {
        jsonHandler.getUsersMeta(request, response);
      } else if (parsedUrl.pathname === '/notReal') {
        jsonHandler.notFoundMeta(request, response);
      } else {
        jsonHandler.notFoundMeta(request, response);
      }
      // Could just be an else statement,
      // but making sure /notReal is explicitly stated in switch statement
      break;
    default:
      // send 404
      jsonHandler.notFound(request, response);
      break;
  }
};

// Create server
http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1:${port}`);
